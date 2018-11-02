import { ZiGate } from '../../../src/zigate'
import { MockZiGate } from '../../mocks/zigate'
import { createZGMessage, ZGMessageCode } from '../../../src/message'
import { ZGXiaomiAqaraButtonDevice } from '../../../src/devices/xiaomi/aqara-button'
import { TestScheduler } from 'rxjs/testing'

function assertDeepEqual(actual: any, expected: any) {
  expect(actual).toEqual(expected)
}

describe('ZGXiaomiAqaraButtonDevice', () => {
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
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.messages$).toBe('---b-', { b: secondMessage })
    })
  })

  it('should emit messages when button is pushed once', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const pushMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x6, 0x0, 0x0, 0x0, 0x10, 0x0, 0x1, 0x1]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: pushMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.pushes$).toBe('-b-', { b: { count: 1 } })
    })
  })

  it('should emit messages when button is pushed twice', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const pushMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x6, 0x80, 0x0, 0x0, 0x28, 0x0, 0x1, 0x2]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: pushMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.pushes$).toBe('-b-', { b: { count: 2 } })
    })
  })

  it('should emit messages when button is pushed thrice', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const pushMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x6, 0x0, 0x0, 0x0, 0x28, 0x0, 0x1, 0x3]),
        0
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: pushMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.pushes$).toBe('-b-', { b: { count: 3 } })
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
          0x1a,
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
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

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
      const zgDevice = new ZGXiaomiAqaraButtonDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.signal$).toBe('-b-', {
        b: {
          level: 78
        }
      })
    })
  })
})
