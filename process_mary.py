import os
import wave

import requests

import hashicorp_vault
from voice import Rms, all_parts, Voice, Sentence


def sound_duration(filename: str) -> float:
    with wave.open(filename, 'r') as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = 1.0 * frames / rate
        return duration


def get_audio(voice: Voice, filename: str, sentence: Sentence) -> float:
    if os.path.exists(filename):
        return sound_duration(filename)

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

    return sound_duration(filename)


def process_script(voice: Voice, name: str, content: str):
    print(f" {name} ".center(80, "-"))

    for sentence in all_parts(voice, content):
        print("\n" + sentence.text)

        digest = sentence.hash()
        print(digest)

        filename = os.path.join("sounds", digest)
        duration = sound_duration(filename)
        print(duration)


def main():
    voice = Rms()

    vault_client = hashicorp_vault.Client()

    secret = vault_client.get("texts")

    for name, content in secret.items():
        process_script(voice, name, content)


if __name__ == '__main__':
    main()
