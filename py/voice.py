import hashlib
import os
import re


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

    if len(sentences) != len(endings):
        1/0

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
        directory = os.path.join(self._voice.name, digest[:2])
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

        sentence = sentence.replace("she's", "shees")
        sentence = sentence.replace("She's", "shees")

        sentence = sentence.replace("she'll", "sheel")
        sentence = sentence.replace("She'll", "sheel")

        return sentence

    @property
    def text(self):
        return self._text


def all_parts(voice: Voice, content: str):
    parts = split(content)

    for s in parts:
        yield Sentence(voice, s)
