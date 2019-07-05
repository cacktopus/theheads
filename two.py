import mmap
import time

import cv2
import numpy as np


def main():
    filename = "gridbuf"

    with open(filename, "rb") as f:
        mm = mmap.mmap(f.fileno(), 0, mmap.MAP_SHARED, mmap.PROT_READ)

        x = np.ndarray(
            shape=(400, 400),   # TODO: read this
            dtype=np.float32,
            buffer=mm,
        )

        while True:
            # print(x.data)
            # print(len(bytes(x.data)))

            addr = x.__array_interface__['data'][0]
            # print(addr)

            # print(x.flags)
            # print(x)

            # print(np.mean(x))
            img = x
            img = cv2.resize(img, None, fx=2.0, fy=2.0)
            img = cv2.flip(img, 0)

            cv2.imshow('frame', img)
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break

            time.sleep(0.05)


if __name__ == '__main__':
    main()
