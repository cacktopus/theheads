import asyncio
import json
from dataclasses import dataclass
from typing import Optional

import aiohttp
import prometheus_client
from aiohttp import ClientConnectorError

import log
from consul_config import ConsulBackend

_SEND_DELAY = 0.05

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
        self.sessions = {}

    def send(self, rotation: float):
        if self._queue.full():
            self._queue.get_nowait()
        return self._queue.put_nowait(rotation)

    def get_session(self, purpose: str):
        key = "::".join([purpose, self._service_name, self._tag_name])
        if key not in self.sessions:
            self.sessions[key] = aiohttp.ClientSession()
        return self.sessions[key]

    def incr(self, type_: str):
        HEAD_MANAGER_SEND.labels(type_, self._service_name, self._tag_name).inc()

    def error(self, message, **kw):
        # TODO: try/catch here?
        log.error(message, component="HeadQueue", service=self._service_name, tag=self._tag_name, **kw)

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
                self.incr("cancel")
                item.result and item.result.cancel()
                item = self._queue.get_nowait()

            resp, text = await self._consul.get_nodes_for_service(
                self._service_name,
                tags=[self._tag_name],
                session=self.get_session("consul"),
            )

            if resp.status != 200:
                self.incr("consul_error")
                self.error("Error getting nodes for service", status=resp.status, text=str(resp.text))
                continue

            msg = json.loads(text)

            if len(msg) == 0:
                self.error("Could not find registered service")

            elif len(msg) > 1:
                self.error("Found more than one registered service")

            else:
                address = msg[0]['Address']
                port = msg[0]['ServicePort']
                url = f"http://{address}:{port}{path}"

                self.incr("send")
                try:
                    # TODO: timeouts
                    async with self.get_session("http").get(url=url) as _resp:
                        resp = _resp
                    text = resp.text

                except ClientConnectorError as e:
                    self.incr("connection_error")
                    self.error("Connection Error", exception=str(e))
                    item.result and item.result.set_exception(e)
                except Exception as e:
                    self.incr("exception")
                    self.error("Exception", exception=str(e))
                    item.result and item.result.set_exception(e)
                else:
                    if resp.status != 200:
                        self.incr("not_ok")
                        self.error("Response not ok", status=resp.status, text=str(text))
                        item.result and item.result.set_exception(SendError(str(text)))
                    else:
                        self.incr("ok")
                        item.result and item.result.set_result((resp, text))

            await asyncio.sleep(_SEND_DELAY)


class HeadManager:
    def __init__(self):
        self._queues = dict()

    def send(self, service_name: str, head_name: str, path: str, return_future: bool = False) -> Optional[
        asyncio.Future]:
        key = (service_name, head_name)
        if key not in self._queues:
            self._queues[key] = HeadQueue(service_name, head_name)
        queue = self._queues[key]
        item = QueueItem(path, asyncio.Future() if return_future else None)
        queue.send(item)

        return item.result
