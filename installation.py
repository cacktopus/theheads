import os
from glob import glob

import yaml
from aiohttp import web

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


class Stand:
    def __init__(self, name: str, m: Mat):
        self.name = name
        self.m = m
        self.cameras = {}

    def add_camera(self, camera: Camera):
        self.cameras[camera.name] = camera


class Installation:
    def __init__(self):
        self.stands = {}
        self.cameras = {}

    def add_stand(self, stand: Stand):
        self.stands[stand.name] = stand
        assert len(set(stand.cameras.keys()) & set(self.cameras.keys())) == 0
        self.cameras.update(stand.cameras)

    @classmethod
    def unmarshal(cls, obj):
        inst = Installation()

        for stand in obj['stands']:
            s = Stand(
                stand['name'],
                obj_to_m(stand),
            )

            for camera in stand['cameras']:
                c = Camera(
                    camera['name'],
                    obj_to_m(camera),
                    s,
                    camera['description'],
                    camera['fov'],
                )
                s.add_camera(c)

            inst.add_stand(s)

        return inst


def build_installation(name):
    base = os.path.join("etcd", "the-heads", "installations", name)
    if not os.path.exists(base):
        raise web.HTTPNotFound()

    cameras = {}
    for path in glob(os.path.join(base, "cameras/*.yaml")):
        with open(path) as fp:
            camera = yaml.safe_load(fp)
            cameras[camera['name']] = camera

    heads = {}
    for path in glob(os.path.join(base, "heads/*.yaml")):
        with open(path) as fp:
            head = yaml.safe_load(fp)
            heads[head['name']] = head

    stands = {}
    for path in glob(os.path.join(base, "stands/*.yaml")):
        with open(path) as fp:
            stand = yaml.safe_load(fp)
            stands[stand['name']] = stand

    for stand in stands.values():
        stand['cameras'] = [cameras[c] for c in stand['cameras']]
        stand['heads'] = [heads[h] for h in stand['heads']]

    result = dict(
        name=name,
        stands=list(stands.values()),
    )

    return result


def main():
    inst = Installation.unmarshal(build_installation("living-room"))

    c0 = inst.cameras['camera0']
    pos0 = c0.stand.m * c0.m * Vec(0, 0)

    c1 = inst.cameras['camera1']
    pos1 = c1.stand.m * c1.m * Vec(0, 0)

    print(pos0)
    print(pos1)


if __name__ == '__main__':
    main()
