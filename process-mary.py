import os

import requests
import hashlib


def hash_text(text: str):
    digest = hashlib.md5(text.encode('ascii')).hexdigest()
    path = os.path.join("sounds", digest[:2])
    filename = digest[2:] + ".wav"
    return digest, path, filename


class Voice:
    pass


class Rms(Voice):
    pass


def main():
    text = "hi there mr large brain healthy man"
    resp = requests.get(
        url="http://localhost:59125/process",
        params={
            "INPUT_TYPE": "TEXT",
            "OUTPUT_TYPE": "AUDIO",
            "INPUT_TEXT": text,
            "AUDIO_OUT": "WAVE_FILE",
            "LOCALE": "en_GB",
            "VOICE": "dfki-spike-hsmm",
            "AUDIO": "WAVE_FILE",
        }
    )

    digest, path, filename = hash_text(text)
    os.makedirs(path, exist_ok=True)

    fullname = os.path.join(path, filename)

    print(resp.status_code, len(resp.content))
    with open(fullname, "wb") as fp:
        fp.write(resp.content)


if __name__ == '__main__':
    main()
