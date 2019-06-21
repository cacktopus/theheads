import random
from typing import List

import Polygon
import noise
import svgwrite
from bridson import poisson_disc_samples

from config import Config
from geom import circle_points, distance
from transformations import Vec
from walls import Wall
from geom import square_points

circles_cfg = Config(
    r=7,
    line_width=2,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=1.75,
)


def fun_circles(cfg):
    # random.seed(42)
    name = "fun-circles"
    wall = Wall(name, cfg)
    debug_svg = svgwrite.Drawing(f'{name}.svg', profile='tiny')

    points = poisson_disc_samples(width=cfg.width + 100, height=cfg.height + 100, r=cfg.r * 0.80)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    cut = Polygon.Polygon()
    random.shuffle(points)

    randx = 1000 * random.random()
    randy = 1000 * random.random()

    for i, point in enumerate(points):
        r = radii[i] * 0.85
        center = Vec(*point)

        theta = 20 * noise.snoise2(
            0.003 * center.x + 1000 * randx,
            0.003 * center.y + 1000 * randy,
        )

        points: List[Vec] = square_points(center, r, theta)

        debug_svg.add(debug_svg.polygon(
            [p.point2 for p in points],
            fill_opacity=0,
            stroke="black",
            stroke_width=0.25
        ))

        poly = Polygon.Polygon([p.point2 for p in points])
        cut |= poly

    mask = wall.window & cut

    wall.result = wall.wall - mask
    wall.make_stl()

    debug_svg.save()


def main():
    fun_circles(circles_cfg)


if __name__ == '__main__':
    main()
