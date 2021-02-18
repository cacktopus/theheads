Sample rtunneld config

```
tunnels:
- name: ssh
  listen: "127.0.0.1:2222"
  gateway: "192.241.228.33:22"
  keyfile: /home/rtunneld/.ssh/tunnel.id_rsa
  dial: "127.0.0.1:22"
  healthcheck: ssh
```

Sample ~/.ssh/config

```
User pi

Host git01
	HostName 192.241.228.33

Host rpi3-01-inet
	Hostname 127.0.0.1
	Port 2222
	ProxyJump jsu@git01
```

Sample ssh command line

```
ssh -J 192.241.228.33 127.0.0.1 -p 2222
```
