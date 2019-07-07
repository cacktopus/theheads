import numpy as np

from grid import Grid
from transformations import Vec


def main():
    grid = Grid(-10, -10, 10, 10, (400, 400), installation=None, spawner=False)

    g1 = grid.get_grid("camera-01")

    ct = g1.ctypes
    print("\n".join(a for a in dir(ct) if not a.startswith("_")))

    print(list(ct.strides))

    for i in range(1000):
        grid.trace_grid("camera-01", Vec(0, 0), Vec(7.5, 5.5))

    print(np.sum(g1))


if __name__ == '__main__':
    main()
