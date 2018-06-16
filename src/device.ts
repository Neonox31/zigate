import { ZGXiaomiAqaraButtonDevice } from './devices/xiaomi/aqara-button'
import { ZiGate } from './zigate'
import debug from './debug'
import { ZGXiaomiAqaraDoorSensorDevice } from './devices/xiaomi/aqara-door-sensor'
import { ZGXiaomiAqaraWeatherSensorDevice } from './devices/xiaomi/aqara-weather-sensor'

export interface ZGDevice {}

export enum ZGDeviceType {
  XiaomiAqaraButton,
  XiaomiAqaraDoorSensor,
  XiaomiAqaraWeatherSensor
}

export function createZGDevice(
  zigate: ZiGate,
  deviceType: ZGDeviceType,
  shortAddress: string
): ZGDevice {
  debug(`device`)(`new from type: %d`, deviceType)
  switch (deviceType) {
    case ZGDeviceType.XiaomiAqaraButton:
      return new ZGXiaomiAqaraButtonDevice(zigate, shortAddress)
    case ZGDeviceType.XiaomiAqaraDoorSensor:
      return new ZGXiaomiAqaraDoorSensorDevice(zigate, shortAddress)
    case ZGDeviceType.XiaomiAqaraWeatherSensor:
      return new ZGXiaomiAqaraWeatherSensorDevice(zigate, shortAddress)
    default:
      throw new Error(`Unsupported device type : ${deviceType}`)
  }
}
