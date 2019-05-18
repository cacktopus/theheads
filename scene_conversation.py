import asyncio
import operator
import random
from functools import reduce

from scene_follow_evade import follow_closest_focal_point


async def conversation(orchestrator: "Orchestrator"):
    heads = list(orchestrator.inst.heads.values())

    texts = orchestrator.texts
    if len(texts) == 0:
        print("no texts")
        await asyncio.sleep(5.0)
        return

    parts = random.choice(texts)

    for part in parts:
        # all point to the center
        for head in heads:
            other_heads = [h for h in heads if h.name != head.name]
            assert len(heads) - len(other_heads) == 1
            positions = [h.global_pos for h in other_heads]
            center = (1.0 / len(positions)) * reduce(operator.add, positions)

            theta = head.point_to(center)
            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)
        await asyncio.sleep(1.0)

        random.shuffle(heads)
        h0 = heads[0]

        if orchestrator.focal_points and random.random() < 0.33:
            # Follow the focal point
            coro = follow_closest_focal_point(h0, orchestrator)
            task = asyncio.create_task(coro)

            await asyncio.sleep(0.5)
            path = f"/play?text={part}&isSync=true"
            future = orchestrator.head_manager.send("voices", h0.name, path)

            await future
            task.cancel()
            await asyncio.sleep(0.5)

        else:
            # Point towards other head
            other_heads = heads[1:3] if random.random() < 0.20 else heads[1:2]
            first = other_heads[0]

            t0 = h0.point_to(first.global_pos)
            path = f"/rotation/{t0:f}"
            orchestrator.head_manager.send("head", h0.name, path)

            await asyncio.sleep(0.5)

            for other in other_heads:
                # Point other heads back towards speaker
                t1 = other.point_to(h0.global_pos)
                path = f"/rotation/{t1:f}"
                orchestrator.head_manager.send("head", other.name, path)
                await asyncio.sleep(0.5)

            path = f"/play?text={part}&isSync=true"
            future = orchestrator.head_manager.send("voices", h0.name, path)

            await future
            await asyncio.sleep(0.5)
