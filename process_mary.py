import os

import requests

import hashicorp_vault
from voice import Rms, all_parts


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
