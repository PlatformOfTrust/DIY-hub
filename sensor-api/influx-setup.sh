#!/bin/sh

docker run -d -v $PWD/influx:/root/.influxdbv2/ --name influxdb-setup -p 8086:8086 quay.io/influxdb/influxdb:v2.0.1
sleep 10
docker exec -it influxdb-setup influx setup --org $1 --bucket $2 --username $3 --password $4 --token $5 -f
docker stop influxdb-setup
docker rm influxdb-setup