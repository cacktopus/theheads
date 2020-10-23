import mmap
import time

import numpy as np


def main():
    filename = "buf"
    # with open(filename, "wb") as f:
    #     f.truncate(4 * 4)

    with open(filename, "r+b") as f:
        mm = mmap.mmap(f.fileno(), 0, mmap.MAP_SHARED, mmap.PROT_WRITE)

        x = np.frombuffer(buffer=mm, dtype=np.float32)

        while True:
            x[:] = np.random.uniform(0.0, 1.0, 4)

            print(x.data)
            print(bytes(x.data))
            print(len(bytes(x.data)))

            addr = x.__array_interface__['data'][0]
            print(addr)

            print(x.flags)
            print(x)

            time.sleep(1)


if __name__ == '__main__':
    main()
