import math

import numpy as np


class Grid:
    def __init__(self, xmin, ymin, xmax, ymax, x_resolution, y_resolution):
        assert ymax > ymin
        assert xmax > xmin

        self.xmin = xmin
        self.ymin = ymin

        self.xmax = xmax
        self.ymax = ymax

        self.x_res = x_resolution
        self.y_res = y_resolution

        self._grid = np.zeros((y_resolution, x_resolution), dtype=np.float32)

    def idx(self, x: float, y: float):
        xidx = int(math.floor((x - self.xmin) / (self.xmax - self.xmin) * self.x_res))
        yidx = int(math.floor((y - self.ymin) / (self.ymax - self.ymin) * self.y_res))

        if xidx >= self.x_res or yidx >= self.y_res:
            return None

        return xidx, yidx

    def set(self, x: float, y: float, val: float):
        idx = self.idx(x, y)
        self._grid[idx] = val

    def get(self, x: float, y: float) -> float:
        idx = self.idx(x, y)
        return float(self._grid[idx])


def main():
    g = Grid(-10, -20, 10, 20, 40, 80)
    print(g.idx(-10, -20))

    print(g.idx(10, 0))
    print(g.idx(9.9999, 0))

    g.set(0, -2, 0.77)
    print(g.get(0, -2))


if __name__ == '__main__':
    main()
