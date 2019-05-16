import asyncio
import operator
import random
import re
from functools import reduce

text = """Your training should make you feel better. Workouts should be designed to be light enough that there’s 
almost no excuse to not do them. Once a rhythm is developed, you can turn the dial up. I need to think about wether 
it is better to load a lot of exercises onto a single day, or just do more days. There is a lot of startup cost in 
terms of warmups, etc. I need to improve my warmup game and get a lot more variation in there. Perhaps I can track 
warmups alongside the actual exercises that I do. 

Self control is limited. You should cultivate better self-control, but also build systems around your life 
so that you can apply it to the places that it matters most. A perfect example is optimizing the gym flow. Being able 
to throw on some clothes, grab a bag, and be in the gym in 5 minutes really leads to a great outcome."""


def process_text(t):
    t = t.replace("\n", " ")
    parts = re.compile(r'[.!?]').split(t)

    parts = [p.strip() for p in parts]
    parts = [p for p in parts if len(p) > 0]
    parts = [" ".join(p.split()) for p in parts]

    return parts


async def conversation(orchestrator: "Orchestrator"):
    heads = list(orchestrator.inst.heads.values())

    parts = process_text(text)

    for part in parts:
        print(f"processing: {part}")
        calls = [orchestrator.head_manager.send("voices", head.name, f"/process?text={part}") for head in heads]
        await asyncio.gather(*calls)

    for part in parts:
        for head in heads:
            other_heads = [h for h in heads if h.name != head.name]
            assert len(heads) - len(other_heads) == 1
            positions = [h.global_pos for h in other_heads]
            center = (1.0 / len(positions)) * reduce(operator.add, positions)

            theta = head.point_to(center)
            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)
        await asyncio.sleep(0.5)

        random.shuffle(heads)
        h0, h1 = heads[0], heads[1]

        if orchestrator.focal_points:
            p = h0.global_pos
            selected, distance = orchestrator.closest_focal_point_to(p)
            t0 = h0.point_to(selected)
            path = f"/rotation/{t0:f}"
            orchestrator.head_manager.send("head", h0.name, path)

        else:
            t0 = h0.point_to(h1.global_pos)
            path = f"/rotation/{t0:f}"
            orchestrator.head_manager.send("head", h0.name, path)

            await asyncio.sleep(0.5)

            t1 = h1.point_to(h0.global_pos)
            path = f"/rotation/{t1:f}"
            orchestrator.head_manager.send("head", h1.name, path)

        await asyncio.sleep(0.5)
        path = f"/play?text={part}&isSync=true"
        future = orchestrator.head_manager.send("voices", h0.name, path)

        await future
        await asyncio.sleep(0.5)
