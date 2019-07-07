import asyncio
import ctypes
import itertools
import math
import mmap
import time
from functools import reduce
from typing import Tuple, List, Optional

import numpy as np

from installation import Installation
from transformations import Vec

FP_RADIUS = 0.8


class _FocalPoint:
    counter = 0

    @classmethod
    def assign_id(cls) -> str:
        result = cls.counter
        cls.counter += 1
        return f"g{result}"

    def __init__(self, pos: Vec, radius: float = FP_RADIUS, id: int = None, ttl=None):
        self.pos = pos
        self.radius = radius
        if id is None:
            self.id: str = _FocalPoint.assign_id()

        if ttl is None:
            self.ttl = 5.0
        self.updated_at = time.time()

    @property
    def expiry(self):
        return self.updated_at + self.ttl

    def time_left(self, t: float = None) -> float:
        t = t or time.time()
        return self.expiry - t

    def is_expired(self, t: float = None) -> bool:
        t = t or time.time()
        return t > self.expiry

    def refresh(self, t: float = None):
        self.updated_at = time.time()

    def overlaps(self, other: '_FocalPoint', debug=False):
        to = other.pos - self.pos
        d = to.abs()
        if debug:
            print(d)
        return d < (self.radius + other.radius)

    def line_intersection(self, p0: Vec, p1: Vec) -> Optional[Tuple[Vec, Vec]]:
        # https://math.stackexchange.com/questions/311921/get-location-of-vector-circle-intersection

        # transform to circle's reference frame
        p0 = p0 - self.pos
        p1 = p1 - self.pos

        x0, y0 = p0.x, p0.y
        x1, y1 = p1.x, p1.y

        r = self.radius

        a = (x1 - x0) ** 2 + (y1 - y0) ** 2
        b = 2 * (x1 - x0) * x0 + 2 * (y1 - y0) * y0
        c = x0 ** 2 + y0 ** 2 - r ** 2

        disc = b * b - 4 * a * c
        if disc < 0:
            return None

        rt = math.sqrt(disc)
        t0 = (-b - rt) / (2 * a)
        t1 = (-b + rt) / (2 * a)

        t0, t1 = min(t0, t1), max(t0, t1)

        # may want to revist these conditions later
        if t0 < 0 or t1 < 0:
            return None

        if t0 > 1 or t1 > 1:
            return None

        q0 = (p1 - p0).scale(t0) + p0
        q1 = (p1 - p0).scale(t1) + p0

        # translate back to global reference frame
        q0 += self.pos
        q1 += self.pos

        return q0, q1


class Grid:
    def __init__(self, xmin, ymin, xmax, ymax, img_size, installation: Installation, spawner=True):
        """:param img_size (width, height)"""
        assert ymax > ymin
        assert xmax > xmin

        self.xmin = xmin
        self.ymin = ymin

        self.xmax = xmax
        self.ymax = ymax

        self.img_size_x, self.img_size_y = img_size

        self.xscale = self.img_size_x / (self.xmax - self.xmin)
        self.yscale = self.img_size_y / (self.xmax - self.xmin)

        self._grids = {}

        self.inst = installation
        self._focal_points: List[_FocalPoint] = []

        self.tracelib = ctypes.cdll.LoadLibrary("./trace.so")

        if spawner:
            asyncio.create_task(self.background_processor())

    @property
    def focal_points(self) -> List[_FocalPoint]:
        return self._focal_points

    def get_grid(self, name: str):
        if name not in self._grids:
            g = np.zeros((self.img_size_y, self.img_size_x), dtype=np.float32)  # note flip of img_size
            self._grids[name] = g
        return self._grids[name]

    def reset(self, name):
        g = self.get_grid(name)
        g.fill(0.0)

    def idx(self, x: float, y: float):
        xidx = int(math.floor((x - self.xmin) / (self.xmax - self.xmin) * self.img_size_x))
        yidx = int(math.floor((y - self.ymin) / (self.ymax - self.ymin) * self.img_size_y))

        if xidx < 0 or xidx >= self.img_size_x:
            return None

        if yidx < 0 or yidx >= self.img_size_y:
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
        if idx is not None:
            g[idx] = val

    def get(self, name: str, x: float, y: float) -> float:
        g = self.get_grid(name)
        idx = self.idx(x, y)
        return idx and float(g[idx])

    def trace(self, camera_name: str, p0: Vec, p1: Vec):
        hit = self.trace_focal_points(p0, p1)

        if not hit:
            self.trace_grid(camera_name, p0, p1)

    def trace_focal_points(self, p0: Vec, p1: Vec) -> bool:
        results = []
        for fp in self._focal_points:
            res = fp.line_intersection(p0, p1)
            if res is not None:
                q0 = res[0]
                d = (q0 - p0).abs_sq()
                results.append((d, res, fp))

        if results:
            _, (q0, q1), fp = min(results)  # only interact with closest intersection
            midpoint = q0 + (q1 - q0).scale(0.5)
            to = midpoint - fp.pos
            fp.pos += to.scale(0.2)
            fp.refresh()

    def trace_grid(self, camera_name: str, p0: Vec, p1: Vec):
        step_size = min(self.get_pixel_size()) / 4.0

        epsilon = step_size / 2.0  # to avoid array out of bounds

        p0 = p0.clamp(self.xmin, self.ymin, self.xmax - epsilon, self.ymax - epsilon)
        p1 = p1.clamp(self.xmin, self.ymin, self.xmax - epsilon, self.ymax - epsilon)

        to = p1 - p0
        length = to.abs()

        if length < step_size:
            return

        dx = to.x / length * step_size
        dy = to.y / length * step_size

        pos_x, pos_y = p0.x, p0.y

        steps = int(length / step_size)

        g = self.get_grid(camera_name)

        self._trace_steps(g, pos_x, pos_y, dx, dy, steps)

    def _trace_steps(self, g, pos_x, pos_y, dx, dy, steps):
        """Optimized code"""
        # convert into "grid coordinates"
        pos_x -= self.xmin
        pos_y -= self.ymin

        pos_x *= self.xscale
        pos_y *= self.yscale

        dx *= self.xscale
        dy *= self.yscale

        self._trace_steps_internal(g, pos_x, pos_y, dx, dy, steps)

    def _trace_steps_internal(self, g, pos_x, pos_y, dx, dy, steps):
        """Optimized code"""
        g_ptr = g.ctypes.get_as_parameter()

        self.tracelib.trace(
            g_ptr,
            ctypes.c_int(self.img_size_x),
            ctypes.c_int(self.img_size_y),
            ctypes.c_float(pos_x),
            ctypes.c_float(pos_y),
            ctypes.c_float(dx),
            ctypes.c_float(dy),
            ctypes.c_int(steps),
            ctypes.c_float(0.025),
        )

        # for i in range(steps):
        #     yidx = int(math.floor(pos_x))  # notice swap
        #     xidx = int(math.floor(pos_y))  # notice swap
        #
        #     g[(xidx, yidx)] += 0.025
        #
        #     pos_x += dx
        #     pos_y += dy

    def time_quantum(self, quantum):
        t = time.time()
        return t - t % quantum

    def maybe_spawn_new_focal_point(self):
        p, val = self.focus()
        if val <= 0.10:
            return

        new_fp = _FocalPoint(p, id=-1)

        # does fp overlap with existing focal point?
        for fp in self._focal_points:
            if new_fp.overlaps(fp):
                return

        # don't create new focal points close to cameras
        for cam in self.inst.cameras.values():
            fake_fp = _FocalPoint(cam.m.translation(), id=-1)
            if new_fp.overlaps(fake_fp):
                return

        # create new focal point
        new_fp.id = _FocalPoint.assign_id()
        self._focal_points.append(new_fp)

    async def background_processor(self):
        while True:
            self.maybe_spawn_new_focal_point()
            self.merge_overlapping_focal_points()
            self.cleanup_stale()
            await asyncio.sleep(0.25)

    def cleanup_stale(self):
        self._focal_points = [fp for fp in self._focal_points if not fp.is_expired()]

    def merge_overlapping_focal_points(self):
        # this runs every update and we can tolerate some overlap, so to keep things simple,
        # if we find a single overlap just deal with it and get to any other overlaps on the
        # next run
        for fp0, fp1 in itertools.combinations(self._focal_points, 2):
            if fp0.overlaps(fp1, debug=False):
                midpoint = (fp0.pos + fp1.pos).scale(0.5)
                fp0.pos = midpoint
                self._focal_points = [fp for fp in self._focal_points
                                      if fp is not fp1]
                return

    def time_quantum(self, quantum):
        t = time.time()
        return t - t % quantum

    def combined(self):
        camera_grids = [g for name, g in self._grids.items() if name.startswith("camera")]
        if len(camera_grids) == 0:
            return np.zeros((self.img_size_y, self.img_size_x), dtype=np.float32)

        masks = []

        def step1():
            for g in camera_grids:
                m = g > 0.01
                masks.append(m)

        step1()

        def step1b():
            for i in range(len(masks)):
                masks[i] = masks[i].astype(np.float32)

        step1b()

        def step2():
            mask = reduce(np.add, masks) > 1.0
            mask = mask.astype(np.float32)
            return mask

        mask = step2()

        def step3():
            return reduce(np.add, camera_grids) * mask

        result = step3()

        return result

    def focus(self) -> Tuple[Vec, float]:
        g = self.combined()
        m = np.argmax(g, axis=None)
        idx = np.unravel_index(m, g.shape)
        value = g[idx]
        return Vec(*self.idx_to_xy(idx)), value

    def get_pixel_size(self):
        """Returns the size of a grid cell (in meters)"""
        x = (self.xmax - self.xmin) / self.img_size_x
        y = (self.ymax - self.ymin) / self.img_size_y

        return x, y

    def draw_circle(self, grid_name: str, x: float, y: float, r: float, steps: int = 100):
        center = (x, y)
        for i in range(steps):
            theta = 2 * math.pi * (i / steps)
            x = center[0] + r * math.cos(theta)
            y = center[1] + r * math.sin(theta)
            self.set(grid_name, x, y, 1.0)

    async def decay(self):
        while True:
            await asyncio.sleep(0.25)
            for g in self._grids.values():
                g *= 0.75

    async def publish_loop(self):
        filename = "gridbuf"
        with open(filename, "wb") as f:
            f.truncate(self.img_size_x * self.img_size_y * 4)

        with open(filename, "r+b") as f:
            mm = mmap.mmap(f.fileno(), 0, mmap.MAP_SHARED, mmap.PROT_WRITE)

            buf = np.ndarray(
                shape=(self.img_size_y, self.img_size_x),
                dtype=np.float32,
                buffer=mm,
            )

            debug_grid = "debug_grid"

            while True:
                await asyncio.sleep(0.1)
                self.reset(debug_grid)
                # print(" ".join(sorted(self._grids.keys())))

                for stand in self.inst.stands.values():
                    pos = stand.m.translation()
                    self.set(debug_grid, pos.x, pos.y, 1.0)
                    self.draw_circle(debug_grid, pos.x, pos.y, 0.19)

                for fp in self._focal_points:
                    self.draw_circle(debug_grid, fp.pos.x, fp.pos.y, fp.radius)

                # buf[:] = self.combined() + self.get_grid("origin")
                result = self.get_grid(debug_grid)
                for c in self.inst.cameras.values():
                    result += self.get_grid(c.name)
                result += self.combined()
                buf[:] = result
