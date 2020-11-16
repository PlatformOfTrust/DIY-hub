export const API_BASE_URL = "";

export interface Sensor {
  id?: number,
  name: string,
  identifier: string,
  type: string,
  createdAt?: Date,
  updatedAt?: Date
}

export class Api {

  static async listSensors(pending?: boolean): Promise<Sensor[]> {
    const res = await fetch(pending ? `${API_BASE_URL}/sensors?pending=true`: `${API_BASE_URL}/sensors`);
    const sensors: Sensor[] = await res.json();
    return sensors;
  }

  static async createSensor(sensor: Sensor): Promise<Sensor> {
    const res = await fetch(`${API_BASE_URL}/sensors`, {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(sensor)
    });
    const created: Sensor = await res.json();
    return created;
  }

  static async updateSensor(id: number, sensor: Sensor): Promise<Sensor> {
    const res = await fetch(`${API_BASE_URL}/sensors/${id}`, {
      method: "put",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(sensor)
    });
    const updated: Sensor = await res.json();
    return updated;
  }

  static async deleteSensor(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/sensors/${id}`, {
      method: "delete",
      headers: {
        "Content-type": "application/json"
      }
    });

    return;
  }

}