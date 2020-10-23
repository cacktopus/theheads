import asyncio
import operator
from functools import reduce


async def in_n_out(orchestrator: "Orchestator"):
    vectors = [s.m.translation() for s in orchestrator.inst.stands.values()]
    center = (1.0 / len(vectors)) * reduce(operator.add, vectors)

    while True:
        for head in orchestrator.inst.heads.values():
            theta = head.point_away_from(center)
            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)
        await asyncio.sleep(5.0)

        for head in orchestrator.inst.heads.values():
            theta = head.point_to(center)
            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)
        await asyncio.sleep(5.0)
