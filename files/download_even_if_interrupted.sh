#!/bin/sh
#I have created this script because
#I have unstable internet connection and wget provides me
# a way how to download the file in contrast with browser
# that simply says that the file is corrupted
while ! wget -c $1; do sleep 1; done
