import asyncio


async def idle(orchestrator: "Orchestrator"):
    while True:
        await asyncio.sleep(60.0)
