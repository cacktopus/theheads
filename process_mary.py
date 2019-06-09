import os
import re

import requests
import hashlib

import hashicorp_vault


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
    text = text.replace("\u2026", " ")

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
        directory = os.path.join("sounds", self._voice.name, digest[:2])
        filename = digest[2:] + ".wav"
        return os.path.join(directory, filename)

    def fixup(self):
        sentence = self._text
        sentence = sentence.replace("I'm", "eye'm")
        sentence = sentence.replace("I've", "eye've")

        sentence = sentence.replace("They're", "there")
        sentence = sentence.replace("they're", "there")

        sentence = sentence.replace("we're", "weer")
        sentence = sentence.replace("We're", "weer")

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
    voice = Rms()

    vault_client = hashicorp_vault.Client()

    secret = vault_client.get("texts")

    for name, content in secret.items():
        print(name, content)

        for sentence in all_parts(voice, content):
            print("\n" + sentence.text)

            filename = sentence.hash()
            if os.path.exists(filename):
                continue

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

            print(resp.status_code, len(resp.content))
            assert resp.status_code == 200

            directory = os.path.dirname(filename)
            os.makedirs(directory, exist_ok=True)

            with open(filename, "wb") as fp:
                fp.write(resp.content)


if __name__ == '__main__':
    main()
