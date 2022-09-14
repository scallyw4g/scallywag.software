#!/bin/bash

aws s3 sync --acl "public-read" --delete -- ./docs s3://scallywag.software

