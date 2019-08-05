import Polygon
import noise
import numpy as np
import random

import svgwrite

from walls import Wall, outer


def make(wall: Wall):
    rng = np.arange(2, 146-2, 0.25)

    points = []

    waves = Polygon.Polygon()

    for y in np.arange(50, 50 + 81, 5):
        for x in rng:
            fxy = 50 * noise.snoise2(x / 100, y / 100.0)
            points.append((x, y + fxy + 1))

        for x in reversed(rng):
            fxy = 50 * noise.snoise2(x / 100, y / 100.0)
            points.append((x, y + fxy - 1))

        p = Polygon.Polygon(points)
        waves += p

    print(1)
    waves &= wall.window
    print(2)
    wall.result = wall.wall - wall.window + waves
    print(3)


def main():
    random.seed(44)

    base = 'waves'

    prod_svg = svgwrite.Drawing(f'{base}.svg', profile='tiny')
    debug_svg = svgwrite.Drawing(f'{base}-debug.svg', profile='tiny')
    for i in range(1):
        wall = Wall(f"{base}-{i}", outer, x_offset=i * (146 + 10))
        make(wall)
        wall.to_svg(prod_svg)
        wall.make_stl()

    prod_svg.save()
    debug_svg.save()


if __name__ == '__main__':
    main()
