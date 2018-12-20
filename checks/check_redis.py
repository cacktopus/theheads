import sys

import redis


def check() -> int:
    hostport = sys.argv[1]
    host, portstr = hostport.split(":")
    port = int(portstr)
    client = redis.StrictRedis(host=host, port=port, socket_connect_timeout=1, socket_timeout=1)
    resp = client.info()
    if "redis_version" in resp:
        return 0
    return 2


def main():
    rc = 2
    try:
        val = check()
        rc = int(val)
    except Exception as e:
        print(e)
        rc = 2
    else:
        print("All good")
    finally:
        sys.stdout.flush()
        sys.stderr.flush()
        sys.exit(rc)


if __name__ == '__main__':
    main()
