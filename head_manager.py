import asyncio
import json
import sys
from dataclasses import dataclass

import prometheus_client
from aiohttp import ClientConnectorError

from config import get
from consul_config import ConsulBackend

_SEND_DELAY = 0.025

HEAD_MANAGER_SEND = prometheus_client.Counter(
    "head_manager_send",
    "http message sent from head manager",
    ["type", "service", "tag"],
)


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
        self._tag_name = head_name
        asyncio.ensure_future(self._send_loop())

    def send(self, rotation: float):
        if self._queue.full():
            self._queue.get_nowait()
        return self._queue.put_nowait(rotation)

    def incr(self, type_: str):
        HEAD_MANAGER_SEND.labels(type_, self._service_name, self._tag_name).inc()

    @property
    def description(self) -> str:
        return f"{self._service_name}[{self._tag_name}]"

    async def _send_loop(self):
        while True:
            item: QueueItem = await self._queue.get()

            assert isinstance(item, QueueItem)
            path = item.path
            assert path.startswith("/")

            # Send only the last item in the queue # TODO: support different policies
            while not self._queue.empty():
                # TODO: cancel any futures?
                self.incr("cancel")
                item.result.cancel()
                item = self._queue.get_nowait()

            resp, text = await self._consul.get_nodes_for_service(self._service_name, tags=[self._tag_name])
            assert resp.status == 200  # TODO: no no no
            msg = json.loads(text)

            if len(msg) == 0:
                print(f"Could not find service registered for {self.description}")

            elif len(msg) > 1:
                print(f"Found more than one service registered for {self.description}")

            else:
                address = msg[0]['Address']
                port = msg[0]['ServicePort']
                url = f"http://{address}:{port}{path}"

                self.incr("send")
                try:
                    # print("head_manager:", url)
                    resp, text = await get(url)
                    item.result.set_result((resp, text))
                except ClientConnectorError as e:
                    self.incr("connection_error")
                    # TODO: stats/logging/etc
                    print(e, file=sys.stderr)
                    item.result.exception()
                except Exception as e:
                    self.incr("exception")
                    # TODO: stats/logging/etc
                    print(e, file=sys.stderr)
                    item.result.exception()

                if resp.status != 200:
                    self.incr("not_ok")
                    info = f"Got error from {url}: {text}"
                    print(info)
                    item.result.exception()

                else:
                    self.incr("ok")

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
