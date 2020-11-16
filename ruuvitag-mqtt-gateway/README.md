# RuuviTag MQTT Gateway

## Description

Component for relaying messages from RuuviTags to mqtt broker.

## Configuration

This components supports following environment variables. Variables can be configured also by creating .env file to the root of the project.

**MQTT_TOPIC_PREFIX**
Prefix for all the mqtt topics system subscripes.
Should be the same as with DiyHub API

**MQTT_URL**
Url of the MQTT broker.

**MQTT_USERNAME (Optional)**
Username for connecting to MQTT broker.

**MQTT_PASSWORD (Optinal)**
Password for connecting to MQTT broker.


## Installation

**install prerequisites**

NodeJS
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
