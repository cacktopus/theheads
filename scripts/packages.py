import os.path

import re
from dataclasses import dataclass
from typing import Tuple


class PkgNotFound(RuntimeError):
    pass


arch_map = {
    "armv6l": "arm6",
    "armv7l": "arm7",
}


def is_strint(n: str) -> bool:
    try:
        int(n)
    except ValueError:
        return False
    return True


@dataclass
class Package:
    name: str
    arch: str
    major: int
    minor: int
    patch: int
    digest: str = ""
    orig: str = ""

    @property
    def version(self) -> Tuple[int, int, int]:
        return self.major, self.minor, self.patch

    @property
    def filename(self) -> str:
        if self.orig:
            return self.orig
        return f"{self.name}_{self.major}.{self.minor}.{self.patch}_{self.arch}.tar.gz"

    @staticmethod
    def parse(f: str):
        base = os.path.basename(f)
        parts = re.sub(r"[-_.]", " ", base).split()

        version_parts = [int(p) for p in parts if is_strint(p)]
        assert len(version_parts) == 3

        ma, mi, pa = version_parts
        version = ".".join([str(ma), str(mi), str(pa)])

        name = base.split(version)[0].rstrip("_").rstrip("-").rstrip(".")

        for opt in ["arm64", "amd64", "armhf", "armv7", "armv6l", "armv6"]:
            if opt in f:
                arch = opt
                break
        else:
            raise Exception("unknown arch")

        return Package(name=name, arch=arch, major=ma, minor=mi, patch=pa, orig=f)
