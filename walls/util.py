def rotate(items):
    return items[1:] + [items[0]]


def triples(items):
    for _ in items:
        yield items[:3]
        items = rotate(items)


def doubles(items):
    for _ in items:
        yield items[:2]
        items = rotate(items)