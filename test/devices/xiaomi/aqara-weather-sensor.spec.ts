import { ZiGate } from '../../../src/zigate'
import { MockZiGate } from '../../mocks/zigate'
import { createZGMessage, ZGMessageCode } from '../../../src/message'
import { TestScheduler } from 'rxjs/testing'
import { ZGXiaomiAqaraWeatherSensorDevice } from '../../../src/devices/xiaomi/aqara-weather-sensor'

function assertDeepEqual(actual: any, expected: any) {
  expect(actual).toEqual(expected)
}

describe('ZGXiaomiWeatherSensorDevice', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler(assertDeepEqual)
  })

  it('should emit current device messages', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const firstMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xff, 0xff, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])
      )
      const secondMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-b-', {
        a: firstMessage,
        b: secondMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraWeatherSensorDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.messages$).toBe('---b-', { b: secondMessage })
    })
  })

  it('should emit messages when temperature has changed', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const temperatureMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x6, 0xfe, 0xfe, 0x1, 0x4, 0x2, 0x0, 0x0, 0x0, 0x29, 0x0, 0x2, 0xb, 0x34])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: temperatureMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraWeatherSensorDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.temperature$).toBe('-b-', { b: { celsius: 28.68 } })
    })
  })

  it('should emit messages when humidity has changed', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const humidityMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x7, 0xfe, 0xfe, 0x1, 0x4, 0x5, 0x0, 0x0, 0x0, 0x21, 0x0, 0x2, 0x16, 0x8])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: humidityMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraWeatherSensorDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.humidity$).toBe('-b-', { b: { level: 56.4 } })
    })
  })

  it('should emit messages when pressure has changed', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const pressureMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x8, 0xfe, 0xfe, 0x1, 0x4, 0x3, 0x0, 0x0, 0x0, 0x29, 0x0, 0x2, 0x3, 0xf5])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: pressureMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraWeatherSensorDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.pressure$).toBe('-b-', { b: { millibar: 1013 } })
    })
  })

  it('should emit messages about battery health', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const batteryMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x3c,
          0xfe,
          0xfe,
          0x01,
          0x0,
          0x0,
          0xff,
          0x01,
          0x0,
          0x42,
          0x0,
          0x0025,
          0x1,
          0x21,
          0xf9,
          0x0b,
          0x03,
          0x28,
          0x1e,
          0x04,
          0x21,
          0xa8,
          0x43,
          0x05,
          0x21,
          0x12,
          0x0,
          0x6,
          0x24,
          0x6,
          0x0,
          0x0,
          0x0,
          0x0,
          0x0a,
          0x21,
          0x0,
          0x0
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: batteryMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraWeatherSensorDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.battery$).toBe('-b-', {
        b: {
          voltage: 3.065,
          level: 94
        }
      })
    })
  })
})
