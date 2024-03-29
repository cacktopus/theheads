import random
from collections import defaultdict
from math import pi
from typing import List, Tuple

import Polygon
import Polygon.IO
import noise
import svgwrite
from bridson import poisson_disc_samples
from pyhull.delaunay import DelaunayTri

import geom
from config import Config
from geom import tess, centroid, make_stl, circle_points
# Ideas
# Cull small or narrow cells
# Leave some cells filled in
from inset import inset, make_convex
from transformations import Vec

inner = Config(
    r=13.5,
    line_width=2.0,
    pad_x=15,
    pad_y=7.5,

    width=106,
    height=79,
    depth=1.75,
)

outer = Config(
    r=11,
    line_width=2.0,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=2,
)

cfg = outer


def circumcenter(triangle: List[Tuple]):
    a, b, c = triangle
    ax, ay = a
    bx, by = b
    cx, cy = c

    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))

    ux = (1 / d) * (
            (ax ** 2 + ay ** 2) * (by - cy) +
            (bx ** 2 + by ** 2) * (cy - ay) +
            (cx ** 2 + cy ** 2) * (ay - by)
    )

    uy = (1 / d) * (
            (ax ** 2 + ay ** 2) * (cx - bx) +
            (bx ** 2 + by ** 2) * (ax - cx) +
            (cx ** 2 + cy ** 2) * (bx - ax)
    )

    return ux, uy


def circumcenter_centroid_lerp(ratio: float, triangle: List[Tuple]) -> Tuple:
    p0 = Vec(*circumcenter(triangle))
    p1 = Vec(*centroid(triangle))

    u = p1 - p0

    result = p0 + u.scale(ratio)

    return result.point2


def spooky_cells(dely: DelaunayTri):
    cells = defaultdict(list)

    for v in dely.vertices:
        for i in v:
            triangle = [dely.points[a] for a in v]
            center = circumcenter_centroid_lerp(0.6, triangle)
            cells[i].append(center)

    return cells


def bounding_box(poly):
    min_x = min(v[0] for v in poly)
    max_x = max(v[0] for v in poly)

    min_y = min(v[1] for v in poly)
    max_y = max(v[1] for v in poly)

    return (min_x, min_y), (max_x, max_y)


def find_inside_point(p: Polygon.Polygon, i: int):
    # random search
    xmin, xmax, ymin, ymax = p.boundingBox(i)
    for _ in range(1000):
        x = random.random() * (xmax - xmin) + xmin
        y = random.random() * (ymax - ymin) + ymin

        if p.isInside(x, y, i):
            return x, y

    raise Exception("Couldn't find interior point")


class Wall:
    def __init__(self, name, cfg, x_offset=0, y_offset=100):
        x0 = x_offset
        y0 = y_offset
        x1 = x0 + cfg.width
        y1 = y0 + cfg.height

        self.cfg = cfg

        self.x0, self.y0 = x0, y0
        self.x1, self.y1 = x1, y1

        self.center = (
            (x1 + x0) / 2,
            (y1 + y0) / 2,
        )

        self.name = name

        self.wall = Polygon.Polygon([
            (x0, y0),
            (x1, y0),
            (x1, y1),
            (x0, y1),
        ])

        self.window = Polygon.Polygon([
            (x0 + cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y1 - cfg.pad_y),
            (x0 + cfg.pad_x, y1 - cfg.pad_y),
        ])

        self.result = Polygon.Polygon()

    def make_stl(self):
        holes = []
        contours = []
        for i in range(len(self.result)):
            cont = self.result[i]
            contours.append(
                list(cont))
            print(self.result.orientation(i), self.result.isHole(i), cont)

            if self.result.isHole(i):
                h = find_inside_point(self.result, i)
                if h is not None:
                    holes.append(h)

        B, A = tess(contours, holes)
        make_stl(self.name, contours, B, A, self.cfg.depth)

    def to_svg(self, svg):
        svg = svg or svgwrite.Drawing(f'{self.name}.svg', profile='tiny')
        # dwg.add(dwg.line((0, 0), (10, 0), stroke=svgwrite.rgb(10, 10, 16, '%')))
        # dwg.add(dwg.text('Test', insert=(0, 0.2), fill='red'))
        for i in range(len(self.result)):
            cont = self.result[i]
            # print(self.result.orientation(i), self.result.isHole(i), cont)
            svg.add(svg.polygon(cont, fill_opacity=0, stroke="black", stroke_width=0.25))

        svg.save()

    def make(self, prod_svg, debug_svg):
        x0, y0 = self.x0, self.y0
        x1, y1 = self.x1, self.y1

        b0 = (x1 - x0) / 2 - (6.125 + 7.5)
        block = Polygon.Polygon([
            (x0 + b0, y0 + 0),
            (x1 - b0, y0 + 0),
            (x1 - b0, y0 + 14.25 + 7.5),
            (x0 + b0, y0 + 14.25 + 7.5),
        ])

        b1 = (x1 - x0) / 2 - 6.125
        tunnel = Polygon.Polygon([
            (x0 + b1, y0 + -10),
            (x1 - b1, y0 + -10),
            (x1 - b1, y0 + 14.25),
            (x0 + b1, y0 + 14.25),
        ])

        width = (x1 - x0) + 150
        height = (y1 - y0) + 150
        points = poisson_disc_samples(width=width, height=height, r=self.cfg.r)

        points = [(p[0] + x0 - 75, y1 - p[1] + 75) for p in points]

        # for p in points:
        #     prod_svg.add(prod_svg.circle(p, 0.5, fill="green"))

        dely = DelaunayTri(points)
        cells = spooky_cells(dely)

        wx0 = min(p[0] for p in self.window[0])
        wx1 = max(p[0] for p in self.window[0])

        wy0 = min(p[1] for p in self.window[0])
        wy1 = max(p[1] for p in self.window[0])

        g0 = Graph(prod_svg, (wx0, wx1), (10, 10 + 30), (0.0, 1.0), "darkblue")
        g1 = Graph(prod_svg, (wx0, wx1), (10 + 30 + 5, 10 + 30 + 5 + 30), (0.0, 1.0), "darkgreen")

        for i, cell in sorted(cells.items()):
            inbounds = all(x0 - 50 < x < x1 + 50 and y0 - 50 < y < y1 + 50 for (x, y) in cell)
            if not inbounds:
                continue

            fixed = make_convex(cell)

            cx, cy = centroid(fixed)

            t = cx / (wx1 - wx0)
            s = cy / (wy1 - wy0)

            v = 0.4 * (
                    0.5
                    + noise.snoise2(0.5 * s, 0.25 * t)
                    + 0.5 * noise.snoise2(1 * s, 0.5 * t + 100)
                    + 0.25 * noise.snoise2(2 * s, 1 * t + 200)
            )
            v = geom.clamp(0, v, 1)
            g0.plot(cx, v)

            boost = inset_boost(v)
            g1.plot(cx, boost)

            inset_amount = self.cfg.line_width / 2.0 + boost

            p = inset(fixed, inset_amount)
            if p is None:
                continue

            cell = Polygon.Polygon(p)

            if len(cell & self.wall) == 0:
                continue

            c = centroid(cell.contour(0))
            a = cell.area(0)
            r = (a / pi) ** 0.5

            circle = Polygon.Polygon([p.point2 for p in circle_points(Vec(*c), r, 20)])

            debug_svg.add(debug_svg.polygon(cell.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))
            debug_svg.add(debug_svg.circle(c, r, fill_opacity=0, stroke="black", stroke_width=0.25))
            # svg.save()

            new = geom.interpolate_poly_circle(debug_svg, cell.contour(0), c, r, 1 - v)
            new = Polygon.Polygon([p.point2 for p in new])

            debug_svg.add(debug_svg.polygon(new.contour(0), fill_opacity=0, stroke="orange", stroke_width=0.25))

            cell &= self.window
            circle &= self.window
            new &= self.window

            self.result += new

        debug_svg.add(debug_svg.polygon(self.window.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))
        debug_svg.add(debug_svg.polygon(self.wall.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))

        print("\n".join(sorted(list(dir(self.result)))))

        self.result = self.wall - self.result
        # wall.result = wall.result | block
        # wall.result = wall.result - tunnel


class Graph:
    def __init__(self, svg, X, Y, y_range, color):
        self.svg = svg
        self.xmin, self.xmax = X
        self.ymin, self.ymax = Y
        self.y_scale = self.ymax - self.ymin
        self.y_range = y_range
        self.color = color

        self.axis()

    def plot(self, x, y):
        t = y * self.y_range[1] + (1 - y) * self.y_range[0]
        y_plot = self.ymax - t * self.y_scale

        self.svg.add(self.svg.circle(
            (x, y_plot),
            1.0,
            fill=self.color))

    def axis(self):
        self.svg.add(self.svg.line(
            (self.xmin, self.ymin),
            (self.xmax, self.ymin),
            stroke_width=1.5,
            opacity=0.5,
            stroke=self.color,
        ))

        self.svg.add(self.svg.line(
            (self.xmin, self.ymax),
            (self.xmax, self.ymax),
            stroke_width=1.5,
            opacity=0.5,
            stroke=self.color,
        ))


def inset_boost(t: float) -> float:
    return geom.clamp(0, -1 + 1.75 * t, 0.66)


def main():
    random.seed(47)

    prod_svg = svgwrite.Drawing(f'wall2.svg', profile='tiny')
    debug_svg = svgwrite.Drawing(f'wall2-.svg', profile='tiny')
    for i in range(14):
        wall = Wall(f"wall{i + 1}", outer, x_offset=i * (146 + 10))
        wall.make(prod_svg, debug_svg)
        wall.to_svg(prod_svg)
        wall.make_stl()

    prod_svg.save()
    debug_svg.save()


if __name__ == '__main__':
    main()
