import math
import numbers

from math import sin, cos, pi
import numpy as np


class Vec:
    def __init__(self, x, y, z=0.0, w=1.0):
        self._data = np.array([x, y, z, w])

    def __str__(self):
        return str("<{:.4f} {:.4f}>".format(self.x, self.y))

    @property
    def x(self):
        return float(self._data[0])

    @property
    def y(self):
        return float(self._data[1])

    @property
    def z(self):
        return float(self._data[2])

    @property
    def w(self):
        return float(self._data[3])

    def abs(self):
        a = self
        return math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)

    def scale(self, c: float):
        a = self
        return Vec(a.x * c, a.y * c, a.z * c, 1.0)

    def __sub__(self, other):
        a, b = self, other
        return Vec(a.x - b.x, a.y - b.y, a.z - b.z)

    def __add__(self, other):
        a, b = self, other
        return Vec(a.x + b.x, a.y + b.y, a.z + b.z)

    def __rmul__(self, other):
        if isinstance(other, numbers.Number):
            return self.scale(float(other))

    def unit(self):
        return self.scale(1.0 / self.abs())

    def dot(self, other: "Vec") -> float:
        a, b = self, other
        return a.x * b.x + a.y * b.y + a.z * b.z

    def cross(self, other: "Vec") -> "Vec":
        a, b = self, other

        return Vec(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x,
            1.0,
        )

    @property
    def point2(self):
        return (self.x, self.y)

    @property
    def point3(self):
        return (self.x, self.y, self.z)


class Mat:
    def __init__(self, data):
        self._data = data

    @classmethod
    def identity(cls):
        return Mat(np.identity(4))

    @classmethod
    def translate(cls, x, y, z=0):
        return Mat(np.array([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1],
        ]))

    @classmethod
    def rotz(cls, thetaDegrees):
        t = thetaDegrees * pi / 180
        return Mat(np.array([
            [cos(t), -sin(t), 0, 0],
            [sin(t), cos(t), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]))

    def __mul__(self, other):
        a = self._data
        b = other._data

        if isinstance(other, Mat):
            return Mat(np.matmul(a, b))

        else:
            c = np.dot(a, b)
            return Vec(c[0], c[1], c[2], c[3])

    def __str__(self):
        return str(self._data)

    def inv(self):
        return Mat(np.linalg.inv(self._data))


def main():
    m = Mat.identity()

    v = Mat.rotz(90) * Mat.rotz(90) * Mat.rotz(90) * Mat.rotz(90) * Vec(1, 0)

    print(v)


if __name__ == '__main__':
    main()
