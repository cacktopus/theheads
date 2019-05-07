import asyncio
import itertools
from typing import Callable

from head_manager import HeadManager
from installation import Installation
from scene_conversation import conversation
from scene_find_zeros import find_zeros
from scene_follow_evade import follow_evade
from scene_in_n_out import in_n_out


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

    async def _dj(self):
        await asyncio.sleep(1.0)
        orchs = [
            follow_evade,
            conversation,
            in_n_out,
            find_zeros,
        ]

        for orch in itertools.cycle(orchs):
            task: asyncio.Task = asyncio.create_task(orch(self))
            try:
                await asyncio.wait_for(task, timeout=15)
            except asyncio.TimeoutError:
                pass
            except Exception as e:
                print(f"task {task} caused exception {e}")
