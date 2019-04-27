import math
from typing import Dict, List

from head_manager import HeadManager
from installation import Installation
from transformations import Vec, Mat
from grid import the_grid


class Orchestrator:
    def __init__(
            self,
            inst: Installation,
            head_manager: HeadManager,
    ):
        self.inst = inst
        self.focus = None
        self.head_manager = head_manager

    def notify(self, subject, **kw):
        if subject == "focal-point-location":
            self.focus = kw['pos']
            self.act()

        if subject == "head-rotation":
            self.head_manager.send(kw['head_name'], kw['rotation'])

        if subject == "motion-detected":
            self.motion_detected(**kw)

        if subject == "kinect":
            self.handle_kinect_motion(**kw)

    def act(self):
        if self.focus is None:
            return

        for head in self.inst.heads.values():
            m = head.stand.m * head.m
            m_inv = m.inv()

            f = m_inv * self.focus

            if f.abs() < 0.01:
                continue

            f = f.unit()

            theta = math.atan2(f.y, f.x) * 180 / math.pi

            print(head.name, theta)

            self.head_manager.send(head.name, theta)

    def motion_detected(self, camera_name: str, position: Vec):
        # perhaps not the best place for this function to live
        cam = self.inst.cameras[camera_name]
        p0 = Vec(0, 0)
        p1 = Mat.rotz(position) * Vec(5, 0)

        p0 = cam.stand.m * cam.m * p0
        p1 = cam.stand.m * cam.m * p1

        step_size = min(the_grid.get_pixel_size()) / 4.0

        to = p1 - p0
        length = (to).abs()
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

        focus = Vec(*the_grid.idx_to_xy(the_grid.focus()))
        self.focus = focus
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
                    self.focus = Vec(x, y)
                    self.act()
