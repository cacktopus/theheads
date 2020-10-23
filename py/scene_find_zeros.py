import asyncio


async def find_zeros(orchestrator: "Orchestrator"):
    for head in orchestrator.inst.heads.values():
        path = "/find_zero"
        orchestrator.head_manager.send("head", head.name, path)

    await asyncio.sleep(8.0)  # TODO: poll or something
