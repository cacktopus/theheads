import asyncio
import time
from dataclasses import dataclass
from typing import Dict, List, Callable

from grid import Grid
from installation import Installation
from transformations import Vec, Mat


@dataclass
class FocalPoint:
    name: str
    pos: Vec
    ttl: float = 5.0
    created: float = None

    def __post_init__(self):
        if self.ttl is None:
            self.ttl = 5.0
        self.created = self.created or time.time()

    @property
    def expiry(self):
        return self.created + self.ttl

    def time_left(self, t: float = None) -> float:
        t = t or time.time()
        return self.expiry - t

    def is_expired(self, t: float = None) -> bool:
        t = t or time.time()
        return t > self.expiry

    def to_object(self) -> Dict:
        return {
            "name": self.name,
            "pos": {
                "x": self.pos.x,
                "y": self.pos.y,
            },
            "ttl": self.time_left(),
        }


class FocalPointManager:
    def __init__(self, broadcast: Callable, inst: Installation, grid: Grid):
        self.broadcast = broadcast
        self._focal_points: Dict[str, FocalPoint] = {}
        asyncio.create_task(self._focal_point_garbage_collector())
        self.inst = inst
        self.grid = grid

    def notify(self, subject, **kw):
        if subject == "focal-point-location":
            self.manual_focal_point(**kw)

        if subject == "motion-detected":
            self.motion_detected(**kw)

        if subject == "kinect":
            self.handle_kinect_motion(**kw)

    def manual_focal_point(self, name: str, x: float, y: float):
        self._add_focal_point(name, Vec(x, y), ttl=60.0)

    def motion_detected(self, camera_name: str, position: Vec):
        # perhaps not the best place for this function to live
        cam = self.inst.cameras[camera_name]
        p0 = Vec(0, 0)
        p1 = Mat.rotz(position) * Vec(10, 0)

        p0 = cam.stand.m * cam.m * p0
        p1 = cam.stand.m * cam.m * p1

        self.grid.trace(camera_name, p0, p1)

        self.grid.update_state()

        # sync focal points
        grid_fps = {fp.id: fp for fp in self.grid.focal_points}
        grid_ids = set(grid_fps.keys())
        my_ids = set(self._focal_points.keys())

        new = grid_ids - my_ids
        removed = my_ids - grid_ids
        existing = grid_ids & my_ids

        # TODO: deal with TTL
        for name in new:
            fp = grid_fps[name]
            self._add_focal_point(fp.id, fp.pos)

        for name in removed:
            self._remove_focal_point(name)

        for name in existing:
            grid_fp = grid_fps[name]
            mine = self._focal_points[name]
            mine.pos = grid_fp.pos
            mine.ttl = 5.0

        self._publish_focal_points()

    def handle_kinect_motion(self, msg: Dict):
        data = msg['data']
        simplified_bodies: List = data['simplifiedBodies']

        for body in simplified_bodies:
            if not body['tracked']:
                continue

            joints = body.get('joints', [])
            for joint in joints:
                x = joint.get('globalX')
                y = joint.get('globalY')

                if x is not None and y is not None:
                    name = joint.get('name')
                    self._add_focal_point(name, Vec(x, y))

    def _publish_focal_points(self):
        self.broadcast("focal-points", focal_points=self._focal_points)

    def _add_focal_point(self, name: str, pos: Vec, ttl: float = None):
        self._focal_points[name] = FocalPoint(name, pos, ttl=ttl)
        self._publish_focal_points()

    def _remove_focal_point(self, name):
        del self._focal_points[name]
        self._publish_focal_points()

    async def _focal_point_garbage_collector(self):
        while True:
            await asyncio.sleep(0.25)

            expired = set()
            for name, fp in self._focal_points.items():
                if fp.is_expired():
                    expired.add(name)

            for name in expired:
                self._remove_focal_point(name)
