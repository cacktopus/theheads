import Polygon
from bridson import poisson_disc_samples

from geom import circle_points, centroid, tess, make_stl, distance
from transformations import Vec
from config import Config

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
    x0, y0 = cfg.x0, cfg.y0
    x1, y1 = x0 + cfg.width, y0 + cfg.height

    wall = Polygon.Polygon([
        (x0, y0),
        (x1, y0),
        (x1, y1),
        (x0, y1),
    ])

    window = Polygon.Polygon([
        (x0 + cfg.pad_x, y0 + cfg.pad_y),
        (x1 - cfg.pad_x, y0 + cfg.pad_y),
        (x1 - cfg.pad_x, y1 - cfg.pad_y),
        (x0 + cfg.pad_x, y1 - cfg.pad_y),
    ])

    points = poisson_disc_samples(width=cfg.max_x, height=cfg.max_y, r=cfg.r * 0.80)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    result = Polygon.Polygon()

    for i, point in enumerate(points):
        r = radii[i] * 0.95
        center = Vec(*point)
        points = circle_points(center, r, 20)

        poly = Polygon.Polygon([p.point2 for p in points]) & window
        result = result + poly

    result = wall - result

    holes = []
    contours = []
    for i in range(len(result)):
        cont = result[i]
        contours.append(list(reversed(cont)))  # Not sure why I need to reverse here, but we have the wrong orientation
        print(result.orientation(i), result.isHole(i), cont)

        if result.isHole(i):
            h = centroid(cont)
            holes.append(h)

    B, A = tess(contours, holes)
    make_stl("fun-circles", contours, B, A, 1.75)


def main():
    fun_circles(circles_cfg)


if __name__ == '__main__':
    main()
