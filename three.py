import numpy as np
from numpy import float32
from numpy.ma import masked_less, filled


def main():
    a = np.array([[3, 0, 0],
                  [1, 4, 1],
                  [5, 6, 0]], dtype=float32)

    # print(a.dtype)
    # # print(np.nonzero(a))
    #
    # print(filled(masked_less(a, 2.0), 0.0))
    mask = np.greater(a, 1.0)
    print(mask)
    print(a * mask)


if __name__ == '__main__':
    main()
