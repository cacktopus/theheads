import asyncio
import re
from typing import Callable

from config import Config
from const import DEFAULT_CONSUL_ENDPOINT
from consul_config import ConsulBackend
from head_manager import HeadManager
from installation import Installation, build_installation
from observer import Observer

texts = list()


def process_text(t):
    t = t.replace("\n", " ")
    t = t.replace("/", " ")
    t = t.replace("I'm", "eyem")
    parts = re.compile(r'[.!?]').split(t)

    parts = [p.strip() for p in parts]
    parts = [p for p in parts if len(p) > 0]
    parts = [" ".join(p.split()) for p in parts]

    return parts


async def text_manager(head_manager: HeadManager, broadcast: Callable):
    config_endpoint = DEFAULT_CONSUL_ENDPOINT
    endpoint = ConsulBackend(config_endpoint)
    cfg = await Config(endpoint).setup(
        instance_name="boss-01",
    )

    json_inst = await build_installation(cfg)
    inst = Installation.unmarshal(json_inst)

    consul_texts = await cfg.get_prefix("/the-heads/texts")

    await asyncio.sleep(15)  # TODO: 2m

    heads = list(inst.heads.values())

    for t in consul_texts.values():
        text = t.decode()
        parts = process_text(text)

        for part in parts:
            print(f"processing: {part}")
            calls = [head_manager.send("voices", head.name, f"/process?text={part}") for head in heads]
            await asyncio.gather(*calls)

        texts.append(parts)

        broadcast('texts', texts=texts)


def main():
    loop = asyncio.get_event_loop()

    observer = Observer()

    app = loop.run_until_complete(
        text_manager(
            HeadManager(),
            broadcast=observer.notify_observers,
        )
    )

    loop.run_forever()


if __name__ == '__main__':
    main()
