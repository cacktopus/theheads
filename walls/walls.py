from bridson import poisson_disc_samples
import svgwrite
from pyhull.voronoi import VoronoiTess


def good(p):
    return 0 < p[0] < 500 and 0 < p[1] < 500



def main():
    points = poisson_disc_samples(width=500, height=500, r=10)
    print(len(points))

    s = svgwrite.Drawing('test.svg', profile='tiny')
    # dwg.add(dwg.line((0, 0), (100, 100), stroke=svgwrite.rgb(10, 10, 16, '%')))
    # dwg.add(dwg.text('Test', insert=(20, 20)))

    v = VoronoiTess(points)
    print(dir(v))
    print(v.vertices)
    print(v.ridges)
    print(v.dim)
    print(v.regions)

    # for p in points:
    #     s.add(s.circle(p, 2))

    # for p in v.vertices:
    #     if 500 > p[0] > 0 and 500 > p[1] > 0:
    #         s.add(s.circle(p, 1))
    for nn, vind in v.ridges.items():
        (i1, i2) = sorted(vind)
        if i1 == 0:
            pass
        else:
            c1 = v.vertices[i1]
            c2 = v.vertices[i2]
            # p, = plt.plot([c1[0], c2[0]], [c1[1], c2[1]], 'k-')
            if good(c1) and good(c2):
                s.add(s.line(c1, c2, stroke=svgwrite.rgb(10, 10, 16, '%')))




    s.save()


if __name__ == '__main__':
    main()
