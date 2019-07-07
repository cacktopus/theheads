#!/usr/bin/env bash
ln -s ~build/builds/python-env/prod/env env
# curl -O https://cdnjs.cloudflare.com/ajax/libs/svg.js/2.7.1/svg.js

ln -s ~build/builds/boss-ui/prod/boss-ui/build boss-ui

gcc -O3 -shared trace.c -o trace.so
