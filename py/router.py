from http.server import HTTPServer, BaseHTTPRequestHandler

testdata = """
Inter-|   Receive                                                |  Transmit
 face |bytes    packets errs drop fifo frame compressed multicast|bytes    packets errs drop fifo colls carrier compressed
spu_us_dummy:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  sit0:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  imq1:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
    lo: 495162784 2375323    0    0    0     0          0         0 495162784 2375323    0    0    0     0       0          0
  eth3: 693249176 5326470    0    0    0     0          0    935547 63037159 8024771    0    0    0     0       0          0
   br0: 29038192817 49183306    0 382949    0     0          0   1748013 107961112327 90105728    0    0    0     0       0          0
 bcmsw: 945239726 8552367    0    0    0     0          0         0 4058420712 16792970    0    0    0     0       0          0
  ifb1:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  imq0:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  eth6: 78013946879 133520542    0    2    0     0          0    257021 165054463555 136644356    0 8448    0     0       0          0
  eth2: 1972108051 5600781    0    9    0     0          0    130632 2988631256 66583352    0    0    0     0       0          0
ip6tnl0:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  ifb0:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  eth5: 77294824722 65289718    0    2    0     0          0    424875 33127728547 54778489    0 5748    0     0       0          0
  eth1: 79072973  960306    0    0    0     0          0         0 1359836693 5631526    0    0    0     0       0          0
 dpsta:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  imq2:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
spu_ds_dummy:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  eth4:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
  eth0: 107249359944 88625692    0    0    0     0          0    193767 28976165202 45039508    0    0    0     0       0          0
""".lstrip()


def parse():
    # f = io.StringIO(testdata)
    with open("/proc/net/dev", "r") as f:
        lines = f.readlines()[2:]
        lines.sort()

        result = []

        for line in lines:
            parts = line.strip().split()

            name = parts[0].rstrip(":")
            rx = int(parts[1])
            tx = int(parts[9])

            if name.startswith("eth") or name in ("br0", "bcmsw"):
                result.append('node_network_receive_bytes_total{device="%s"} %d' % (name, rx))
                result.append('node_network_transmit_bytes_total{device="%s"} %d' % (name, tx))

        return result


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        lines = parse()
        self.send_response(200)
        self.end_headers()
        body = "\n".join(lines) + "\n"
        self.wfile.write(body.encode())


def main():
    httpd = HTTPServer(('0.0.0.0', 9100), Handler)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
