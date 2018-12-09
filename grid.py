import asyncio
import math

import numpy as np

import png


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

        res = yidx, xidx  # Notice swap here
        return res

    def set(self, x: float, y: float, val: float):
        idx = self.idx(x, y)
        self._grid[idx] = val

    def get(self, x: float, y: float) -> float:
        idx = self.idx(x, y)
        return float(self._grid[idx])

    def to_png(self):
        buf = np.zeros((self.y_res, self.x_res, 4), dtype=np.uint8)

        clipped = np.clip(self._grid, 0, 1.0)
        channel = (clipped * 255).round().astype(np.uint8)
        # channel = np.random.randint(40, 200, size=(self.y_res, self.x_res), dtype=np.uint8)
        channel = np.flipud(channel)

        buf[..., 1] = channel
        buf[..., 3] = 255

        return png.write_png(buf.tobytes(), self.x_res, self.y_res)

    async def decay(self):
        while True:
            await asyncio.sleep(0.25)
            self._grid = self._grid * 0.90


the_grid = Grid(-10, -20, 10, 20, 100, 200)  # TODO: not global!


def main():
    g = Grid(-10, -20, 10, 20, 40, 80)
    print(g.idx(-10, -20))

    print(g.idx(10, 0))
    print(g.idx(9.9999, 0))

    g.set(0, 0, 0.98)
    print(g.get(0, 0))


if __name__ == '__main__':
    main()
