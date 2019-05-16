import asyncio


async def follow_evade(orchestrator: "Orchestrator"):
    while True:
        for head in orchestrator.inst.heads.values():
            p = head.global_pos

            selected, distance = orchestrator.closest_focal_point_to(p)
            if selected is not None:
                # TODO: add some "hysteresis" here
                # TODO: random depending on time
                if distance > 1.0:
                    theta = head.point_to(selected)
                else:
                    theta = head.point_away_from(selected)

                path = f"/rotation/{theta:f}"
                orchestrator.head_manager.send("head", head.name, path)

        await asyncio.sleep(0.20)
