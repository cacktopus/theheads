import numpy as np

from grid import Grid


def main():
    g = Grid(-10, -10, 10, 10, (400, 400), installation=None)
    g._grids["camera-00"] = np.random.rand(400, 400)
    g._grids["camera-01"] = np.random.rand(400, 400)

    for i in range(5000):
        g.combined()


if __name__ == '__main__':
    main()
