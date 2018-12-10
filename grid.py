import asyncio
import math

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

        self._grid = np.zeros((self.img_size_y, self.img_size_x), dtype=np.float32)  # note flip of img_size

    def idx(self, x: float, y: float):
        xidx = int(math.floor((x - self.xmin) / (self.xmax - self.xmin) * self.img_size_x))
        yidx = int(math.floor((y - self.ymin) / (self.ymax - self.ymin) * self.img_size_y))

        if xidx >= self.img_size_x or yidx >= self.img_size_y:
            return None

        res = yidx, xidx  # Notice swap here
        return res

    def set(self, x: float, y: float, val: float):
        idx = self.idx(x, y)
        self._grid[idx] = val

    def get(self, x: float, y: float) -> float:
        idx = self.idx(x, y)
        return idx and float(self._grid[idx])

    def to_png(self):
        shape = self._grid.shape
        buf = np.zeros((shape[0], shape[1], 4), dtype=np.uint8)

        clipped = np.clip(self._grid, 0, 1.0)
        channel = (clipped * 255).round().astype(np.uint8)
        # channel = np.random.randint(40, 200, size=(self.y_res, self.x_res), dtype=np.uint8)
        channel = np.flipud(channel)

        buf[..., 1] = channel
        buf[..., 3] = 255

        return png.write_png(buf.tobytes(), self.img_size_x, self.img_size_y)

    def get_pixel_size(self):
        """Returns the size of a grid cell (in meters)"""
        x = (self.xmax - self.xmin) / self.img_size_x
        y = (self.ymax - self.ymin) / self.img_size_y

        return x, y

    async def decay(self):
        while True:
            await asyncio.sleep(0.25)
            self._grid = self._grid * 0.90


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
