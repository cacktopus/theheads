from math import cos, pi, sin

from transformations import Vec


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