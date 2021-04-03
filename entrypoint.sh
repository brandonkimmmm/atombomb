#!/bin/bash

echo $1
  pm2-runtime start ecosystem.config.js
