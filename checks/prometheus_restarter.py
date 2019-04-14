#!/usr/bin/env python3
import os
import shutil
import subprocess
import glob

MIN_FREE_SPACE_RATIO = 0.05
PROMETHEUS_DATA_DIR = "/mnt/prometheus-data/prometheus-data"


def main():
    free = shutil.disk_usage(PROMETHEUS_DATA_DIR)
    ratio = free.free / free.total

    if ratio < MIN_FREE_SPACE_RATIO:
        subprocess.check_call(
            ["/usr/bin/env", "sudo", "systemctl", "stop", "prometheus"]
        )

        for path in glob.glob(os.path.join(PROMETHEUS_DATA_DIR, "*")):
            shutil.rmtree(path)

        subprocess.check_call(
            ["/usr/bin/env", "sudo", "systemctl", "start", "prometheus"]
        )


if __name__ == '__main__':
    main()
