import matplotlib.pyplot as plt
import numpy as np

import triangle as tr


def main():
    A = dict(
        vertices=np.array((
            (0, 0),
            (1, 0),
            (1, 1),
            (0.5, 0.5),
            (0, 1),
        )),
        segments=[
            (0, 1),
            (1, 2),
            (2, 3),
            (3, 4),
            (4, 0),
        ]
    )
    B = tr.triangulate(A, opts="pa0.03")

    print(B)

    print(len(B['vertices']))
    print(len(B['vertex_markers']))
    print(len(B['triangles']))

    tr.compare(plt, A, B)
    plt.savefig('tri.png')


if __name__ == '__main__':
    main()
