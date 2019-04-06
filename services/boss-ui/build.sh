#!/usr/bin/env bash
PATH=$PATH:$HOME/bin
cd boss-ui
ln -s ~build/builds/node_modules/prod/boss-ui/node_modules node_modules
npm run build
