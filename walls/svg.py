import xml.etree.ElementTree as ET
from typing import Tuple, List
import re


def get_paths():
    tree = ET.parse('brain-2.svg')
    root = tree.getroot()
    print(tree)

    NS = '{http://www.w3.org/2000/svg}'

    for g in root.findall(f".//{NS}g"):
        assert len(g.attrib) == 0

    print(len(root.findall(f".//{NS}path")))

    for path in root.findall(f".//{NS}path"):
        yield path


re_float = re.compile(r'''
^
(
    -?
    \d+
    \.?
    \d*
)
''', re.X)


def pop_float(d: str) -> Tuple[float, str]:
    d = d.lstrip()

    match = re_float.search(d)
    assert match
    result = match[0]

    return float(result), d[len(result):]


def pop_n_floats(d: str, n: int) -> Tuple[List[float], str]:
    result = []
    while True:
        pos, d = pop_float(d)
        result.append(pos)
        n -= 1
        if n == 0:
            return result, d
        _, d = pop_comma(d)


def pop_comma(d: str) -> Tuple[str, str]:
    d = d.lstrip()

    ch, d = d[0], d[1:]
    if ch == ",":
        return ch, d

    if ch == "-":
        return '', d

    assert 0, "expected comma or ..."


def parse(d: str) -> Tuple[str, str]:
    while True:
        d = d.lstrip()
        if d == "":
            return

        cmd, d = d[0], d[1:]

        if cmd == "M":
            x, d = pop_float(d)
            _, d = pop_comma(d)
            y, d = pop_float(d)
            yield cmd, x, y

        elif cmd in "Cc":
            points, d = pop_n_floats(d, 6)
            yield tuple([cmd] + points)

        elif cmd in "Ss":
            points, d = pop_n_floats(d, 4)
            yield tuple([cmd] + points)

        elif cmd in "Zz":
            yield cmd,

        elif cmd in "Ll":
            points, d = pop_n_floats(d, 2)
            yield tuple([cmd] + points)

        else:
            assert 0, f"unknown cmd: {cmd}"


def main():
    for num, path in enumerate(get_paths()):
        print(f" {num} ".center(80, '='))

        assert path.attrib.get('fill-rule', None) in ("evenodd", None)
        assert path.attrib.get('clip-rule', None) in ("evenodd", None)

        d = path.attrib['d']

        for cmd in parse(d):
            print(cmd)


if __name__ == '__main__':
    main()
