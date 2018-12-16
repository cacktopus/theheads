import asyncio
import json


async def _read_stream(stream, cb):
    while True:
        line = await stream.readline()
        if line:
            cb(line)
        else:
            break


async def run_journalctl(stdout_cb, stderr_cb):
    process = await asyncio.create_subprocess_exec(
        "journalctl",
        "-n", "0",
        "-f",
        "-o", "json",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    await asyncio.wait([
        _read_stream(process.stdout, stdout_cb),
        _read_stream(process.stderr, stderr_cb)
    ])
    return await process.wait()


def on_line(name):
    def f(line):
        print("hi")
        msg = json.loads(line.decode())
        print(name, "got line", msg, flush=True)
    return f


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_journalctl(
        on_line("stdout"),
        on_line("stdin"),
    ))


if __name__ == '__main__':
    main()
