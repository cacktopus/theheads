import math
from typing import Dict, List

import yaml

from config import Config, NotFound
from transformations import Mat, Vec


def obj_to_m(obj):
    pos = obj['pos']
    return to_m(pos['x'], pos['y'], obj['rot'])


def to_m(x: float, y: float, rot: float):
    return Mat.translate(x, y) * Mat.rotz(rot)


class Camera:
    def __init__(self, name: str, m: Mat, stand: "Stand", description: str, fov: float):
        self.name = name
        self.m = m
        self.stand = stand
        self.description = description
        self.fov = fov


class Kinect:
    def __init__(self, name: str, m: Mat, stand: "Stand", fov: float):
        self.name = name
        self.m = m
        self.stand = stand
        self.fov = fov


class Head:
    def __init__(self, name: str, m: Mat, stand: "Stand"):
        self.name = name
        self.m = m
        self.stand = stand
        self._m_inv = (self.stand.m * self.m).inv()

    def point_to(self, point: Vec) -> float:
        """returns the angle (degrees) the head should be at to face a given point"""
        to = self._m_inv * point
        distance = to.abs()
        if distance < 0.01:
            raise ValueError("Point is too close")

        direction = to.unit()
        return math.atan2(direction.y, direction.x) * 180 / math.pi

    def point_away_from(self, point: Vec) -> float:
        """returns the angle (degrees) the head should be at to turn away from a given point"""
        return (self.point_to(point) + 180) % 360

    @property
    def global_pos(self) -> Vec:
        return (self.stand.m * self.m).translation()


class Stand:
    def __init__(self, name: str, m: Mat):
        self.name = name
        self.m = m
        self.cameras = {}
        self.kinects = {}
        self.heads = {}

    def add_camera(self, camera: Camera):
        self.cameras[camera.name] = camera

    def add_kinect(self, kinect: Kinect):
        self.kinects[kinect.name] = kinect

    def add_head(self, head: Head):
        self.heads[head.name] = head


class Installation:
    def __init__(self):
        self.stands: Dict[str, Stand] = {}
        self.cameras: Dict[str, Camera] = {}
        self.kinects: Dict[str, Kinect] = {}
        self.heads: Dict[str, Head] = {}
        self.scenes: List = []
        self.startup_scenes: List = []

    def add_stand(self, stand: Stand):
        self.stands[stand.name] = stand

        assert len(set(stand.cameras.keys()) & set(self.cameras.keys())) == 0
        self.cameras.update(stand.cameras)

        assert len(set(stand.kinects.keys()) & set(self.kinects.keys())) == 0
        self.kinects.update(stand.kinects)

        assert len(set(stand.heads.keys()) & set(self.heads.keys())) == 0
        self.heads.update(stand.heads)

    @classmethod
    def unmarshal(cls, obj):
        inst = Installation()

        for stand in obj['stands']:
            s = Stand(
                stand['name'],
                obj_to_m(stand),
            )

            for camera in stand.get('cameras', []):
                c = Camera(
                    camera['name'],
                    obj_to_m(camera),
                    s,
                    camera['description'],
                    camera['fov'],
                )
                s.add_camera(c)

            for kinect in stand.get('kinects', []):
                k = Kinect(
                    kinect['name'],
                    obj_to_m(kinect),
                    s,
                    kinect['fov'],
                )
                s.add_kinect(k)

            for head in stand.get('heads', []):
                h = Head(
                    head['name'],
                    obj_to_m(head),
                    s,
                )
                s.add_head(h)

            inst.add_stand(s)

        inst.scenes = list(obj['scenes'])
        inst.startup_scenes = list(obj['startup_scenes'])

        return inst


async def build_installation(cfg: Config):
    cameras = {}
    kinects = {}
    heads = {}
    stands = {}
    scale = 75
    translate_x = 750
    translate_y = 100

    for name, body in (await cfg.get_prefix(
            "/the-heads/cameras/"
    )).items():
        if name.endswith(b".yaml"):
            camera = yaml.safe_load(body)
            cameras[camera['name']] = camera

    for name, body in (await cfg.get_prefix(
            "/the-heads/kinects/"
    )).items():
        if name.endswith(b".yaml"):
            kinect = yaml.safe_load(body)
            kinects[kinect['name']] = kinect

    for name, body in (await cfg.get_prefix(
            "/the-heads/heads/"
    )).items():
        if name.endswith(b".yaml"):
            head = yaml.safe_load(body)
            heads[head['name']] = head

    for name, body in (await cfg.get_prefix(
            "/the-heads/stands/"
    )).items():
        if name.endswith(b".yaml"):
            stand = yaml.safe_load(body)

            if stand.get('disabled', False):
                continue
            if not stand.get('enabled', True):
                continue

            stands[stand['name']] = stand

    for stand in stands.values():
        stand['cameras'] = [cameras[c] for c in stand.get('cameras', [])]
        stand['heads'] = [heads[h] for h in stand.get('heads', [])]
        stand['kinects'] = [kinects[k] for k in stand.get('kinects', [])]

    scene = await cfg.get_config_yaml("/the-heads/scene.yaml")
    scale = scene.get("scale", scale)
    translate = scene.get("translate", {"x": translate_x, "y": translate_y})
    translate_x = translate["x"]
    translate_y = translate["y"]

    for name, body in (await cfg.get_prefix(
            "/the-heads/kinects/"
    )).items():
        if name.endswith(b".yaml"):
            kinect = yaml.safe_load(body)
            kinects[kinect['name']] = kinect

    result = dict(
        stands=list(stands.values()),
        scale=scale,
        translate={
            "x": translate_x,
            "y": translate_y,
        },
        scenes=scene['scenes'],
        startup_scenes=scene['startup_scenes']
    )

    return result
