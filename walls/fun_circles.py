import Polygon
from bridson import poisson_disc_samples

from config import Config
from geom import circle_points, distance
from transformations import Vec
from walls import Wall

circles_cfg = Config(
    r=8,
    line_width=2,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=1.75,

    x0=25,
    y0=25,
    max_x=50 + 146,
    max_y=50 + 146,
)


def fun_circles(cfg):
    wall = Wall("fun-circles", cfg)

    points = poisson_disc_samples(width=cfg.max_x, height=cfg.max_y, r=cfg.r * 0.80)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    for i, point in enumerate(points):
        r = radii[i] * 0.95
        center = Vec(*point)
        points = circle_points(center, r, 20)

        poly = Polygon.Polygon([p.point2 for p in points]) & wall.window
        wall.result = wall.result + poly

    wall.result = wall.wall - wall.result
    wall.make_stl()


def main():
    fun_circles(circles_cfg)


if __name__ == '__main__':
    main()
