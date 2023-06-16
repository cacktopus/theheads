FROM golang:1.17-buster as build

RUN DEBIAN_FRONTEND=noninteractive apt-get update -y

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y --autoremove=no \
    alien \
    build-essential \
    cmake \
    git \
    libgtk2.0-dev \
    pkg-config \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    unzip

WORKDIR /build

RUN wget https://github.com/opencv/opencv/archive/4.5.5.zip
RUN echo 'fb16b734db3a28e5119d513bd7c61ef417edf3756165dc6259519bb9d23d04e2  4.5.5.zip' | shasum -c
RUN unzip 4.5.5.zip

RUN mkdir /build/opencv-4.5.5/build
WORKDIR /build/opencv-4.5.5/build

RUN cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D OPENCV_GENERATE_PKGCONFIG=ON \
    -D WITH_JASPER=OFF \
    -D BUILD_DOCS=OFF \
    -D BUILD_EXAMPLES=OFF \
    -D BUILD_TESTS=OFF \
    -D BUILD_PERF_TESTS=OFF \
    -D BUILD_opencv_java=NO \
    -D BUILD_opencv_python=NO \
    -D BUILD_opencv_python2=NO \
    -D BUILD_opencv_python3=NO \
    ..

RUN make -j2 # don't go too crazy here, it tends to crash

# Are we really doing this??!
RUN rm -rf /usr/local/*

RUN make install
RUN tar -cf opencv-4.5.5.tar /usr/local

RUN alien --target `dpkg-architecture -q DEB_BUILD_ARCH` --to-deb opencv-4.5.5.tar

RUN mkdir -p /packages
RUN cp *.deb /packages