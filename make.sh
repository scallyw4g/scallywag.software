#!/bin/bash

# aws s3 sync --acl "public-read" --delete -- ./docs s3://scallywag.software

cp docs/index.html docs/404.html && git add . && git commit -av
