# DIY Hub

## Description

DIY Hub is application developed for collecting data from different (diy) sensors and storing it to InfluxDB. It also provides translator which makes data compatible with Platform of Trust system.

## Environment variables

System supports following environment variables, they may be set either manually or creating .env file to the project root.

INFLUX_ORGANIZATION
Organization name from InfluxDB.

INFLUX_BUCKET
Bucket name from InfluxDB to store the data.

INFLUX_URL
Host and port of InfluxDB.

INFLUX_TOKEN
Token from InfluxDB.

MQTT_TOPIC_PREFIX
Prefix for all the mqtt topics system subscripes.

MQTT_URL
Url of the MQTT broker.

MQTT_USERNAME (Optional)
Username for connecting to MQTT broker.

MQTT_PASSWORD (Optinal)
Password for connecting to MQTT broker.

LOG_SQL_STATEMENTS (Optional)
Set this to true if you wish to log sql queries to console.

PRIVATE_KEY (Optional)
Private key to use, if not provided one will be generated during app startup.

PUBLIC_KEY (Optional)
Public key to use, if not provided one will be generated during app startup.

POT_PUBLIC_KEY (Optional)
Platform of Trust public key to use, if not provided one will be downloaded from platform of trust.

POT_ENVIRONMENT (Optional)
Platform of trust environment, defaults to sandbox.

## Installation

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