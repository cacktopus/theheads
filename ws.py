import asyncio
import json
from typing import Dict, Callable

import aiohttp
from aiohttp import web

from transformations import Vec


class Closed:
    pass


class WebsocketConnection:
    def __init__(self, broadcast: Callable):
        self._ws = None
        self._send_queue = asyncio.Queue()
        self._send_stuff_coro = asyncio.ensure_future(self._send_loop())
        self._broadcast = broadcast

    async def handle(self, request):
        print("Websocket connect")
        self._ws = web.WebSocketResponse()

        await self._ws.prepare(request)

        self.send({
            "type": "startup",
            "data": {},
        })

        async for msg in self._ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                if msg.data == 'close':
                    await self._ws.close()
                else:
                    payload = json.loads(msg.data)
                    data = payload['data']
                    # TODO: should be more command-focused, e.g., set-head-rotation
                    if payload['type'] == 'head-rotation':
                        self._broadcast('head-rotation', head_name=data['headName'], rotation=data['rotation'])

                    elif payload['type'] == 'focal-point-location':
                        location = data['location']
                        self._broadcast(
                            'focal-point-location',
                            x=location['x'],
                            y=location['y'],
                            name=data['focalPointName'],
                        )

            elif msg.type == aiohttp.WSMsgType.ERROR:
                print('ws connection closed with exception %s' %
                      self._ws.exception())

        print('websocket connection closed')
        assert self._ws is not None
        result = self._ws
        self._ws = Closed  # release reference
        self._send_stuff_coro.cancel()
        return result

    def send(self, msg: Dict):
        assert "type" in msg
        assert "data" in msg
        return self._send_queue.put_nowait(msg)

    async def _send_loop(self):
        try:
            while True:
                # Get a "work item" out of the queue.
                data = []
                item = await self._send_queue.get()
                data.append(item)

                # Get any other remaining items
                while not self._send_queue.empty():
                    item = self._send_queue.get_nowait()
                    data.append(item)

                fut = self._ws.send_json(data)

                if self._ws is Closed:
                    break

                await fut  # perhaps do in parallel, or something else
        except asyncio.CancelledError:
            pass


class WebsocketManager:
    def __init__(self, broadcast):
        self._clients = set()
        self.broadcast = broadcast

    async def websocket_handler(self, request):
        conn = WebsocketConnection(broadcast=self.broadcast)
        self._clients.add(conn)
        ws = await conn.handle(request)
        self._clients.remove(conn)
        return ws

    def send(self, msg):
        for client in self._clients:
            client.send(msg)

    def notify(self, subject, **kw):
        if subject in ("head-positioned", "active", "kinect"):
            self.send(kw['msg'])
