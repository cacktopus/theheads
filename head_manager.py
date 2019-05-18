import asyncio
import datetime
import json
import sys
from dataclasses import dataclass

from aiohttp import ClientConnectorError

from config import get
from consul_config import ConsulBackend

_SEND_DELAY = 0.025


class SendError(Exception):
    pass


@dataclass
class QueueItem:
    path: str
    result: asyncio.Future


class HeadQueue:
    def __init__(self, service_name, head_name):
        self._queue = asyncio.Queue(maxsize=50)
        self._consul = ConsulBackend()
        self._service_name = service_name
        self._head_name = head_name
        asyncio.ensure_future(self._send_loop())

    def send(self, rotation: float):
        if self._queue.full():
            self._queue.get_nowait()
        return self._queue.put_nowait(rotation)

    @property
    def description(self) -> str:
        return f"{self._service_name}[{self._head_name}]"

    async def _send_loop(self):
        while True:
            item: QueueItem = await self._queue.get()
            path = item.path
            assert path.startswith("/")

            # Send only the last item in the queue # TODO: support different policies
            while not self._queue.empty():
                # TODO: cancel any futures?
                item.result.cancel()
                path = self._queue.get_nowait()

            resp, text = await self._consul.get_nodes_for_service(self._service_name, tags=[self._head_name])
            assert resp.status == 200
            msg = json.loads(text)

            if len(msg) == 0:
                print(f"Could not find service registered for {self.description}")

            elif len(msg) > 1:
                print(f"Found more than one service registered for {self.description}")

            else:
                address = msg[0]['Address']
                port = msg[0]['ServicePort']
                url = f"http://{address}:{port}{path}"
                # print(datetime.datetime.now(), url)
                try:
                    print(url)
                    resp, text = await get(url)
                    item.result.set_result((resp, text))
                except ClientConnectorError as e:
                    # TODO: stats/logging/etc
                    print(e, file=sys.stderr)
                    item.result.exception(SendError(f"connection error: {e}"))
                if resp.status != 200:
                    info = f"Got error from {url}: {text}"
                    print(info)
                    item.result.exception(SendError(info))

            await asyncio.sleep(_SEND_DELAY)


class HeadManager:
    def __init__(self):
        self._queues = dict()

    def send(self, service_name: str, head_name: str, path: str) -> asyncio.Future:
        key = (service_name, head_name)
        if key not in self._queues:
            self._queues[key] = HeadQueue(service_name, head_name)
        queue = self._queues[key]
        item = QueueItem(path, asyncio.Future())
        queue.send(item)

        return item.result
