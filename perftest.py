import random

import numpy as np

from grid import Grid
from transformations import Vec


def rand():
    return -20 + 40 * random.random()


def main():
    random.seed(46)
    grid = Grid(-10, -10, 10, 10, (400, 400), installation=None, spawner=False)

    g1 = grid.get_grid("camera-01")

    ct = g1.ctypes
    print("\n".join(a for a in dir(ct) if not a.startswith("_")))

    print(list(ct.strides))

    for i in range(1000):
        grid.trace_grid("camera-01", Vec(rand(), rand()), Vec(rand(), rand()))

    print(np.sum(g1))


if __name__ == '__main__':
    main()
