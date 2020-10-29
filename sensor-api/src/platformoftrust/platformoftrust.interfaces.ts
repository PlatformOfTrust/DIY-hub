export interface TranslatorParameters {
  "@context": "https://standards.oftrust.net/v2/Context/DataProductParameters/Sensor/",
  productCode: string,
  timestamp: string,
  parameters: TranslatorParametersObject
}

interface TranslatorParametersObject {
  ids?: string[],
  startTime?: string,
  endTime?: string,
  dataTypes?: string[]
}

export interface TranslatorResponse {
  "@context": "https://standards.oftrust.net/v2/Context/DataProductOutput/Sensor/",
  data: {
    sensors: TranslatorResponseSensor[]
  },
  signature: {
    type: "RsaSignature2018",
    created: string,
    creator: string,
    signatureValue: string
  }
}

export interface TranslatorResponseSensor {
  id: string,
  measurements: TranslatorResponseMeasurement[]
}

export interface TranslatorResponseMeasurement {
  "@type": "MeasureAirTemperatureCelsiusDegree" | "MeasureAirCO2LevelPPM" | "MeasurePresence",
  value: number | boolean,
  timestamp: string
}