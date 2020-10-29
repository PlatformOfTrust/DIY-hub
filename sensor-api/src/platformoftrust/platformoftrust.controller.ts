import { Controller, Get, Post, HttpCode, Header, Body, UseGuards } from '@nestjs/common';
import { fluxDateTime } from '@influxdata/influxdb-client';
import { RsaService } from 'src/platformoftrust/rsa.service';
import * as moment from 'moment';
import { TranslatorResponse, TranslatorParameters, TranslatorResponseMeasurement, TranslatorResponseSensor } from './platformoftrust.interfaces';
import { InfluxService } from 'src/influx/influx.service';
import { SignatureGuard } from './signature.guard';

@Controller('platformoftrust')
export class PlatformOfTrustController {

  constructor(private influxService: InfluxService, private rsaService: RsaService) {}

  @UseGuards(SignatureGuard)
  @HttpCode(200)
  @Post("translator")
  async translate(@Body() body: TranslatorParameters) {
    //TODO: Validate product code?
    const parameters = body ? body.parameters : {};
    const signed = moment().format();
    const start = parameters.startTime ? this.parseFluxDateTime(parameters.startTime) : '0';
    const end = this.parseFluxDateTime(parameters.endTime);
    const measurement = 'temperature'; //TODO: currently only temperature measurements are supported
    const sensorIds = parameters.ids ? parameters.ids.map(sensorId => `r["sensorId"] == "${sensorId}"`) : [];
    const query = `from(bucket:"${process.env.INFLUX_BUCKET}")
      |> range(start: ${start}, stop: ${end} )
      |> filter(fn: (r) => r._measurement == "${measurement}")
      ${sensorIds.length > 0 ? `|> filter(fn: (r) => ${sensorIds.join(" or ")}` : ''}
      |> filter(fn: (r) => r["_field"] == "value")`;

    const result = {
      sensors: await this.performQuery(query)
    };
    const signatureValue = await this.rsaService.generateSignature({
      __signed__: signed,
      ...result
    });

    const response: TranslatorResponse = {
      "@context": "https://standards.oftrust.net/v2/Context/DataProductOutput/Sensor/",
      data: result,
      signature: {
        type: "RsaSignature2018",
        created: signed,
        creator: "https://e8e218e7faf6.ngrok.io/platformoftrust/public.key",
        signatureValue: signatureValue
      }
    };

    return response;
  }

  @Get("public.key")
  @Header('Content-type', 'application/octet-stream')
  @Header('Content-disposition', 'attachment; filename=public.key')
  async publicKey() {
    return this.rsaService.getPublicKey();
  }

  @Get("health")
  async healthCheck() {
    return {};
  }

  private parseFluxDateTime(time?: string) {
    const parsedTime = time ? moment(time) : moment();
    return fluxDateTime(parsedTime.toISOString());
  }

  private async performQuery(query: string): Promise<TranslatorResponseSensor[]> {
    const rows = await this.influxService.queryDataPoints(query);
    const data = {};
    rows.forEach((row) => {
      if (!data[row.sensorId]) {
        data[row.sensorId] = [];
      }
      const measurement: TranslatorResponseMeasurement = {
        "@type": "MeasureAirTemperatureCelsiusDegree",
        value: row._value,
        timestamp: row._time
      };
      data[row.sensorId].push(measurement);
    });

    const ids = Object.keys(data);
    const result: TranslatorResponseSensor[] = ids.map((id) => {
      return {
        id: id,
        measurements: data[id]
      };
    });
    return result;
  }
}