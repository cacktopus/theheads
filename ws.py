import asyncio
import math
from datetime import datetime

import aiohttp
from aiohttp import web

from grid import the_grid
from installation import Installation, build_installation
from transformations import Vec, Mat


class Closed:
    pass


class WebsocketConnection:
    def __init__(self, inst: Installation):
        self.ws = None
        self.draw_queue = asyncio.Queue()
        self.draw_stuff_coro = asyncio.ensure_future(self.draw_stuff())
        self.inst = inst

    async def handle(self, request):
        print("Websocket connect")
        self.ws = web.WebSocketResponse()

        await self.ws.prepare(request)

        await self.ws.send_json(dict(time=str(datetime.now())))

        async for msg in self.ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                if msg.data == 'close':
                    await self.ws.close()
                else:
                    await self.ws.send_str(msg.data + '/answer')
            elif msg.type == aiohttp.WSMsgType.ERROR:
                print('ws connection closed with exception %s' %
                      self.ws.exception())

        print('websocket connection closed')
        assert self.ws is not None
        result = self.ws
        self.ws = Closed  # release reference
        self.draw_stuff_coro.cancel()
        return result

    async def draw_stuff(self):
        try:
            while True:
                # Get a "work item" out of the queue.
                data = []
                item = await self.draw_queue.get()
                data.append(item)
                while not self.draw_queue.empty():
                    item = self.draw_queue.get_nowait()
                    data.append(item)

                fut = self.ws.send_json({
                    "type": "draw",
                    "data": data,
                })

                if self.ws is Closed:
                    break

                await fut  # perhaps do in parallel, or something else
        except asyncio.CancelledError:
            pass


class WebsocketManager:
    def __init__(self):
        self.clients = set()

    async def websocket_handler(self, request):
        conn = WebsocketConnection(request.app['inst'])
        self.clients.add(conn)
        ws = await conn.handle(request)
        self.clients.remove(conn)
        return ws
