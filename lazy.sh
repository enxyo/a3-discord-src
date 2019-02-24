#!/bin/bash
###### bot start/stop script using forever######
case "$1" in
start)
    forever start -e logs/err.out -o logs/out.out a3-discord-src.js a3-discord-src.js
;;
stop)
    forever stop a3-discord-src.js
;;
restart)
    forever stop a3-discord-src.js
    forever start -e logs/err.out -o logs/out.out a3-discord-src.js a3-discord-src.js
;;
*)
    echo "Usage: {start|stop|restart}" >&2
    exit 1
;;
esac
exit 0
