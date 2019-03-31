import math

from head_manager import HeadManager
from installation import Installation
from transformations import Vec, Mat


class Orchestrator:
    def __init__(
            self,
            inst: Installation,
            ws_manager: "WebsocketManager",
            head_manager: HeadManager,
    ):
        self.inst = inst
        self.ws_manager = ws_manager
        self.focus = None
        self.head_manager = head_manager

    def act(self):
        if self.focus is None:
            return

        for head in self.inst.heads.values():
            m = head.stand.m * head.m
            m_inv = m.inv()

            f = m_inv * self.focus
            f = f.unit()

            theta = math.atan2(f.y, f.x) * 180 / math.pi

            print(head.name, theta)

            p0 = m * Vec(0.0, 0.0)
            p1 = m * Mat.rotz(theta) * Vec(5, 0, 0.0)

            self.ws_manager.send({
                "type": "draw",
                "data": {
                    "shape": "line",
                    "coords": [p0.x, p0.y, p1.x, p1.y],
                }
            })

            self.head_manager.send(head.name, theta)
