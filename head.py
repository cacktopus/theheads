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
from rpc import lock

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

    host = random.choice(hosts)
    out("start", host)

    # conn = etcd3.Etcd3Client(host=host)

    out("connected")

    next_tick = 15 - (time.time() % 15)
    out("delay {:.2f}".format(next_tick))

    start = int(math.ceil(next_tick))
    ttl = random.randint(start, start + 30)
    # lock = conn.lock(lockname, ttl=10)

    out("getting lease, ttl:", ttl)
    lease_id = grant(ttl, pid)['ID']

    time.sleep(next_tick)

    out("calling lock")
    mylock = lock(lockname, lease_id)
    out("mylock:", json.dumps(mylock))

    # out("lock: acquired={}, name={}, key={}, uuid={}, ttl={}".format(
    #     lock.is_acquired(),
    #     lock.name,
    #     lock.key,
    #     base64.b64encode(lock.uuid),
    #     lock.ttl,
    # ))

    # out("acquiring")
    # acquired = lock.acquire()

    # out(" - I GOT THE LOCK - " if acquired else "I didn't get the lock")

    out("I'm here:", ttl)

    # out("lock: acquired={}, name={}, key={}, uuid={}, ttl={}".format(
    #     lock.is_acquired(),
    #     lock.name,
    #     lock.key,
    #     base64.b64encode(lock.uuid),
    #     lock.ttl,
    # ))


def main():
    pid = os.getpid()
    lockname = "lock-{}".format(pid).encode()
    t0 = time.time()

    start = 0x20
    num = 10

    with Pool(num) as p:
        p.map(get_lock, [(i, lockname, t0) for i in range(start, start + num)])


if __name__ == '__main__':
    main()
