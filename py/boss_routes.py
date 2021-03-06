import asyncio
import json
import os
import platform
from string import Template

from aiohttp import web
from aiohttp.web_request import Request
from jinja2 import Environment, FileSystemLoader, select_autoescape

import log
from health import health_check
from installation import build_installation
from metrics import handle_metrics
from ws import WebsocketManager


async def home(request):
    jinja_env = request.app['jinja_env']

    template = jinja_env.get_template('boss.html')

    hostname = platform.node()
    result = template.render(hostname=hostname)

    return web.Response(text=result, content_type="text/html")


async def html_handler(request):
    filename = request.match_info.get('name') + ".html"
    with open(filename) as fp:
        contents = Template(fp.read())

    text = contents.safe_substitute()
    return web.Response(text=text, content_type="text/html")


def static_text_handler(extension):
    # TODO: make sure .. not allowed in paths, etc.
    content_type = {
        "js": "text/javascript",
    }[extension]

    async def handler(request):
        filename = request.match_info.get('name') + "." + extension
        with open(filename) as fp:
            text = fp.read()
        return web.Response(text=text, content_type=content_type, headers={
            "Access-Control-Allow-Origin": "*",  # TODO
        })

    return handler


def static_binary_handler(extension):
    # TODO: make sure .. not allowed in paths, etc.
    content_type = {
        "png": "image/png",
    }[extension]

    async def handler(request):
        filename = request.match_info.get('name') + "." + extension
        with open(filename, "rb") as fp:
            body = fp.read()
        return web.Response(body=body, content_type=content_type)

    return handler


async def installation_handler(request):
    cfg = request.app['cfg']

    result = await build_installation(cfg['cfg'])

    return web.Response(text=json.dumps(result), content_type="application/json")


async def task_handler(request):
    tasks = list(sorted(asyncio.Task.all_tasks(), key=id))
    text = ["tasks: {}".format(len(tasks))]
    for task in tasks:
        text.append("{} {}\n{}".format(
            hex(id(task)),
            task._state,
            str(task)
        ))

    return web.Response(text="\n\n".join(text), content_type="text/plain")


def frontend_handler(*path_prefix):
    async def handler(request):
        filename = request.match_info.get('filename')
        path = os.path.join(*path_prefix, filename)

        ext = os.path.splitext(path)[-1]

        mode = {".png": "rb"}.get(ext, "r")

        log.info("handling", path=path)
        with open(path, mode) as fp:
            content = fp.read()

        content_type = {
            ".css": "text/css",
            ".json": "application/json",
            ".js": "text/javascript",
            ".map": "application/octet-stream",
            ".png": "image/png",
            ".html": "text/html",
        }[ext]

        if mode == "rb":
            return web.Response(body=content, content_type=content_type)
        else:
            return web.Response(text=content, content_type=content_type)

    return handler


async def text_upload_handler(request: Request):
    body = await request.read()
    log.info("text_upload_handler", body=body)
    return web.Response(text="ok")


def setup_routes(app: web.Application, ws_manager: WebsocketManager):
    jinja_env = Environment(
        loader=FileSystemLoader('templates'),
        autoescape=select_autoescape(['html', 'xml'])
    )

    app['jinja_env'] = jinja_env

    app.add_routes([
        web.get('/', home),
        web.get('/health', health_check),
        web.get('/metrics', handle_metrics),
        web.get('/ws', ws_manager.websocket_handler),
        web.get("/tasks", task_handler),

        web.get('/installation/scene.json', installation_handler),
        web.get('/installation/{name}.html', html_handler),
        web.get('/installation/{name}.js', static_text_handler("js")),
        web.get('/installation/{name}.png', static_binary_handler("png")),

        # deprecated, use don't use above instead
        web.get('/installation/{installation}/scene.json', installation_handler),
        web.get('/installation/{installation}/{name}.html', html_handler),
        web.get('/installation/{installation}/{name}.js', static_text_handler("js")),
        web.get('/installation/{installation}/{name}.png', static_binary_handler("png")),

        # Jenkins' frontend
        web.get("/build/{filename}", frontend_handler("boss-ui/build")),
        web.get("/build/json/{filename}", frontend_handler("boss-ui/build/json")),
        web.get("/build/media/{filename}", frontend_handler("boss-ui/build/media")),
        web.get("/build/js/{filename}", frontend_handler("boss-ui/build/js")),
        web.get("/static/js/{filename}", frontend_handler("boss-ui/build/static/js")),
        web.get("/static/css/{filename}", frontend_handler("boss-ui/build/static/css")),

        web.post("/texts", text_upload_handler),
    ])
