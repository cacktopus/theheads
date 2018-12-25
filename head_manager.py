import asyncio
import json

from config import get
from consul_config import ConsulBackend

_SEND_DELAY = 0.025


class HeadQueue:
    def __init__(self, head_name):
        self._queue = asyncio.Queue(maxsize=50)
        self._consul = ConsulBackend()
        self._head_name = head_name
        asyncio.ensure_future(self._send_loop())

    def send(self, rotation: float):
        if self._queue.full():
            self._queue.get_nowait()
        return self._queue.put_nowait(rotation)

    async def _send_loop(self):
        while True:
            item = await self._queue.get()

            while not self._queue.empty():
                item = self._queue.get_nowait()

            position = item

            resp, text = await self._consul.get_nodes_for_service("heads", tags=[self._head_name])
            assert resp.status == 200
            msg = json.loads(text)

            if len(msg) == 0:
                print("Could not find service registered for {}".format(self._head_name))

            elif len(msg) > 1:
                print("Found more than one service registered for {}".format(self._head_name))

            else:
                base_url = "http://{}:{}".format(msg[0]['Address'], msg[0]['ServicePort'])
                url = base_url + "/rotation/{:f}".format(position)
                await get(url)

            await asyncio.sleep(_SEND_DELAY)


class HeadManager:
    def __init__(self):
        self._queues = dict()

    def send(self, head_name: str, rotation: float):
        if head_name not in self._queues:
            self._queues[head_name] = HeadQueue(head_name)
        queue = self._queues[head_name]
        queue.send(rotation)
