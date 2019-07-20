#!/usr/bin/env bash
cd boss
GO=~build/builds/go/prod/bin/go
${GO} build
ln -s ~build/builds/boss-ui/prod/boss-ui/build boss-ui