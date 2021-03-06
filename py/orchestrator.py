import asyncio
import itertools
import traceback
from typing import Callable, Optional, Tuple

import log
import util
from head_manager import HeadManager
from installation import Installation
from scene_conversation import conversation
from scene_find_zeros import find_zeros
from scene_follow_evade import follow_evade
from scene_in_n_out import in_n_out
from scene_idle import idle
from transformations import Vec

AVAILABLE_SCENES = [
    conversation,
    find_zeros,
    follow_evade,
    in_n_out,
    idle,
]


def timeouts(scene):
    return {
        conversation: None,
        in_n_out: 30.0,
    }.get(scene, 60.0)


class SceneNotFound(Exception):
    pass


class Orchestrator:
    def __init__(
            self,
            inst: Installation,
            head_manager: HeadManager,
            broadcast: Callable,
    ):
        self.inst = inst
        self.head_manager = head_manager
        self.broadcast = broadcast
        util.create_task(self._dj())
        self._current_orch = None
        self.focal_points = {}
        self.texts = list()

    def notify(self, subject, **kw):
        if subject == "head-rotation":
            rotation = kw['rotation']
            path = f"/rotation/{rotation:f}"
            self.head_manager.send("head", kw['head_name'], path)

        if subject == "focal-points":
            self.focal_points = kw['focal_points']

        if subject == 'texts':
            self.texts = kw['texts']

    def closest_focal_point_to(self, p) -> Tuple[Optional[Vec], Optional[float]]:
        scores = []
        for fp in self.focal_points.values():
            to = fp.pos - p
            distance = to.abs()
            if distance > 0.01:
                scores.append((distance, fp.pos))

        if len(scores) == 0:
            return None, None

        distance, selected = min(scores)
        return selected, distance

    @classmethod
    def find_scene(cls, name: str) -> Callable:
        for scene in AVAILABLE_SCENES:
            if scene.__name__ == name:
                return scene
        else:
            raise SceneNotFound(f"Scene not found: {name}")

    async def _run_scenes(self, scenes):
        for scene in scenes:
            log.info(f"running scene", scene=scene.__name__)
            task: asyncio.Task = util.create_task(scene(self), allow_cancel=True)

            timeout = timeouts(scene)

            try:
                await asyncio.wait_for(task, timeout=timeout)
            except asyncio.TimeoutError:
                pass
            except Exception as e:
                log.critical("scene caused exception", exception=str(e))

    async def _startup(self):
        await asyncio.sleep(1.0)

        scenes = [
            Orchestrator.find_scene(name)
            for name in self.inst.startup_scenes
        ]

        await self._run_scenes(scenes)

    async def _dj(self):
        await self._startup()

        scenes = [
            Orchestrator.find_scene(name)
            for name in self.inst.scenes
        ]

        assert len(scenes) > 0
        await self._run_scenes(itertools.cycle(scenes))
