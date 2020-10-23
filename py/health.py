from aiohttp import web

CORS_ALL = {
    "Access-Control-Allow-Origin": "*",  # TODO
}


async def health_check(request):
    return web.Response(text="ok", headers=CORS_ALL)
