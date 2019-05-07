import asyncio
import operator
import random
from functools import reduce


async def conversation(orchestrator: "Orchestrator"):
    heads = list(orchestrator.inst.heads.values())

    while True:
        for head in heads:
            other_heads = [h for h in heads if h.name != head.name]
            assert len(heads) - len(other_heads) == 1
            positions = [h.global_pos for h in other_heads]
            center = (1.0 / len(positions)) * reduce(operator.add, positions)

            theta = head.point_to(center)
            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)
        await asyncio.sleep(5.0)

        random.shuffle(heads)
        h0, h1 = heads[0], heads[1]

        t0 = h0.point_to(h1.global_pos)
        path = f"/rotation/{t0:f}"
        fut = orchestrator.head_manager.send("head", h0.name, path)
        res = await fut
        print(res)

        await asyncio.sleep(0.5)

        t1 = h1.point_to(h0.global_pos)
        path = f"/rotation/{t1:f}"
        orchestrator.head_manager.send("head", h1.name, path)

        await asyncio.sleep(0.5)
        path = f"/play?text=Hello {h1.name}"
        orchestrator.head_manager.send("voices", h0.name, path)

        await asyncio.sleep(5.0)
