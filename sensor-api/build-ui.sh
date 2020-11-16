#!/bin/sh

rm -rf ./ui
mkdir ui
cd ../sensor-ui
npm run build
cp -r build/* ../sensor-api/ui/