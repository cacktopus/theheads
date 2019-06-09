import os
import re

import requests
import hashlib


def hash_text(text: str):
    digest = hashlib.md5(text.encode()).hexdigest()
    # path = os.path.join("sounds", digest[:2])
    path = "sounds"
    filename = digest[2:] + ".wav"
    return digest, path, filename


def process_text(t):
    t = t.replace("\n", " ")
    t = t.replace("/", " ")
    t = t.replace("I'm", "eye'm")
    t = t.replace("I've", "eye've")
    parts = re.compile(r'[.!?]+').split(t)

    parts = [p.strip() for p in parts]
    parts = [p for p in parts if len(p) > 0]
    parts = [" ".join(p.split()) for p in parts]

    return parts


class Voice:
    pass


class Rms(Voice):
    pass


def main():
    with open("text") as fp:
        text2 = fp.read()

    parts = process_text(text2)

    for part in parts:
        print(part)
        resp = requests.get(
            url="http://localhost:59125/process",
            params={
                "INPUT_TYPE": "TEXT",
                "OUTPUT_TYPE": "AUDIO",
                "INPUT_TEXT": part,
                "AUDIO_OUT": "WAVE_FILE",
                "LOCALE": "en_GB",
                "VOICE": "dfki-spike-hsmm",
                "AUDIO": "WAVE_FILE",
            }
        )

        digest, path, filename = hash_text(part)
        os.makedirs(path, exist_ok=True)

        fullname = os.path.join(path, filename)

        print(resp.status_code, len(resp.content))
        with open(fullname, "wb") as fp:
            fp.write(resp.content)


if __name__ == '__main__':
    main()
