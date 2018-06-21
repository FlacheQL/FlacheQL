#!/bin/sh
cd /home/ubuntu/FlacheQL/demo
echo Installing packages...
npm install
echo Starting server...
nodejs server.js
exit 0