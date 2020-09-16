package main

import (
	"context"
	"fmt"
	"github.com/hashicorp/consul/api"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strings"
	"time"
)

var building = prometheus.NewGaugeVec(
	prometheus.GaugeOpts{
		Namespace: "buildbot",
		Name:      "building",
		Help:      "Buildbot is building",
	},
	[]string{
		"service",
	},
)

var buildCount = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Namespace: "buildbot",
		Name:      "built",
		Help:      "Buildbot build counts",
	},
	[]string{
		"result",
		"service",
	},
)

func init() {
	prometheus.MustRegister(building)
	prometheus.MustRegister(buildCount)
}

func repoDst(repo string) string {
	parts := strings.Split(repo, "/")
	return parts[len(parts)-1]
}

func cd(dir string, callback func() error) error {
	curdir, err := os.Getwd()
	if err != nil {
		return errors.Wrap(err, "getwd")
	}

	err = os.Chdir(dir)
	if err != nil {
		return errors.Wrap(err, "chdir")
	}

	defer func() {
		os.Chdir(curdir)
	}()

	return callback()
}

func git(fmtStr string, args ...interface{}) (string, error) {
	gitPath := "/usr/bin/git"
	formatted := fmt.Sprintf(fmtStr, args...)
	log.Println(fmt.Sprintf("running: %s %s", gitPath, formatted))
	cmd := exec.Command(gitPath, strings.Fields(formatted)...)
	stdoutStderr, err := cmd.CombinedOutput()
	if err == nil {
		return string(stdoutStderr), nil
	}

	return string(stdoutStderr), errors.New("git error: " + string(stdoutStderr)) // TODO: create specific error type
}

func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		// directory already exists
		return true, nil
	}
	if !os.IsNotExist(err) {
		return false, err
	}
	return false, nil
}

func symlinkExists(path string) (bool, error) {
	file, err := os.Lstat(path)

	if err == nil {
		return file.Mode()&os.ModeSymlink == os.ModeSymlink, nil
	}

	if !os.IsNotExist(err) {
		return false, err
	}

	return false, nil
}

func restart(service string) error {
	log.Println("restarting", service)
	cmd := exec.Command("sudo", "-n", "/bin/systemctl", "restart", service)
	output, err := cmd.CombinedOutput()
	if err != nil {
		msg := fmt.Sprintf("Error restarting service %s: %s", service, string(output))
		log.Println(msg)
		return errors.New(msg)
	}
	return nil
}

func build(repo *Repo, service, commit string) error {
	log.Println("building", service, commit)

	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	serviceDir := path.Join(home, "builds", service)

	ok, err := exists(serviceDir)
	if err != nil {
		return errors.Wrap(err, "checking service directory")
	}

	if !ok {
		os.MkdirAll(serviceDir, 0750)
	}

	target := path.Join(serviceDir, commit)
	prodLink := path.Join(home, "builds", service, "prod")

	targetExists, err := exists(target)
	if err != nil {
		return errors.Wrap(err, "checking target directory")
	}

	if targetExists {
		log.Println(fmt.Sprintf("target already exists: %s", target))
		prodLinkExists, err := symlinkExists(prodLink)
		if err != nil {
			return errors.Wrap(err, "checking prod link")
		}
		if prodLinkExists {
			log.Println("prod exists:", prodLink)
			link, err := os.Readlink(prodLink)
			if err != nil {
				return errors.Wrap(err, "reading prod lnk")
			}
			if link != commit {
				log.Println("prod is incorrect")
				err := os.Remove(prodLink)
				if err != nil {
					return errors.Wrap(err, "removing prod link")
				}
				log.Println("creating prod link")
				err = os.Symlink(commit, prodLink)
				if err != nil {
					return errors.Wrap(err, "creating prod link")
				}
				restart(service)
			}
		} else {
			log.Println("creating prod link")
			err := os.Symlink(commit, prodLink)
			if err != nil {
				return errors.Wrap(err, "creating prod link")
			}
			restart(service)
		}
		return nil
	}

	err = buildGit(repo, target, prodLink, home, service, commit)
	if err != nil {
		buildCount.With(prometheus.Labels{"result": "fail", "service": service}).Inc()
		return errors.Wrap(err, "building")
	}
	buildCount.With(prometheus.Labels{"result": "ok", "service": service}).Inc()
	return restart(service)
}

func setOrigin(origin string) error {
	output, err := git("remote get-url origin")
	if err != nil {
		_, err2 := git("remote add origin %s", origin)
		if err2 != nil {
			return err
		}
	} else if origin != string(output) {
		_, err2 := git("remote set-url origin %s", origin)
		if err2 != nil {
			return err
		}
	}
	return nil
}

func gitFetchRemote(repo *Repo, dst string) error {
	_, err := git("init -q --bare %s", dst)
	if err != nil {
		return err
	}

	return cd(dst, func() error {
		_, err = git("config --local uploadpack.allowreachablesha1inwant true")
		if err != nil {
			return err
		}

		err = setOrigin(repo.Url)
		if err != nil {
			return err
		}

		// TODO: timing
		_, err = git("fetch")
		if err != nil {
			return err
		}

		return nil
	})
}

func cloneLocalAndBuild(localRepo, commit, service string) error {
	_, err := git("init -q build")
	if err != nil {
		return err
	}

	return cd("build", func() error {
		_, err = git("remote add origin %s", localRepo)
		if err != nil {
			return err
		}

		_, err = git("fetch -q origin --depth 1 %s", commit)
		if err != nil {
			return err
		}

		_, err = git("reset -q --hard %s", commit)
		if err != nil {
			return err
		}

		log.Println("building:", service)

		cmd := exec.Command(fmt.Sprintf("./services/%s/build.sh", service))
		output, err := cmd.CombinedOutput()
		log.Println(string(output)) // TODO: split lines
		if err != nil {
			return errors.Wrap(err, "building")
		}

		return nil
	})
}

func buildGit(repo *Repo, target, prodLink, home, service, commit string) error {
	building.With(prometheus.Labels{"service": service}).Set(1)
	defer func() {
		building.With(prometheus.Labels{"service": service}).Set(0)
	}()

	log.Println("target:", target)
	buildDir := path.Join(home, "builds")
	log.Println(buildDir)
	githome := path.Join(home, "git2")
	// TODO:
	githomeExists, err := exists(githome)
	if !githomeExists {
		os.MkdirAll(githome, 0750)
	}
	dst := repoDst(repo.Url)
	localRepo := path.Join(githome, dst)

	err = cd(githome, func() error {
		return gitFetchRemote(repo, dst)
	})
	if err != nil {
		return err
	}

	tmpDir, err := ioutil.TempDir("", "build")
	if err != nil {
		return err
	}
	log.Println("tmp dir:", tmpDir)

	return cd(tmpDir, func() error {
		err := cloneLocalAndBuild(localRepo, commit, service)
		if err != nil {
			return err
		}

		err = os.Rename("build", target)
		if err != nil {
			return errors.Wrap(err, "rename build")
		}

		// atomic prod link swap
		// TODO: below can probably merge with existing link changing code
		err = os.Symlink(commit, "prod")
		if err != nil {
			return errors.Wrap(err, "symlink")
		}

		err = os.Rename("prod", prodLink)
		if err != nil {
			return errors.Wrap(err, "rename prod")
		}

		return nil
	})
}

type Repo struct {
	Url  string
	Name string
}

type ServiceConfig struct {
	Version string
	Repo    string
}

func monitor(kv *api.KV, hostname string) error {
	var rev uint64 = 0

	for {
		options := &api.QueryOptions{
			WaitIndex: rev,
			WaitTime:  time.Minute,
		}

		ctx, _ := context.WithCancel(context.Background())
		log.Println(fmt.Sprintf("Watching for changes, rev=%d", rev))
		_, meta, err := kv.Keys("buildbot", "", options.WithContext(ctx))

		if err != nil {
			//TODO: better backoff here?
			log.Println("error watching for changes:", err)
			time.Sleep(time.Second)
			continue
		}

		repoList, _, err := kv.List("/buildbot/repos", nil)
		if err != nil {
			log.Println("error reading repo list:", err)
			time.Sleep(time.Second)
			continue
		}

		log.Println("Checking for anything to build")

		repos := make(map[string]*Repo)

		for _, item := range repoList {
			repo := &Repo{}
			err = yaml.Unmarshal(item.Value, repo)
			if err != nil {
				log.Println("error parsing yaml:", err)
			} else {
				log.Println("Found repo:", repo.Name, repo.Url)
				repos[repo.Name] = repo
			}
		}

		rev = meta.LastIndex
		log.Println(fmt.Sprintf("New rev found, rev=%d", rev))

		consulPath := fmt.Sprintf("buildbot/instances/%s", hostname)
		log.Println("Looking for instances here:", consulPath)
		keys, _, err := kv.Keys(consulPath, "", nil)

		if err != nil {
			return errors.Wrap(err, "reading services from consul")
		}

		for _, key := range keys {
			log.Println("key:", key)
			parts := strings.Split(key, "/")
			service := parts[len(parts)-1]
			log.Println("service:", service)

			serviceConfigPath := fmt.Sprintf("buildbot/service-config/%s.yaml", service)
			res, _, err := kv.Get(serviceConfigPath, nil)
			if err != nil {
				log.Println("error: reading version from consul:", err)
				continue
			}

			if res == nil {
				log.Println("error: service-config not found for:", service)
				continue
			}

			serviceConfig := &ServiceConfig{}
			err = yaml.Unmarshal(res.Value, serviceConfig)
			if err != nil {
				log.Println("error parsing yaml:", serviceConfigPath)
				continue
			}

			repo, ok := repos[serviceConfig.Repo]
			if !ok {
				log.Println("Unknown repo:", serviceConfig.Repo)
				continue
			}

			err = build(repo, service, serviceConfig.Version)
			if err != nil {
				log.Println(fmt.Sprintf("error: building %s: %s", service, err.Error()))
				continue
			}
		}
	}
}

func main() {
	client, err := api.NewClient(api.DefaultConfig())
	if err != nil {
		panic(err)
	}

	hostname, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	log.Println("host:", hostname)

	// Get a handle to the KV API
	kv := client.KV()

	go func() {
		http.HandleFunc("/health", func(res http.ResponseWriter, req *http.Request) {
			res.Write([]byte("ok\n"))
		})
		http.Handle("/metrics", promhttp.Handler())
		err := http.ListenAndServe("0.0.0.0:8084", nil)
		if err != nil {
			panic(err)
		}
	}()

	err = monitor(kv, hostname)
	if err != nil {
		log.Fatalf("monitor error:", err.Error())
	}
}
