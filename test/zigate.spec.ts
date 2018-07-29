import { ZGCommandCode, ZGDeviceType, ZiGate } from '../src/zigate'
import SerialPort from 'serialport/test'
import { TestScheduler } from 'rxjs/testing'
import { createZGMessage, ZGMessageCode } from '../src/message'
import { ZGDevice } from '../src/device'
import { ZGXiaomiAqaraButtonDevice } from '../src/devices/xiaomi/aqara-button'

function assertDeepEqual(actual: any, expected: any) {
  expect(actual).toEqual(expected)
}

const MockBinding = SerialPort.Binding

describe('ZiGate', () => {
  beforeEach(() => {
    MockBinding.createPort('/dev/ttyUSB0', { echo: false, record: true })
  })

  it('should create', () => {
    /*** WHEN ***/
    const zigate = new ZiGate('/dev/ttyUSB0')

    /*** THEN ***/
    expect(zigate).toBeInstanceOf(ZiGate)
  })

  it.skip('should receive frame from serial port', () => {
    let scheduler: TestScheduler = new TestScheduler(assertDeepEqual)

    /*** GIVEN ***/
    const zigate = new ZiGate('/dev/ttyUSB0')

    /*** WHEN ***/

    /*** THEN ***/
    const message = createZGMessage(
      ZGMessageCode.Status,
      Buffer.from([0x0, 0xff, 0xff, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])
    )

    scheduler.run(helpers => {
      helpers.expectObservable(zigate.messages$).toBe('---b-', { b: message })
    })
  })

  it('should send a command', () => {
    /*** GIVEN ***/
    const zigate = new ZiGate('/dev/ttyUSB0')
    spyOn(zigate.serialPort, 'write')

    /*** WHEN ***/
    zigate.sendCommand(ZGCommandCode.PermitJoin, { interval: 30 })

    /*** THEN ***/
    expect(zigate.serialPort.write).toHaveBeenCalledWith(
      Buffer.from([0x1, 0x0, 0x49, 0x0, 0x4, 0x50, 0xff, 0xfc, 0x1e, 0x0, 0x3])
    )
  })

  it('should create a device', () => {
    /*** GIVEN ***/
    const zigate = new ZiGate('/dev/ttyUSB0')

    /*** WHEN ***/
    const device = zigate.createDevice(ZGDeviceType.XiaomiAqaraButton, 'fffe')

    /*** THEN ***/
    expect(device).toBeInstanceOf(ZGXiaomiAqaraButtonDevice)
  })
})
