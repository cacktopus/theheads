from aiohttp import web


async def health_check(request):
    return web.Response(text="ok")
