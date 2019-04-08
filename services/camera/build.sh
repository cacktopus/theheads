#!/usr/bin/env bash
cd camera
GO=~build/builds/go/prod/bin/go
export PKG_CONFIG_PATH=/home/build/builds/opencv/prod/lib/pkgconfig
${GO} build