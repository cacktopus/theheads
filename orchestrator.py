import math
from dataclasses import dataclass
from typing import Dict, List

from grid import the_grid
from head_manager import HeadManager
from installation import Installation
from transformations import Vec, Mat


@dataclass
class FocalPoint:
    name: str
    pos: Vec


class Orchestrator:
    def __init__(
            self,
            inst: Installation,
            head_manager: HeadManager,
    ):
        self.inst = inst
        self.focal_points: Dict[str, FocalPoint] = {}
        self.head_manager = head_manager

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
        if not self.focal_points:
            return

        for head in self.inst.heads.values():
            m = head.stand.m * head.m
            m_inv = m.inv()

            # select the closest focal point to head
            scores = []
            for fp in self.focal_points.values():
                to = m_inv * fp.pos
                distance = to.abs()
                if distance > 0.01:
                    scores.append((distance, to))

            _, selected = min(scores)

            direction = selected.unit()

            theta = math.atan2(direction.y, direction.x) * 180 / math.pi

            print(head.name, theta)

            self.head_manager.send(head.name, theta)

    def manual_focal_point(self, name: str, x: float, y: float):
        self.focal_points[name] = FocalPoint(name, Vec(x, y))
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
        self.focal_points["g0"] = FocalPoint("g0", focal_pos)
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
                    self.focal_points[name] = FocalPoint(name, Vec(x, y))
                    self.act()
