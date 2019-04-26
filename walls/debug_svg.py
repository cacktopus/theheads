import os

import svgwrite


class DebugSVG:
    def __init__(self, filename):
        base, ext = os.path.splitext(filename)
        self._prod = svgwrite.Drawing(base + ext, profile='tiny')
        self._debug = svgwrite.Drawing(base + "-debug" + ext, profile='tiny')
        self._prod_g = svgwrite.container.Group()
        self._debug_g = svgwrite.container.Group()
        # self._prod_g.scale(1.7)
        # self._prod_g.translate(-250, -200 + 12.5 + 12.5 / 2)
        self._prod.add(self._prod_g)
        self._debug.add(self._debug_g)

    def save(self):
        self._prod.save()
        self._debug.save()

    def add(self, *args):
        self._prod_g.add(*args)
        self._debug_g.add(*args)

    @property
    def svg(self):
        return self._prod

    def prod(self, *args):
        self._prod_g.add(*args)

    def debug(self, *args):
        self._debug_g.add(*args)
