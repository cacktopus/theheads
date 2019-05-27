import mmap
import time

import numpy as np


def main():
    filename = "gridbuf"

    with open(filename, "rb") as f:
        mm = mmap.mmap(f.fileno(), 0, mmap.MAP_SHARED, mmap.PROT_READ)

        x = np.frombuffer(buffer=mm, dtype=np.float32)

        while True:
            print(x.data)
            print(len(bytes(x.data)))

            addr = x.__array_interface__['data'][0]
            print(addr)

            print(x.flags)
            print(x)

            print(np.mean(x))

            time.sleep(1)


if __name__ == '__main__':
    main()
