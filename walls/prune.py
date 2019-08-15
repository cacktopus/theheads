import glob
import os
import shutil

prod = set(glob.glob("*/prod"))

for p in prod:
    print(p)
    print(os.readlink(p))

keep = set(os.path.basename(os.readlink(p)) for p in prod)
print(keep)

print('=' * 80)

for f in glob.glob('*/*'):
    name = os.path.basename(f)

    if name == 'prod':
        continue

    if name in keep:
        print(f)
        continue

    shutil.rmtree(f)
