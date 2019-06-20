import math
import random
from math import cos, pi, sin
from typing import List, Tuple

import svgwrite
import triangle as tr

from gen_stl import build_wall
from line import Line2D, NoIntersection
from stl_io import write_stl
from transformations import Vec, Mat
from util import doubles


def cubic_bezier(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: float) -> Vec:
    return (
            (1 - t) ** 3 * p0
            + 3 * (1 - t) ** 2 * t * p1
            + 3 * (1 - t) * t ** 2 * p2
            + t ** 3 * p3
    )


def circle(center: Vec, radius: float, t: float) -> Vec:
    return (
            center
            + radius * cos(2 * pi * t) * Vec(1.0, 0)
            + radius * sin(2 * pi * t) * Vec(0, 1.0)
    )


def circle_points(center: Vec, radius: float, steps: int):
    result = []
    for i in range(steps):
        t = i / steps
        result.append(circle(center, radius, t))
    return result


def square_points(center, d):
    m = Mat.rotz(random.random() * 40 - 20)

    i = m * Vec(1, 0)
    j = m * Vec(0, 1)

    result = list(reversed([
        center + d * i - d * j,
        center + d * i + d * j,
        center - d * i + d * j,
        center - d * i - d * j,
    ]))

    return result


def tess(polys, holes):
    indices = {}
    vertices = []
    segments = []

    for i, poly in enumerate(polys):
        for v in poly:
            assert isinstance(v, tuple)
            if v not in indices:
                pos = len(vertices)
                indices[v] = pos
                vertices.append(v)

        for v0, v1 in doubles(poly):
            # TODO: check for duplicate segment
            index0 = indices[v0]
            index1 = indices[v1]

            segments.append((index0, index1))

    A = dict(
        vertices=vertices,
        segments=segments,
    )
    if holes:
        A['holes'] = holes

    B = tr.triangulate(A, opts="pq")

    return B, A
    # make_stl(A, B, depth, holes, polys)


def make_stl(name, polys, B, A, depth):
    # tr.compare(plt, A, B)
    # svg = DebugSVG(f"{name}-new.svg")
    # svg._prod_g.scale(3)
    # svg._debug_g.scale(3)
    verts = B['vertices']
    tris = B['triangles']
    segs = B['segments']
    # for h in A.get('holes', []):
    #     svg.debug(svg.svg.circle(h, 1, fill='magenta', stroke='magenta'))
    stl = []
    for tri in tris:
        poly = [verts[i] for i in tri]
        # svg.add(svg.svg.polygon(
        #     poly,
        #     fill_opacity=0.0,
        #     stroke_opacity=1.00,
        #     stroke='black',
        #     stroke_width=0.2,
        # ))

        p0, p1, p2 = poly

        stl.append([
            0, 0, -1,
            p0[0], p0[1], depth,
            p1[0], p1[1], depth,
            p2[0], p2[1], depth,
        ])

        stl.append([
            0, 0, 1,
            p2[0], p2[1], 0,
            p1[0], p1[1], 0,
            p0[0], p0[1], 0,
        ])

    outer, holes = polys[0], polys[1:]
    for v0, v1 in doubles(outer):
        # svg.debug(svg.svg.line(v0, v1, stroke='black', stroke_width=1.0))
        wall = build_wall(v0, v1, depth)
        stl.extend(wall)
    for hole in holes:
        for v0, v1 in doubles(hole):
            # svg.debug(svg.svg.line(v0, v1, stroke='black', stroke_width=1.0))
            wall = build_wall(v0, v1, depth)
            stl.extend(wall)
    # svg.save()
    write_stl(f"{name}.stl", stl)


def poly_line_intersection(svg: svgwrite.Drawing, poly, line: Line2D) -> Vec:
    # note: this assumes an intersection will take place
    poly = [Vec(*p) for p in poly]

    results = []
    for p0, p1 in doubles(poly):
        segment = Line2D.from_points(p0, p1)

        d = (p1 - p0).abs()
        try:
            s = segment.intersect_distance(line)
        except NoIntersection:
            continue

        if 0 <= s < d:
            t = line.intersect_distance(segment)
            if t > 0:
                # svg.add(svg.line(p0.point2, p1.point2, stroke="green", stroke_width=0.5))
                # svg.add(svg.circle(p1.point2, 0.5, fill="magenta"))

                q = segment.p + s * segment.u
                # svg.add(svg.circle(q.point2, 0.5, fill="yellow"))
                # svg.save()
                results.append((q.abs(), q))

    return min(results)[1]


def interpolate_poly_circle(svg: svgwrite.Drawing, poly, center, radius, t):
    center = Vec(*center)
    points = circle_points(center, radius, 40)

    result = []

    for p in points:
        # svg.add(svg.circle(p.point2, 0.3, fill="magenta"))
        line = Line2D.from_points(center, p)

        q = poly_line_intersection(svg, poly, line)

        w = t * q + (1 - t) * p
        result.append(w)

        svg.add(svg.circle(q.point2, 0.3, fill="blue"))
        # svg.add(svg.line(center.point2, q.point2, stroke="grey", stroke_width=0.3))

    return result


def centroid(triangle: List[Tuple]):
    assert len(triangle) >= 3
    x = sum(p[0] for p in triangle) / len(triangle)
    y = sum(p[1] for p in triangle) / len(triangle)

    return x, y


def distance(p0, p1):
    return math.sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2)


def clamp(a, x, b):
    if x < a:
        return a

    if x > b:
        return b

    return x
