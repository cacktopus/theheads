import asyncio

import util
from installation import Head


async def follow_closest_focal_point(
        head: Head,
        orchestrator: "Orchestrator",
        evade_distance: float = -1.0,
):
    while True:
        p = head.global_pos

        selected, distance = orchestrator.closest_focal_point_to(p)
        if selected is not None:
            # TODO: add some "hysteresis" here
            # TODO: random depending on time
            if distance < evade_distance:
                theta = head.point_away_from(selected)
            else:
                theta = head.point_to(selected)

            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)

        await asyncio.sleep(0.04)


async def follow_evade(orchestrator: "Orchestrator"):
    tasks = []
    for head in orchestrator.inst.heads.values():
        task = util.create_task(
            follow_closest_focal_point(head, orchestrator, -1.0),
            allow_cancel=True,
        )
        tasks.append(task)
    await asyncio.gather(*tasks)
