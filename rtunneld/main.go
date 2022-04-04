package rtunneld

import (
	"fmt"
	"github.com/cacktopus/theheads/rtunneld/config"
	"github.com/cacktopus/theheads/rtunneld/healthcheck"
	"github.com/cacktopus/theheads/rtunneld/util"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
	"github.com/vrischmann/envconfig"
	"golang.org/x/crypto/ssh"
	"gopkg.in/yaml.v2"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"reflect"
	"runtime/debug"
	"runtime/pprof"
	"strings"
	"time"
)

var (
	activeConnections = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "rtunneld_active_connections",
		//Help: "rtunneld active connections",
	})

	listenerStart = promauto.NewCounter(prometheus.CounterOpts{
		Name: "rtunneld_listener_start",
		//Help: "rtunneld_listener_start",
	})
)

const (
	closedNetworkText = "use of closed network connection"
)

func allowedCopyErrors(err error) error {
	switch err {
	case nil:
	case io.EOF:
		err = nil
	case err.(*net.OpError):
		if strings.Contains(err.Error(), closedNetworkText) {
			err = nil
		}
	}
	return err
}

func handleClient(tunnel *config.Tunnel, remote net.Conn) {
	cLog := log.WithField("component", "proxy")
	cLog.Print("dialing")
	local, err := net.Dial("tcp", tunnel.Dial)
	if err != nil {
		cLog.Warn("Unable to connect to local service")
		return
	}

	defer local.Close()
	defer remote.Close()
	done := make(chan bool, 2)

	activeConnections.Inc()
	defer activeConnections.Dec()

	go func() {
		_, err := io.Copy(local, remote)
		err = allowedCopyErrors(err)
		if err != nil {
			cLog.Print("remote->local unexpected error:", reflect.TypeOf(err), err.Error())
		}
		done <- true
	}()

	go func() {
		_, err := io.Copy(remote, local)
		err = allowedCopyErrors(err)
		if err != nil {
			cLog.Print("local->remote unexpected error:", reflect.TypeOf(err), err.Error())
		}
		done <- true
	}()

	cLog.Print("closing connections")
	<-done
}

func listen(cfg *config.Tunnel, client *ssh.Client, closeListener util.BroadcastCloser) error {
	log.WithField("tunnelName", cfg.Name).Println("Starting listener on:", cfg.Listen)
	listener, err := client.Listen("tcp", cfg.Listen)
	if err != nil {
		panic(err)
	}

	listenerStart.Inc()

	go func() {
		<-closeListener.Chan()
		listener.Close()
	}()

	defer listener.Close()

	for {
		remote, err := listener.Accept()
		if err != nil {
			return err
		}
		go handleClient(cfg, remote)
	}
}

func connectAndListen(tunnel *config.Tunnel, sshConfig *ssh.ClientConfig, closeListener util.BroadcastCloser) error {
	log.Println("Connecting to gateway:", tunnel.Gateway)
	client, err := ssh.Dial("tcp", tunnel.Gateway, sshConfig)
	if err != nil {
		panic(err)
	}

	return listen(tunnel, client, closeListener)
}

func setupLogging(cfg *config.Config) {
	if cfg.Stdout == "" {
		log.SetOutput(os.Stdout)
	} else {
		logfile := os.ExpandEnv(cfg.Stdout)
		file, err := os.OpenFile(logfile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			panic(err)
		}
		log.SetOutput(file)
	}
	log.SetLevel(log.DebugLevel)
}

func runTunnel(cfg *config.Config, index int) {
	for {
		closeListener := util.NewBroadcastCloser()

		if index >= len(cfg.Tunnels) {
			healthcheck.Remove(index)
			continue
		}

		tunnel := &cfg.Tunnels[index]

		keyFile := os.ExpandEnv(tunnel.Keyfile)
		log.Println("Using key", keyFile)
		buffer, err := ioutil.ReadFile(keyFile)
		if err != nil {
			panic(err)
		}

		key, err := ssh.ParsePrivateKey(buffer)
		if err != nil {
			panic(err)
		}

		sshConfig := &ssh.ClientConfig{
			User: "tunnel",
			Auth: []ssh.AuthMethod{
				// ssh.Password("your_password/"),
				ssh.PublicKeys(key),
			},
			HostKeyCallback: ssh.InsecureIgnoreHostKey(), // TODO
			Timeout:         10 * time.Second,
		}

		var checker healthcheck.Checker
		switch {
		case tunnel.Healthcheck == "":
			panic("Health check not specified")
		case strings.HasPrefix(tunnel.Healthcheck, "http://"):
			c := &healthcheck.HttpChecker{
				URL: fmt.Sprintf("http://%s/api/health", tunnel.Listen),
			}
			checker = c.Check
		case tunnel.Healthcheck == "ssh":
			c := &healthcheck.SshChecker{}
			checker = c.Check
		default:
			panic("Unknown health check")
		}

		go healthcheck.HealthCheck(tunnel, sshConfig, closeListener, index, checker)

		quit := make(chan bool)
		go func() {
			select {
			case <-quit:
			}
		}()

		err = connectAndListen(tunnel, sshConfig, closeListener)
		log.WithError(err).Error("Got error from listener")
		time.Sleep(10 * time.Second)
		select {
		case quit <- true:
		default:
		}
		log.Info("Retrying gateway connection")
	}
}

func getStackTraceHandler(w http.ResponseWriter, r *http.Request) {
	stack := debug.Stack()
	w.Write(stack)
	pprof.Lookup("goroutine").WriteTo(w, 2)
}

func loadConfig(cfgFile string) (*config.Config, error) {
	content, err := ioutil.ReadFile(cfgFile)
	if err != nil {
		return nil, errors.Wrap(err, "read config file")
	}

	cfg := &config.Config{}
	err = yaml.Unmarshal(content, cfg)
	if err != nil {
		return nil, errors.Wrap(err, "unmarshal config")
	}

	return cfg, nil
}

func Run() {
	env := &config.Env{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	log.SetOutput(os.Stdout)
	log.SetFormatter(&log.JSONFormatter{})

	hostname, err := os.Hostname()
	if err != nil {
		panic("Unable to determine hostname: " + err.Error())
	}

	configKey := fmt.Sprintf("/rtunneld/config/%s.yaml", hostname)
	log.WithField("key", configKey).Info("config key")

	cfg, err := loadConfig(env.ConfigFile)
	if err != nil {
		panic(errors.Wrap(err, "load config"))
	}
	setupLogging(cfg)

	log.WithFields(log.Fields{
		"cfg": cfg,
	}).Info("startup")

	go func() {
		addr := ":8050" // TODO

		if cfg.Metrics != "" {
			addr = cfg.Metrics
		}

		http.Handle("/metrics", promhttp.Handler())
		http.HandleFunc("/_stack", getStackTraceHandler)
		http.HandleFunc("/health", func(res http.ResponseWriter, req *http.Request) {
			res.Write([]byte("ok\n"))
		})
		http.ListenAndServe(addr, nil) // TODO: handle reload
	}()

	highest := 0
	for ; highest < len(cfg.Tunnels); highest++ {
		// simply spawn 10 tunnels for now
		go runTunnel(cfg, highest)
	}

	select {}
}
