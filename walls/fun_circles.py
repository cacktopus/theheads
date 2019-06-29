import math
import random
from typing import List

import Polygon
import noise
import svgwrite
from bridson import poisson_disc_samples

from config import Config
from geom import circle_points, distance, star_points
from transformations import Vec
from walls import Wall
from geom import square_points

circles_cfg = Config(
    r=6.5,
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
    debug_svg = svgwrite.Drawing(f'{name}.svg', profile='tiny')
    WIDTH = 146
    NUM_WALLS = 1
    PAD = 10

    points = poisson_disc_samples(
        width=cfg.width + 50 + (WIDTH + PAD) * NUM_WALLS,
        height=cfg.height + 50,
        r=cfg.r
    )

    total_x = NUM_WALLS * (WIDTH + PAD)

    for i in range(NUM_WALLS):
        x_offset = 25 + i * (WIDTH + PAD)
        selected = [p for p in points if x_offset - 25 < p[0] < x_offset + WIDTH + 25]
        make_wall(cfg, selected, f"{name}-{i}", debug_svg, x_offset, total_x)
        debug_svg.save()


def make_wall(cfg, points, name, debug_svg, x_offset, total_x):
    wall = Wall(name, cfg, x_offset=x_offset, y_offset=25)

    radii = {}

    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    cut = Polygon.Polygon()

    def map_angle(x_in: float, y_in: float) -> float:
        a0 = 30 * math.pi / 180
        f0 = 0.009

        c = total_x

        phi = x_in / c * 2 * math.pi
        r = c / (2 * math.pi)

        x = r * math.cos(phi)
        y = r * math.cos(phi)
        z = y_in

        return a0 * noise.snoise3(
            f0 * x,
            f0 * y,
            f0 * z,
        ) + 0.25 * a0 * noise.snoise3(
            2 * f0 * x + 1000,
            2 * f0 * y + 1000,
            2 * f0 * z + 1000,
        ) + 0.0 * a0 * (random.random() - 0.5)

    for i, point in enumerate(points):
        r = radii[i] * 2.5
        center = Vec(*point)

        theta = map_angle(center.x, center.y)

        points: List[Vec] = star_points(center, r, theta)

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

    debug_svg.add(debug_svg.polygon(wall.window.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))
    debug_svg.add(debug_svg.polygon(wall.wall.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))


def main():
    fun_circles(circles_cfg)


if __name__ == '__main__':
    main()
