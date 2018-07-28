import { createZGDevice, ZGDeviceType } from '../src/device'
import { MockZiGate } from './mocks/zigate'
import { ZGXiaomiAqaraButtonDevice } from '../src/devices/xiaomi/aqara-button'
import { ZiGate } from '../src/zigate'
import { ZGXiaomiAqaraDoorSensorDevice } from '../src/devices/xiaomi/aqara-door-sensor'
import { ZGXiaomiAqaraWeatherSensorDevice } from '../src/devices/xiaomi/aqara-weather-sensor'
import { ZGXiaomiAqaraMagicCubeDevice } from '../src/devices/xiaomi/aqara-magic-cube/aqara-magic-cube'

describe('ZGDevice', () => {
  const zigate = new MockZiGate()

  it('should create xiaomi aqara button device', () => {
    /*** GIVEN ***/
    const deviceType = ZGDeviceType.XiaomiAqaraButton

    /*** WHEN ***/
    const zgDevice = createZGDevice(zigate as ZiGate, deviceType, 'fefe')

    /*** THEN ***/
    expect(zgDevice).toBeInstanceOf(ZGXiaomiAqaraButtonDevice)
  })

  it('should create xiaomi aqara door sensor device', () => {
    /*** GIVEN ***/
    const deviceType = ZGDeviceType.XiaomiAqaraDoorSensor

    /*** WHEN ***/
    const zgDevice = createZGDevice(zigate as ZiGate, deviceType, 'fefe')

    /*** THEN ***/
    expect(zgDevice).toBeInstanceOf(ZGXiaomiAqaraDoorSensorDevice)
  })

  it('should create xiaomi aqara weather sensor device', () => {
    /*** GIVEN ***/
    const deviceType = ZGDeviceType.XiaomiAqaraWeatherSensor

    /*** WHEN ***/
    const zgDevice = createZGDevice(zigate as ZiGate, deviceType, 'fefe')

    /*** THEN ***/
    expect(zgDevice).toBeInstanceOf(ZGXiaomiAqaraWeatherSensorDevice)
  })

  it('should create xiaomi aqara magic cube device', () => {
    /*** GIVEN ***/
    const deviceType = ZGDeviceType.XiaomiAqaraMagicCube

    /*** WHEN ***/
    const zgDevice = createZGDevice(zigate as ZiGate, deviceType, 'fefe')

    /*** THEN ***/
    expect(zgDevice).toBeInstanceOf(ZGXiaomiAqaraMagicCubeDevice)
  })

  it('should fail when specified device type is unknown', () => {
    /*** GIVEN ***/
    const deviceType = -1

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => createZGDevice(zigate as ZiGate, deviceType, 'fefe')).toThrowError(
      `Unsupported device type : ${deviceType}`
    )
  })
})
