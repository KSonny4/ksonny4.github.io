#!/bin/sh
#I have to save this script because
#I have unstable internet connection and wget provides me 
# a way how to download the file in contrast with browser
# that simply says that the file is corrupted
while ! wget -c $0 do sleep 1; done