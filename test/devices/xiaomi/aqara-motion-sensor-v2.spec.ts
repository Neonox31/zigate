import { ZiGate } from '../../../src/zigate'
import { MockZiGate } from '../../mocks/zigate'
import { createZGMessage, ZGMessageCode } from '../../../src/message'
import { TestScheduler } from 'rxjs/testing'
import { ZGXiaomiAqaraMotionSensorV2Device } from '../../../src/devices/xiaomi/aqara-motion-sensor-v2'
import { ZGXiaomiAqaraDoorSensorDevice } from '../../../src/devices/xiaomi/aqara-door-sensor'

function assertDeepEqual(actual: any, expected: any) {
  expect(actual).toEqual(expected)
}

describe('ZGXiaomiMotionSensorV2Device', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler(assertDeepEqual)
  })

  it('should emit current device messages', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const firstMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xff, 0xff, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
        0
      )
      const secondMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-b-', {
        a: firstMessage,
        b: secondMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMotionSensorV2Device(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.messages$).toBe('---b-', { b: secondMessage })
    })
  })

  it('should emit messages when motion is detected', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const temperatureMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x7d, 0xfe, 0xfe, 0x1, 0x4, 0x6, 0x0, 0x0, 0x0, 0x18, 0x0, 0x1, 0x1]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: temperatureMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMotionSensorV2Device(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.motion$).toBe('-b-', { b: { state: true } })
    })
  })

  it('should emit brightness messages when motion is detected', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const temperatureMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x8c, 0xfe, 0xfe, 0x1, 0x4, 0x0, 0x0, 0x0, 0x0, 0x21, 0x0, 0x2, 0x0, 0x26]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: temperatureMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMotionSensorV2Device(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.brightness$).toBe('-b-', { b: { level: 38 } })
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
          0x21,
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
        ]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: batteryMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMotionSensorV2Device(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.battery$).toBe('-b-', {
        b: {
          voltage: 3.065,
          level: 94
        }
      })
    })
  })

  it('should emit messages about signal strength', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const signalMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]),
        200
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: signalMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMotionSensorV2Device(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.signal$).toBe('-b-', {
        b: {
          level: 78
        }
      })
    })
  })
})
