import prometheus_client
from aiohttp import web


async def handle(request):
    name = request.match_info.get('name', 'anon')
    text = "Hello, {}\n".format(name)
    return web.Response(text=text)


async def handle_metrics(request):
    resp = web.Response(body=prometheus_client.generate_latest())
    resp.content_type = prometheus_client.CONTENT_TYPE_LATEST
    return resp


def main():
    app = web.Application()

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/{name}', handle),
    ])

    web.run_app(app)


if __name__ == '__main__':
    main()
