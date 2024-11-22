#!/bin/bash
#
# sudo apt install gunicorn
#
/usr/bin/gunicorn app:app -b 0.0.0.0:5000 --timeout 300
