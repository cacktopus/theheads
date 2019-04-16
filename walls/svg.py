import random
import xml.etree.ElementTree as ET
from typing import Tuple, List
import re

from geom import cubic_bezier, tess, make_stl, centroid
from transformations import Vec
from debug_svg import DebugSVG


# TODO: handle quadratic bezier


def random_color():
    r = random.randint(0, 0x7F)
    g = random.randint(0, 0x7F)
    b = random.randint(0, 0x7F)

    color = "#" + (
            "%02x" % r
            + "%02x" % g
            + "%02x" % b
    )

    return color


class SVG:
    def __init__(self, name):
        self.svg = DebugSVG(f"{name}.svg")
        self._first = None
        self._color = None
        self._current_shape = []
        self._shapes = []
        self.finish_shape()

    def line(self, p0: Vec, p1: Vec, stroke='black'):
        if p0.point2 == p1.point2:
            return

        self.svg.debug(self.svg.svg.line(
            (p0 + Vec(5.0, 5.0)).point2,
            (p1 + Vec(5.0, 5.0)).point2,
            stroke=stroke,
            stroke_width=0.5,
        ))

        self.svg.debug(self.svg.svg.circle(p1.point2, 0.25, fill='magenta'))

        if len(self._current_shape) == 0:
            self._current_shape.append(p0)
        self._current_shape.append(p1)

    def finish_shape(self):
        self.set_pos(None)
        self._first = None
        self._color = random_color()
        if len(self._current_shape):
            self._shapes.append(self._current_shape)
        self._current_shape = []

    @property
    def pos(self):
        return self._pos

    def set_pos(self, p):
        if self._first is None:
            self._first = p
        self._pos = p

    @property
    def shape_count(self):
        return len(self._shapes)

    def process(self, cmd, *args):
        print(cmd, " ".join(str(a) for a in args))

        if cmd == 'M':
            p1 = Vec(*args)
            self.set_pos(p1)

        elif cmd == 'c':
            dx1, dy1, dx2, dy2, dx, dy = args

            p0 = self.pos
            p1 = p0 + Vec(dx1, dy1)
            p2 = p0 + Vec(dx2, dy2)
            p3 = p0 + Vec(dx, dy)

            STEPS = 10

            p_bgn = p0
            for i in range(1, STEPS + 1):
                t = i / STEPS

                p_new = cubic_bezier(p0, p1, p2, p3, t)

                self.line(p_bgn, p_new, stroke=self._color)

                p_bgn = p_new
                self.set_pos(p_new)

        elif cmd == 'C':
            x1, y1, x2, y2, x, y = args

            p0 = self.pos
            p1 = Vec(x1, y1)
            p2 = Vec(x2, y2)
            p3 = Vec(x, y)

            STEPS = 10

            p_bgn = p0

            for i in range(1, STEPS + 1):
                t = i / STEPS

                p_new = cubic_bezier(p0, p1, p2, p3, t)

                self.line(p_bgn, p_new, stroke=self._color)

                p_bgn = p_new
                self.set_pos(p_new)

        elif cmd == 's':
            dx2, dy2, dx, dy = args
            p0 = self.pos
            p1 = p0 + Vec(dx, dy)

            self.line(p0, p1)

            self.set_pos(p1)

        elif cmd in 'Zz':
            p0 = self.pos
            p1 = self._first
            self.line(p0, p1)

            self.finish_shape()

        elif cmd in 'h':
            dx = args[0]
            p0 = self.pos
            p1 = p0 + Vec(dx, 0)
            self.line(p0, p1)
            self.set_pos(p1)

        elif cmd in 'H':
            x = args[0]
            p0 = self.pos
            p1 = Vec(x, p0.y)
            self.line(p0, p1)
            self.set_pos(p1)

        elif cmd in 'L':
            x, y = args
            p0 = self.pos
            p1 = Vec(x, y)
            self.line(p0, p1)
            self.set_pos(p1)

        elif cmd in 'S':
            _, _, x, y = args
            p0 = self.pos
            p1 = Vec(x, y)
            self.line(p0, p1)
            self.set_pos(p1)

        else:
            assert 0, f"unknown command {cmd}"


def get_paths(filename):
    tree = ET.parse(filename)
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

    ch = d[0]
    if ch == ",":
        return ch, d[1:]

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

        elif cmd in "Hh":
            x, d = pop_float(d)
            yield cmd, x

        else:
            assert 0, f"unknown cmd: {cmd}"


def main():
    svg = SVG("test")

    # paths = list(get_paths("cloud.svg"))[:500]
    paths = list(get_paths("brain-2 new.svg"))[:1]

    for num, path in enumerate(paths):
        print(f" {num} ".center(80, '='))

        assert path.attrib.get('fill-rule', None) in ("evenodd", None)
        assert path.attrib.get('clip-rule', None) in ("evenodd", None)

        d = path.attrib['d']

        for cmd in list(parse(d)):
            svg.process(cmd[0], *cmd[1:])

    polys = [[v.point2 for v in s] for s in svg._shapes]

    holes = []
    for poly in polys:
        while poly[-1] == poly[0]:  # TODO: fix this properly
            poly.pop()

    for poly in polys[1:]:
        for v in poly:
            svg.svg.debug(svg.svg.svg.circle(v, 0.25, fill='magenta'))
            print(v)

        B, A = tess([poly], [])
        indices = B['triangles'][0]
        triangle = [tuple(B['vertices'][i]) for i in indices]
        print(triangle)
        hole = centroid(triangle)
        print(hole)
        holes.append(hole)
        svg.svg.debug(svg.svg.svg.circle(hole, 1, fill='blue'))

    svg.svg.save()

    B, A = tess(polys, holes)
    make_stl("none", polys, B, A, 2.83 * 1.75)


if __name__ == '__main__':
    main()
