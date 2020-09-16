import time

import glob
import serial
import threading

from flask import Flask

MINUTE = 60.0


class FakeSerial:
    def readline(self):
        time.sleep(1e6)

    def write(self, s: bytes):
        print("wrote", s)


def poll(ser: serial.Serial):
    while True:
        i: bytes = ser.readline()
        print(i.decode())


def printer(event: threading.Event, ser: serial.Serial):
    time.sleep(10.0)

    while True:
        event.wait()

        print("heat")
        ser.write(b"M140 S65\n")

        time.sleep(15 * MINUTE)

        print("cool")
        ser.write(b"M140 S40\n")

        time.sleep(2 * MINUTE)
        print("done")
        event.clear()


def get_serial():
    ports = glob.glob("/dev/cu.usb*") + glob.glob("/dev/ttyACM*")
    assert len(ports) == 1

    port = ports[0]
    print(port)

    return serial.Serial(port, 250000)


def main():
    ser = get_serial()
    # ser = FakeSerial()

    event = threading.Event()

    t = threading.Thread(target=poll, args=[ser])
    t.start()

    t = threading.Thread(target=printer, args=[event, ser])
    t.start()

    app = Flask(__name__)

    @app.route("/go")
    def go():
        if event.is_set():
            return "No!\n", 503
        else:
            event.set()
            return "Ok\n"

    app.run(host="0.0.0.0")


if __name__ == '__main__':
    main()
