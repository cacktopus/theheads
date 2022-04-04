package web

import (
	"fmt"
	"github.com/cacktopus/theheads/web/serf/client"
	"github.com/cacktopus/theheads/web/systemd_analyze"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
	"net/http"
	"net/http/cgi"
	"net/http/httputil"
	"net/url"
	"os"
	"os/user"
	"path"
	"strconv"
	"strings"
)

func Run() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	strPort, ok := os.LookupEnv("HTTP_PORT")
	if !ok {
		strPort = "80"
	}

	port, err := strconv.Atoi(strPort)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/health", func(res http.ResponseWriter, req *http.Request) {
		res.Write([]byte("ok\n"))
	})

	http.HandleFunc("/grafana/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:3000", "/grafana", res, req)
	})

	http.HandleFunc("/g/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:3000", "/g", res, req)
	})

	http.HandleFunc("/camera/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:5000", "/camera", res, req)
	})

	http.HandleFunc("/c/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:5000", "/c", res, req)
	})

	http.HandleFunc("/boss/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:8081", "/boss", res, req)
	})

	http.HandleFunc("/b/", func(res http.ResponseWriter, req *http.Request) {
		serveRevereProxy("http://localhost:8081", "/b", res, req)
	})

	http.HandleFunc("/systemd-plot.svg", func(res http.ResponseWriter, req *http.Request) {
		svg, err := systemd_analyze.Plot()
		if err != nil {
			res.WriteHeader(500)
			return
		}
		res.Header().Add("Content-Type", "image/svg+xml")
		_, _ = res.Write(svg)
	})

	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/monero/metrics", moneroMetrics)

	http.HandleFunc("/git/heads.git/", func(res http.ResponseWriter, req *http.Request) {
		// remember to put an empty `git-daemon-export-ok` file in a bare directory

		req.URL.Path = strings.TrimPrefix(req.URL.Path, "/git")

		usr, err := user.Lookup("git")
		switch err.(type) {
		case nil:
		case user.UnknownUserError:
			res.WriteHeader(404)
			return
		default:
			res.WriteHeader(500)
			return
		}

		dir := path.Join(usr.HomeDir, "git")

		handler := cgi.Handler{
			Path: "/usr/bin/git", // TODO
			Args: []string{"http-backend"},
			Dir:  dir,
			Env: []string{
				fmt.Sprintf("GIT_PROJECT_ROOT=%s", dir),
			},
		}
		handler.ServeHTTP(res, req)
	})

	errCh := make(chan error)

	go func() {
		errCh <- http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), nil)
	}()

	go monitorTemperatures(errCh)
	go turnOffLeds(logger, errCh)
	go turnOffHDMI(logger, errCh)
	go monitorLowVoltage(logger, errCh)
	go client.Run(errCh)

	for err := range errCh {
		if err != nil {
			panic(err)
		}
	}
}

func serveRevereProxy(target string, rootPath string, res http.ResponseWriter, req *http.Request) {
	dst, _ := url.Parse(target)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, rootPath)
	req.Header.Add("X-WEBAUTH-USER", "jsu")
	proxy := httputil.NewSingleHostReverseProxy(dst)
	proxy.ServeHTTP(res, req)
}
