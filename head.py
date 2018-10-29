import base64
import json
import math
import os
import random
import sys
import time

# import etcd3

from multiprocessing import Pool, Lock

from lease_rpc import grant
from rpc import lock, get
from rpc_util import key
from txn_rpc import txn

stdout_lock = Lock()

hosts = [
    "192.168.1.10",
    "192.168.1.11",
    "192.168.1.12",
]


def get_lock(args):
    pid, lockname, t0 = args

    def out(*args, **kw):
        t = time.time() - t0
        with stdout_lock:
            print("{:x} | {:>6.2f} |".format(pid, t), *args, **kw)
            sys.stdout.flush()

    out("connected")

    next_tick = 5 - (time.time() % 5)
    out("delay {:.2f}".format(next_tick))

    start = int(math.ceil(next_tick))
    ttl = random.randint(start, start + 60)

    out("getting lease, ttl:", ttl)
    lease_id = grant(ttl, pid)['ID']

    time.sleep(next_tick)

    out("calling lock")
    mylock = lock(lockname, lease_id)
    lock_key = key(mylock)
    out("mylock:", lock_key, json.dumps(mylock))
    read = get(lock_key)
    out("readlock:", key(read), json.dumps(read))

    # res = txn()
    # print(res)

    out("I'm here:", ttl)


def main():
    pid = os.getpid()
    lockname = "lock-{}".format(pid).encode()
    t0 = time.time()

    start = 0x40
    num = 10

    with Pool(num) as p:
        p.map(get_lock, [(i, lockname, t0) for i in range(start, start + num)])


if __name__ == '__main__':
    main()
