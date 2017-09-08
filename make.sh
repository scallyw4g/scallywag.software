#!/bin/bash

aws s3 sync --acl "public-read" --delete -- ./src s3://bare.software

