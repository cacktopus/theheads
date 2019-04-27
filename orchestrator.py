import asyncio
import math
from dataclasses import dataclass
from typing import Dict, List, Callable

from grid import the_grid
from head_manager import HeadManager
from installation import Installation
from transformations import Vec, Mat
import time


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


class Orchestrator:
    def __init__(
            self,
            inst: Installation,
            head_manager: HeadManager,
            broadcast: Callable,
    ):
        self.inst = inst
        self._focal_points: Dict[str, FocalPoint] = {}
        self.head_manager = head_manager
        self.broadcast = broadcast
        asyncio.create_task(self._focal_point_garbage_collector())

    def notify(self, subject, **kw):
        if subject == "focal-point-location":
            self.manual_focal_point(**kw)

        if subject == "head-rotation":
            self.head_manager.send(kw['head_name'], kw['rotation'])

        if subject == "motion-detected":
            self.motion_detected(**kw)

        if subject == "kinect":
            self.handle_kinect_motion(**kw)

    def act(self):
        for head in self.inst.heads.values():
            m = head.stand.m * head.m
            m_inv = m.inv()

            # select the closest focal point to head
            scores = []
            for fp in self._focal_points.values():
                to = m_inv * fp.pos
                distance = to.abs()
                if distance > 0.01:
                    scores.append((distance, to))

            if len(scores) == 0:
                continue

            _, selected = min(scores)

            direction = selected.unit()

            theta = math.atan2(direction.y, direction.x) * 180 / math.pi

            print(head.name, theta)

            self.head_manager.send(head.name, theta)

    def manual_focal_point(self, name: str, x: float, y: float):
        self._add_focal_point(name, Vec(x, y), ttl=60.0)
        self.act()

    def motion_detected(self, camera_name: str, position: Vec):
        # perhaps not the best place for this function to live
        cam = self.inst.cameras[camera_name]
        p0 = Vec(0, 0)
        p1 = Mat.rotz(position) * Vec(5, 0)

        p0 = cam.stand.m * cam.m * p0
        p1 = cam.stand.m * cam.m * p1

        step_size = min(the_grid.get_pixel_size()) / 4.0

        to = p1 - p0
        length = to.abs()
        direction = to.scale(1.0 / length)

        dx = to.x / length * step_size
        dy = to.y / length * step_size

        initial = p0 + direction.scale(0.5)
        pos_x, pos_y = initial.x, initial.y

        steps = int(length / step_size)
        for i in range(steps):
            prev_xy = the_grid.get(cam, pos_x, pos_y)
            if prev_xy is None:
                break
            the_grid.set(cam, pos_x, pos_y, prev_xy + 0.025)
            pos_x += dx
            pos_y += dy

        focal_pos = Vec(*the_grid.idx_to_xy(the_grid.focus()))
        self._add_focal_point("g0", focal_pos)
        self.act()

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
                    name = "k01-0"
                    self._add_focal_point(name, Vec(x, y))
                    self.act()

    def _publish_focal_points(self):
        self.broadcast("focal-points", msg={
            "type": "focal-points",
            "data": {
                "focal-points": [fp.to_object() for fp in self._focal_points.values()]
            }
        })

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

            if expired:
                self.act()
