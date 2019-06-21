import random

import Polygon
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
    random.seed(42)
    wall = Wall("fun-circles", cfg)

    points = poisson_disc_samples(width=cfg.width + 100, height=cfg.height + 100, r=cfg.r * 0.80)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    cut = Polygon.Polygon()
    random.shuffle(points)
    for i, point in enumerate(points):
        r = radii[i] * 0.85
        center = Vec(*point)
        points = square_points(center, r)

        poly = Polygon.Polygon([p.point2 for p in points])
        cut |= poly

    mask = wall.window & cut

    wall.result = wall.wall - mask
    wall.make_stl()


def main():
    fun_circles(circles_cfg)


if __name__ == '__main__':
    main()
