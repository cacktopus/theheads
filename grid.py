import asyncio
import math
from functools import reduce
from typing import Tuple

import numpy as np

import png


class Grid:
    def __init__(self, xmin, ymin, xmax, ymax, img_size):
        """:param img_size (width, height)"""
        assert ymax > ymin
        assert xmax > xmin

        self.xmin = xmin
        self.ymin = ymin

        self.xmax = xmax
        self.ymax = ymax

        self.img_size_x, self.img_size_y = img_size

        self._grids = {}

    def get_grid(self, name: str):
        if name not in self._grids:
            g = np.zeros((self.img_size_y, self.img_size_x), dtype=np.float32)  # note flip of img_size
            self._grids[name] = g
        return self._grids[name]

    def idx(self, x: float, y: float):
        xidx = int(math.floor((x - self.xmin) / (self.xmax - self.xmin) * self.img_size_x))
        yidx = int(math.floor((y - self.ymin) / (self.ymax - self.ymin) * self.img_size_y))

        if xidx >= self.img_size_x or yidx >= self.img_size_y:
            return None

        res = yidx, xidx  # Notice swap here
        return res

    def idx_to_xy(self, idx: Tuple[int, int]):
        yidx, xidx = idx  # notice swap here

        x_sz, y_sz = self.get_pixel_size()

        x = self.xmin + x_sz * (xidx + 0.5)
        y = self.ymin + y_sz * (yidx + 0.5)

        return x, y

    def set(self, name: str, x: float, y: float, val: float):
        g = self.get_grid(name)
        idx = self.idx(x, y)
        g[idx] = val

    def get(self, name: str, x: float, y: float) -> float:
        g = self.get_grid(name)
        idx = self.idx(x, y)
        return idx and float(g[idx])

    def combined(self):
        if len(self._grids):
            return reduce(np.multiply, self._grids.values())
        else:
            return np.zeros((self.img_size_y, self.img_size_x), dtype=np.float32)

    def to_png(self):
        shape = (self.img_size_y, self.img_size_x)
        buf = np.zeros((shape[0], shape[1], 4), dtype=np.uint8)

        focus = self.focus()

        g = self.combined()
        clipped = np.clip(g, 0, 1.0)
        channel = (clipped * 255).round().astype(np.uint8)
        # channel = np.random.randint(40, 200, size=(self.y_res, self.x_res), dtype=np.uint8)

        buf[focus[0], focus[1], 0] = 255
        buf[focus[0], focus[1], 2] = 255
        buf[..., 3] = 255
        buf[..., 1] = channel

        buf = np.flipud(buf)
        return png.write_png(buf.tobytes(), self.img_size_x, self.img_size_y)

    def focus(self):
        g = self.combined()
        m = np.argmax(g, axis=None)
        return np.unravel_index(m, g.shape)

    def get_pixel_size(self):
        """Returns the size of a grid cell (in meters)"""
        x = (self.xmax - self.xmin) / self.img_size_x
        y = (self.ymax - self.ymin) / self.img_size_y

        return x, y

    async def decay(self):
        while True:
            await asyncio.sleep(0.25)
            for g in self._grids.values():
                g *= 0.90


the_grid = Grid(-10, -20, 10, 20, (100, 200))  # TODO: not global!


def main():
    g = Grid(-10, -20, 10, 20, (40, 80))
    print(g.idx(-10, -20))

    print(g.idx(10, 0))
    print(g.idx(9.9999, 0))

    g.set(0, 0, 0.98)
    print(g.get(0, 0))


if __name__ == '__main__':
    main()
