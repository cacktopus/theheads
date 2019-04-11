#!/usr/bin/env bash
export LD_LIBRARY_PATH=/home/build/builds/openssl/prod/lib
python3 -m virtualenv -p /home/build/builds/python37/prod/bin/python3 env
env/bin/pip3 install -r requirements.txt