import asyncio


async def follow_evade(orchestrator: "Orchestrator"):
    while True:
        for head in orchestrator.inst.heads.values():
            m = head.stand.m * head.m
            m_inv = m.inv()

            # select the closest focal point to head
            scores = []
            for fp in orchestrator.focal_points.values():
                to = m_inv * fp.pos
                distance = to.abs()
                if distance > 0.01:
                    scores.append((distance, fp.pos))

            if len(scores) == 0:
                continue

            distance, selected = min(scores)

            # TODO: add some "hysteresis" here
            if distance > 0.75:
                theta = head.point_to(selected)
            else:
                theta = head.point_away_from(selected)

            path = f"/rotation/{theta:f}"
            orchestrator.head_manager.send("head", head.name, path)

        await asyncio.sleep(0.20)
