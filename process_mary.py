import os
import re

import requests
import hashlib


class Voice:
    pass


class Rms(Voice):
    name = "rms"
    voice = "cmu-rms-hsmm"
    pass


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

    return results


class Sentence:
    def __init__(self, voice: Voice, text: str):
        self._text = text
        self._voice = voice

    def hash(self):
        key = f"{self._voice.name}::{self.text}".encode('ascii')
        digest = hashlib.md5(key).hexdigest()
        path = os.path.join("sounds", self._voice.name, digest[:2])
        filename = digest[2:] + ".wav"
        return digest, path, filename

    def fixup(self):
        sentence = self._text
        sentence = sentence.replace("I'm", "eye'm")
        sentence = sentence.replace("I've", "eye've")

        sentence = sentence.replace("They're", "there")
        sentence = sentence.replace("they're", "there")

        sentence = sentence.replace("IC", "EYE CEE")

        sentence = sentence.replace("shit", "shiit")
        sentence = sentence.replace("uber", "oober")
        return sentence

    @property
    def text(self):
        return self._text


def all_parts(voice: Voice, content: str):
    parts = split(content)

    for s in parts:
        yield Sentence(voice, s)


def main():
    with open("text") as fp:
        content = fp.read()

    voice = Rms()

    for sentence in all_parts(voice, content):
        resp = requests.get(
            url="http://localhost:59125/process",
            params={
                "INPUT_TYPE": "TEXT",
                "OUTPUT_TYPE": "AUDIO",
                "INPUT_TEXT": sentence.fixup(),
                "AUDIO_OUT": "WAVE_FILE",
                "LOCALE": "en_GB",
                "VOICE": voice.voice,
                "AUDIO": "WAVE_FILE",
            }
        )

        digest, path, filename = sentence.hash()

        os.makedirs(path, exist_ok=True)

        fullname = os.path.join(path, filename)

        print("\n" + sentence.text)
        print(resp.status_code, len(resp.content))
        with open(fullname, "wb") as fp:
            fp.write(resp.content)


if __name__ == '__main__':
    main()
