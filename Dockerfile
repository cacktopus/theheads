FROM python:3.7-buster AS build-env
WORKDIR /app

COPY requirements.txt .
RUN pip install -r ./requirements.txt

COPY *.py ./

RUN pip install pyinstaller
RUN pyinstaller head.py

ARG VERSION

RUN mkdir -p /packages
RUN arch=`dpkg-architecture -q DEB_BUILD_ARCH`; \
    tar -cjvf /packages/head_${VERSION}_${arch}.tar.bz2 -C /app/dist head

RUN arch=`dpkg-architecture -q DEB_BUILD_ARCH`; \
    curl -XPUT \
    http://raftsync.service.consul:9000/theheads/build/head_${VERSION}_${arch}.tar.bz2 \
    --data-binary @/packages/head_${VERSION}_${arch}.tar.bz2
