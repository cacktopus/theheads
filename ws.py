import threading
import time
from struct import Struct
from wsgiref.simple_server import make_server

from ws4py.server.wsgirefserver import WSGIServer, WebSocketWSGIRequestHandler, WebSocketWSGIHandler
from ws4py.server.wsgiutils import WebSocketWSGIApplication
from ws4py.websocket import WebSocket

JSMPEG_MAGIC = b'jsmp'
JSMPEG_HEADER = Struct('>4sHH')
WIDTH = 1280
HEIGHT = 720


class StreamingWebSocket(WebSocket):
    def opened(self):
        print("connect")
        self.send(JSMPEG_HEADER.pack(JSMPEG_MAGIC, WIDTH, HEIGHT), binary=True)


def broadcast_thread(converter, websocket_server):
    try:
        while True:
            buf = converter.stdout.read1(32768)
            print("read", len(buf))
            if buf:
                websocket_server.manager.broadcast(buf, binary=True)
            elif converter.poll() is not None:
                break
    finally:
        converter.stdout.close()


def websocket_server():
    WebSocketWSGIHandler.http_version = '1.1'
    server = make_server(
        '',
        8001,
        server_class=WSGIServer,
        handler_class=WebSocketWSGIRequestHandler,
        app=WebSocketWSGIApplication(
            protocols=['null'],
            handler_cls=StreamingWebSocket,
        )
    )
    server.initialize_websockets_manager()
    return server


def main():
    ws = websocket_server()

    t0 = threading.Thread(target=ws.serve_forever, daemon=True)
    t0.start()

    t1 = threading.Thread(target=broadcast_thread, args=[ws], daemon=True)
    t1.start()

    print("Waiting...")
    while True:
        time.sleep(1)


if __name__ == '__main__':
    main()
