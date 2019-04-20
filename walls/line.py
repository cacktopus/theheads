import numpy

from numpy.linalg import inv

from transformations import Vec, Mat
import numpy as np


class NoIntersection(Exception):
    pass


class Line2D:
    def __init__(self, p0: Vec, u: Vec):
        self.p = p0
        self.u = u

    @classmethod
    def from_points(cls, p0: Vec, p1: Vec):
        """In the direction from p0 to p1"""
        u = (p1 - p0).unit()
        return Line2D(p0, u)

    def intersect(self, l1: "Line2D") -> Vec:
        s = self._intersect(l1)
        return self.p + self.u.scale(s)

    def _intersect(self, l1: "Line2D") -> float:
        l0 = self

        ux, uy = l0.u.x, l0.u.y
        vx, vy = l1.u.x, l1.u.y

        px, py = l0.p.x, l0.p.y
        qx, qy = l1.p.x, l1.p.y

        try:
            m_inv = inv(np.array([
                [ux, -vx],
                [uy, -vy],
            ]))
        except numpy.linalg.linalg.LinAlgError:
            raise NoIntersection

        rhs = np.array([
            [qx - px],
            [qy - py]
        ]),

        result = np.matmul(m_inv, rhs)

        s = result[0][0][0]
        return s

    def intersect_distance(self, l1: "Line2D") -> float:
        return self._intersect(l1)

    def distance_sq(self, point: Vec):
        p = point
        u = self.u
        to = self.p - p

        return to.x * u.y - to.y * u.x
        # a1 * b2 - a2 * b1

    # def distance(self, point: Vec):
    #     p = point
    #     a = self.p
    #     n = self.u
    #
    #     to = a - p
    #
    #     return (to - n.scale(to.dot(n))).abs()

    def offset(self, dist: float):
        v = Mat.rotz(90) * self.u
        return Line2D(self.p + v.scale(dist), self.u)
