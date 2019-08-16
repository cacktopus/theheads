import Polygon
import noise
import numpy as np
import random

import svgwrite
from svgwrite import Drawing

from walls import Wall, outer


def f(x: float, y: float) -> float:

    scale = 20

    fxy = (
            0
            + scale / 1 * noise.snoise2(x / 100 * 1 + 0, y / 100.0 * 1 + 0)
            + scale / 4 * noise.snoise2(x / 100 * 2 + 100, y / 100.0 * 2 + 100)
            # + scale / 16 * noise.snoise2(x / 100 * 4, y / 100.0 * 4)
    )
    return fxy


def make(wall: Wall, svg: Drawing):
    rngx = np.arange(2, 146 - 2, 0.25)

    waves = Polygon.Polygon()

    w2 = 0.85

    for y in np.arange(80, 100 + 120, 5.0):
        points = []
        for x in rngx:
            fxy = f(x, y/1.66)
            points.append((x, y + fxy + w2))

        for x in reversed(rngx):
            fxy = f(x, y/1.66)
            points.append((x, y + fxy - w2))

        p = Polygon.Polygon(points)
        waves += wall.window & p

    svg.save()

    waves &= wall.window
    wall.result = wall.wall - wall.window + waves


def main():
    random.seed(44)

    base = 'waves'

    prod_svg = svgwrite.Drawing(f'{base}.svg', profile='tiny')
    debug_svg = svgwrite.Drawing(f'{base}-debug.svg', profile='tiny')
    for i in range(1):
        wall = Wall(f"{base}-{i}", outer, x_offset=i * (146 + 10))
        make(wall, prod_svg)
        wall.to_svg(prod_svg)
        wall.make_stl()

    prod_svg.save()
    debug_svg.save()


if __name__ == '__main__':
    main()
