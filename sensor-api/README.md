
# DIY Hub

## Description

DIY Hub is application developed for collecting data from different (diy) sensors and storing it to InfluxDB. It also provides translator which makes data compatible with Platform of Trust system.

## Environment variables

System supports following environment variables, they may be set either manually or creating .env file to the project root.

**INFLUX_ORGANIZATION**
Organization name from InfluxDB.

**INFLUX_BUCKET**
Bucket name from InfluxDB to store the data.

**INFLUX_URL**
Host and port of InfluxDB.

**INFLUX_TOKEN**
Token from InfluxDB.

**MQTT_TOPIC_PREFIX**
Prefix for all the mqtt topics system subscripes.

**MQTT_URL**
Url of the MQTT broker.

**MQTT_USERNAME (Optional)**
Username for connecting to MQTT broker.

**MQTT_PASSWORD (Optinal)**
Password for connecting to MQTT broker.

**PORT (Optional)**
Port that the API will listen to, defaults to 3001

**DB_FILE (Optional)**
Path and filename to use for sqlite database, defaults to sensor-api.sqlite3

**LOG_SQL_STATEMENTS (Optional)**
Set this to true if you wish to log sql queries to console.

**PRIVATE_KEY (Optional)**
Private key to use, if not provided one will be generated during app startup.

**PUBLIC_KEY (Optional)**
Public key to use, if not provided one will be generated during app startup.

**POT_PUBLIC_KEY (Optional)**
Platform of Trust public key to use, if not provided one will be downloaded from platform of trust.

**POT_ENVIRONMENT (Optional)**
Platform of trust environment, defaults to sandbox.

envronment variables can be set also by creating .env file to root of the project.

## Installation

**install prerequisites**

If not using docker:

Mosquitto or other MQTT broker
[https://mosquitto.org/download/](https://mosquitto.org/download/)

InfluxDB (version 2 is recommended)
[https://portal.influxdata.com/downloads/](https://portal.influxdata.com/downloads/)

NodeJS
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

If using docker, only docker and docker compose are required.

**Build UI**

If you wish to host Sensor UI with this installation, it first needs to be built.
this happens by running the build-ui.sh script

```bash
$ sh build-ui.sh
```

**Configure InfluxDB**

Depending whether you plan running system with docker or not there is 2 options. If you want to run without docker, start InfluxDB, create organization, bucket and access token. Then provide those to Diy Hub using environment variables.

If you want to use docker, you can use script influx-setup.sh
```bash
$ sh influx-setup.sh ORGANIZATION BUCKET USERNAME PASSWORD TOKEN
```
For example you can configure Influx with default values specified in docker compose file with command. **(please note that using default values is insecure!)**
```bash
$ sh influx-setup.sh diyhub sensors root qwerty12345 initial
```

**Install Diy HUB**

if not using docker:

Install dependencies
```bash
$ npm install
```


## Running the app

**If not using docker:**
Make sure that you have MQTT broker and InfluxDB running and configured. Also make sure that required environment variables have been configured.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
**If using docker**
Make sure you have configured the influxDB with influx-setup script.
If you are not using default Influx settings, make sure that you have updated your docker-compose.yml accordingly.

Start Diy Hub and required service with command:
```bash
$ docker-compose up
```
Wait for all the containers to start and you should have:

 - InfluxDB running on localhost at port 8086
 - Mosquitto MQTT broker running on port 1883
 - DiyHub API (and UI if it was built) running on port 3001

## Connecting sensors
You can connect sensors to the DiyHub API either by using RuuviTags and RuuviTag MQTT Gateway or creating your own sensor for example by using ESP32. 

If you are using RuuviTags, refer documentation on [RuuviTag MQTT Gateway](https://github.com/PlatformOfTrust/DIY-hub/tree/master/ruuvitag-mqtt-gateway)

If you decide to implement your own sensors, you should implement following feaures:

 - Cabability to connect to MQTT broker
 - Publish messages on MQTT broker with topic
   MQTT_TOPIC_PREFIX/readings/:hardwareId
 - Messages should be JSON in format:

       { "unit": "temperature", value: 20.5 }


After you have either RuuviTags or Diy sensors available, you can add them to your system either by using DiyHub UI or some rest client. RuuviTags will automatically appear to UI as pending sensors if they are near enough to the gateway. Diy sensor currently don't have automatic discovery function and therefore they have to be added manually.

## Endpoints

#### GET /sensors
Lists all sensors connected to the system.
Supports query parameter pending with values true / false, if true list contains only pending RuuviTag sensors which have not yet been added to the system

#### POST /sensors
Adds new sensor to the system, request body must contain the sensor in JSON format

    {
      "name": "Sensors name",
      "identifier": "Sensors hardware identifier",
      "type": "RUUVITAG" //Either RUUVITAG or MQTT
    }

#### GET /sensors/:id
Gets sensor by id

#### PUT /sensors/:id
Updates sensor, request body must contain the sensor in JSON format

    {
      "id": 1,
      "name": "Sensors name",
      "identifier": "Sensors hardware identifier",
      "type": "RUUVITAG" //Either RUUVITAG or MQTT
    }

#### DELETE /sensors/:id
Removes sensor from system

#### POST /platformoftrust/translator
Handles the post request from Platform of Trust

#### GET /platformoftrust/public.key
Returns the public key from keypair that system uses to sign the response from translator endpoint
