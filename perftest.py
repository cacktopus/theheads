import numpy as np

from grid import Grid
from transformations import Vec


def main():
    g = Grid(-10, -10, 10, 10, (400, 400), installation=None, spawner=False)

    g.trace_grid("camera-01", Vec(0, 0), Vec(7.5, 5.5))

    print(np.sum(g._grids["camera-01"]))


if __name__ == '__main__':
    main()
