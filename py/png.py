import struct
import zlib


def _png_pack(png_tag, data):
    chunk_head = png_tag + data
    return (struct.pack("!I", len(data)) +
            chunk_head +
            struct.pack("!I", 0xFFFFFFFF & zlib.crc32(chunk_head)))


def write_png(buf, width, height):
    """This function writes compressed, true-color (4 bytes per pixel) RGBA PNG's."""
    # reverse the vertical line order and add null bytes at the start
    width_byte_4 = width * 4
    raw_data = b''.join(
        b'\x00' + buf[span:span + width_byte_4]
        for span in range((height - 1) * width_byte_4, -1, - width_byte_4)
    )

    return b''.join([
        b'\x89PNG\r\n\x1a\n',
        _png_pack(b'IHDR', struct.pack("!2I5B", width, height, 8, 6, 0, 0, 0)),
        _png_pack(b'IDAT', zlib.compress(raw_data, 0)),
        _png_pack(b'IEND', b'')])
