import os
import re

import requests
import hashlib


def hash_text(voice_name: str, text: str):
    key = f"{voice_name}::{text}".encode('ascii')
    digest = hashlib.md5(key).hexdigest()
    # path = os.path.join("sounds", digest[:2])
    path = "sounds"
    filename = digest[2:] + ".wav"
    return digest, path, filename


def split(text):
    text = text.replace("\n", " ")
    text = text.replace("/", " ")
    text = text.replace("\u2019", "'")

    parts = re.compile(r'([.!?]+)').split(text)
    parts = [p.strip() for p in parts]

    # kill any empty string at the end
    if not parts[-1]:
        parts.pop()

    sentences = parts[::2]
    endings = parts[1::2]

    assert len(sentences) == len(endings)

    results = [
        s + e
        for s, e in
        zip(sentences, endings)
    ]

    print("\n".join(results))

    return results


def process_text(sentence):
    sentence = sentence.replace("I'm", "eye'm")
    sentence = sentence.replace("I've", "eye've")

    sentence = sentence.replace("They're", "there")
    sentence = sentence.replace("they're", "there")

    sentence = sentence.replace("IC", "EYE CEE")

    sentence = sentence.replace("shit", "shiit")
    sentence = sentence.replace("uber", "oober")
    return sentence


class Voice:
    pass


class Rms(Voice):
    name = "rms"
    voice = "cmu-rms-hsmm"
    pass


def main():
    with open("text") as fp:
        content = fp.read()

    parts = split(content)

    voice = Rms()

    for part in parts:
        digest, path, filename = hash_text(voice.name, part)

        text = process_text(part)

        resp = requests.get(
            url="http://localhost:59125/process",
            params={
                "INPUT_TYPE": "TEXT",
                "OUTPUT_TYPE": "AUDIO",
                "INPUT_TEXT": text,
                "AUDIO_OUT": "WAVE_FILE",
                "LOCALE": "en_GB",
                "VOICE": voice.voice,
                "AUDIO": "WAVE_FILE",
            }
        )

        os.makedirs(path, exist_ok=True)

        fullname = os.path.join(path, filename)

        print("\n" + part)
        print("\n" + text)
        print(resp.status_code, len(resp.content))
        with open(fullname, "wb") as fp:
            fp.write(resp.content)


if __name__ == '__main__':
    main()
