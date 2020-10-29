import { Injectable } from "@nestjs/common";
import { WriteApi, WritePrecision, InfluxDB, QueryApi, Point, FluxTableMetaData } from "@influxdata/influxdb-client";

@Injectable()
export class InfluxService {

  async insertDataPoints(points: Point[]) {
    const writeApi = this.getWriteApi();
    writeApi.writePoints(points);
    await writeApi.close()
  }

  queryDataPoints(query: string): Promise<any[]> {
      return new Promise((resolve, reject) => {
        const result = [];
        this.getQueryApi().queryRows(query, {
          next(row: string[], tableMeta: FluxTableMetaData) {
            result.push(tableMeta.toObject(row));
          },
          error(error: Error) {
            reject(error);
          },
          complete() {
            resolve(result);
          }
        });
      });
  }

  private getQueryApi(): QueryApi {
    return new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN}).getQueryApi(process.env.INFLUX_ORGANIZATION);
  }

  private getWriteApi(): WriteApi {
    console.log(process.env.INFLUX_URL);
    return new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN}).getWriteApi(process.env.INFLUX_ORGANIZATION, process.env.INFLUX_BUCKET, WritePrecision.ns);
  }
}