import base64
import os
import random
import sys
import time

import etcd3

from multiprocessing import Pool, Lock

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
            print("{} | {:>6.2f} |".format(pid, t), *args, **kw)
            sys.stdout.flush()

    host = random.choice(hosts)
    out("start", host)

    conn = etcd3.Etcd3Client(host=host)

    out("connected")

    next_tick = 15 - (time.time() % 15)
    out("delay {:.2f}".format(next_tick))

    time.sleep(next_tick)

    out("calling lock")
    lock = conn.lock(lockname, ttl=10)

    out("lock: acquired={}, name={}, key={}, uuid={}, ttl={}".format(
        lock.is_acquired(),
        lock.name,
        lock.key,
        base64.b64encode(lock.uuid),
        lock.ttl,
    ))

    out("acquiring")
    acquired = lock.acquire()

    out(" - I GOT THE LOCK - " if acquired else "I didn't get the lock")

    out("lock: acquired={}, name={}, key={}, uuid={}, ttl={}".format(
        lock.is_acquired(),
        lock.name,
        lock.key,
        base64.b64encode(lock.uuid),
        lock.ttl,
    ))

    out("sleeping")
    time.sleep(120)


def main():
    pid = os.getpid()
    lockname = "lock-{}".format(pid)
    t0 = time.time()

    with Pool(5) as p:
        p.map(get_lock, [(i, lockname, t0) for i in range(5)])


if __name__ == '__main__':
    main()
