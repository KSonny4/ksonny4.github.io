#!/bin/sh
while ! wget -c $1; do sleep 1; done