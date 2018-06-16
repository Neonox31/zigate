import { Observable } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { ZGDevice } from '../../device'
import { ZiGate } from '../../zigate'
import { asAttributeReportMessage, ZGMessageCode } from '../../message'
import { AttributeType, ZGAttributeReportMessage } from '../../messages/attribute-report'
import debug from '../../debug'
import { asCommonBatteryPayload, BatteryType } from './utils/battery'
import {
  CommonBatteryPayload,
  CommonHumidityPayload,
  CommonPressurePayload,
  CommonTemperaturePayload
} from '../../common'

const temperatureMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x0402 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.Int16
  )
}

const humidityMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x0405 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.UInt16
  )
}

const pressureMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x0403 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.Int16
  )
}

const asCommonTemperaturePayload = (msg: ZGAttributeReportMessage): CommonTemperaturePayload => {
  const celsius = (msg.getPayload().attributeData as number) / 100

  return {
    celsius
  }
}

const asCommonHumidityPayload = (msg: ZGAttributeReportMessage): CommonHumidityPayload => {
  const level = (msg.getPayload().attributeData as number) / 100

  return {
    level
  }
}

const asCommonPressurePayload = (msg: ZGAttributeReportMessage): CommonPressurePayload => {
  const millibar = msg.getPayload().attributeData as number

  return {
    millibar
  }
}

export class ZGXiaomiAqaraWeatherSensorDevice implements ZGDevice {
  label = 'xiaomi-aqara-weather-sensor'
  shortAddress: string

  messages$: Observable<ZGAttributeReportMessage>
  temperature$: Observable<CommonTemperaturePayload>
  humidity$: Observable<CommonHumidityPayload>
  pressure$: Observable<CommonPressurePayload>
  battery$: Observable<CommonBatteryPayload>

  constructor(zigate: ZiGate, shortAddress: string) {
    this.shortAddress = shortAddress

    this.messages$ = zigate.messages$.pipe(
      filter(msg => msg.getCode() === ZGMessageCode.AttributeReport),
      map(asAttributeReportMessage),
      filter(msg => msg.getPayload().srcAddress === this.shortAddress)
    )

    this.temperature$ = this.messages$.pipe(
      filter(temperatureMessages),
      map(asCommonTemperaturePayload),
      tap((payload: CommonTemperaturePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:temperature`)(payload)
      )
    )

    this.humidity$ = this.messages$.pipe(
      filter(humidityMessages),
      map(asCommonHumidityPayload),
      tap((payload: CommonHumidityPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:humidity`)(payload)
      )
    )

    this.pressure$ = this.messages$.pipe(
      filter(pressureMessages),
      map(asCommonPressurePayload),
      tap((payload: CommonPressurePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:pressure`)(payload)
      )
    )

    this.battery$ = this.messages$.pipe(
      filter(msg => msg.getPayload().srcEndpoint === 0x1),
      filter(msg => msg.getPayload().clusterId === 0x0),
      filter(msg => msg.getPayload().attributeId === 0xff01),
      filter(msg => msg.getPayload().attributeSize === 0x0025),
      map(msg => asCommonBatteryPayload(msg, BatteryType.CR1632)),
      tap((payload: CommonBatteryPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:battery`)(payload)
      )
    )
  }
}
