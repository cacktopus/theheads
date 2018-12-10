import math

from math import sin, cos, pi
import numpy as np


class Vec:
    def __init__(self, x, y, z=0.0, w=1.0):
        self._data = np.array([x, y, z, w])

    def __str__(self):
        return str(self._data)

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
        return float(np.linalg.norm(self._data))

    def scale(self, x: float):
        res = x * self._data
        return Vec(res[0], res[1], res[2], 1)

    def __sub__(self, other):
        res = np.subtract(self._data, other._data)
        return Vec(*res)  # TODO: able to instantiate directly

    def __add__(self, other):
        res = np.add(self._data, other._data)
        return Vec(*res)  # TODO: able to instantiate directly


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


def main():
    m = Mat.identity()

    v = Mat.rotz(90) * Mat.rotz(90) * Mat.rotz(90) * Mat.rotz(90) * Vec(1, 0)

    print(v)


if __name__ == '__main__':
    main()
