import asyncio
import itertools
from typing import Callable

from head_manager import HeadManager
from installation import Installation
from scene_conversation import conversation
from scene_find_zeros import find_zeros
from scene_follow_evade import follow_evade
from scene_in_n_out import in_n_out
from scene_idle import idle

AVAILABLE_SCENES = [
    conversation,
    find_zeros,
    follow_evade,
    in_n_out,
    idle,
]


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
        asyncio.create_task(self._dj())
        self._current_orch = None
        self.focal_points = {}

    def notify(self, subject, **kw):
        if subject == "head-rotation":
            rotation = kw['rotation']
            path = f"/rotation/{rotation:f}"
            self.head_manager.send("head", kw['head_name'], path)

        if subject == "focal-points":
            self.focal_points = kw['focal_points']

    @classmethod
    def find_scene(cls, name: str) -> Callable:
        for scene in AVAILABLE_SCENES:
            if scene.__name__ == name:
                return scene
        else:
            raise SceneNotFound(f"Scene not found: {name}")

    async def _dj(self):
        await asyncio.sleep(1.0)

        scenes = [
            Orchestrator.find_scene(name)
            for name in self.inst.scenes
        ]

        assert len(scenes) > 0

        for scene in itertools.cycle(scenes):
            print(f"running {scene.__name__}")
            task: asyncio.Task = asyncio.create_task(scene(self))

            timeout = 60 if len(scenes) > 1 else None

            try:
                await asyncio.wait_for(task, timeout=timeout)
            except asyncio.TimeoutError:
                pass
            except Exception as e:
                print(f"task {task} caused exception {e}")
