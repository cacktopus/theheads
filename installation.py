import asyncio
import os
from glob import glob

import yaml
from aiohttp import web

from consul_config import ConsulBackend
from etcd_config import Config
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


class Head:
    def __init__(self, name: str, m: Mat, stand: "Stand", url: str):
        self.name = name
        self.m = m
        self.stand = stand
        self.url = url


class Stand:
    def __init__(self, name: str, m: Mat):
        self.name = name
        self.m = m
        self.cameras = {}
        self.heads = {}

    def add_camera(self, camera: Camera):
        self.cameras[camera.name] = camera

    def add_head(self, head: Head):
        self.heads[head.name] = head


class Installation:
    def __init__(self):
        self.stands = {}
        self.cameras = {}
        self.heads = {}

    def add_stand(self, stand: Stand):
        self.stands[stand.name] = stand

        assert len(set(stand.cameras.keys()) & set(self.cameras.keys())) == 0
        self.cameras.update(stand.cameras)

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

            for camera in stand['cameras']:
                c = Camera(
                    camera['name'],
                    obj_to_m(camera),
                    s,
                    camera['description'],
                    camera['fov'],
                )
                s.add_camera(c)

            for head in stand['heads']:
                h = Head(
                    head['name'],
                    obj_to_m(head),
                    s,
                    head['url'],
                )
                s.add_head(h)

            inst.add_stand(s)

        return inst


async def build_installation(inst_name: str, cfg: Config):
    cameras = {}
    heads = {}
    stands = {}

    for name, body in (await cfg.get_prefix(
            "/the-heads/installation/{installation}/cameras/"
    )).items():
        camera = yaml.safe_load(body)
        cameras[camera['name']] = camera

    for name, body in (await cfg.get_prefix(
            "/the-heads/installation/{installation}/heads/"
    )).items():
        head = yaml.safe_load(body)
        heads[head['name']] = head

    for name, body in (await cfg.get_prefix(
            "/the-heads/installation/{installation}/stands/"
    )).items():
        stand = yaml.safe_load(body)
        if stand.get("enabled", True):
            stands[stand['name']] = stand

    for stand in stands.values():
        stand['cameras'] = [cameras[c] for c in stand['cameras']]
        stand['heads'] = [heads[h] for h in stand['heads']]

    result = dict(
        name=inst_name,
        stands=list(stands.values()),
    )

    return result


def build_installation_from_filesystem(name):
    """deprecated"""
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
            if stand.get("enabled", True):
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
    loop = asyncio.get_event_loop()

    cfg = loop.run_until_complete(Config(ConsulBackend("http://127.0.0.1:8500")).setup())
    result = loop.run_until_complete(build_installation("living-room", cfg))
    inst = Installation.unmarshal(result)

    c0 = inst.cameras['camera0']
    pos0 = c0.stand.m * c0.m * Vec(0, 0)

    c1 = inst.cameras['camera1']
    pos1 = c1.stand.m * c1.m * Vec(0, 0)

    print(pos0)
    print(pos1)


if __name__ == '__main__':
    main()
