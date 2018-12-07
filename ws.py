import asyncio
from datetime import datetime

import aiohttp
from aiohttp import web

from transformations import Vec, Mat


class WebsocketConnection:
    def __init__(self):
        self.ws = None
        self.draw_queue = asyncio.Queue()
        asyncio.ensure_future(self.draw_stuff())

    async def handle(self, request):
        print("Websocket connect")
        self.ws = web.WebSocketResponse()

        await self.ws.prepare(request)

        await self.ws.send_json(dict(time=str(datetime.now())))

        await self.ws.send_json(dict(
            type="draw",
            data=[dict(
                shape="line",
                coords=[-1.5, 1, 1.5, 1],
            )]  
        ))

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
        return self.ws

    def motion_detected(self, inst, msg):
        data = msg['data']

        cam = inst.cameras[data['cameraName']]
        p0 = Vec(0, 0)
        p1 = Mat.rotz(data['position']) * Vec(5, 0)

        p0 = cam.stand.m * cam.m * p0
        p1 = cam.stand.m * cam.m * p1

        drawCmd = {
            "shape": "line",
            "coords": [p0.x, p0.y, p1.x, p1.y],
        }
        self.draw_queue.put_nowait(drawCmd)

    async def draw_stuff(self):
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

            await fut  # perhaps do in parallel, or something else


class WebsocketManager:
    def __init__(self):
        self.clients = set()

    async def websocket_handler(self, request):
        conn = WebsocketConnection()
        self.clients.add(conn)
        ws = await conn.handle(request)
        self.clients.remove(conn)
        return ws
