import { createZGMessage, ZGMessageCode } from '../../../../src/message'
import {
  asCommonBatteryPayload,
  BatteryType,
  getBatteryBounds
} from '../../../../src/devices/xiaomi/utils/battery'
import { ZGAttributeReportMessage } from '../../../../src/messages/attribute-report'

describe('Xiaomi battery helper', () => {
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
    ])
  )

  it('should transform battery information to common battery payload', () => {
    /*** GIVEN ***/

    /*** WHEN ***/
    const battery = asCommonBatteryPayload(
      batteryMessage as ZGAttributeReportMessage,
      BatteryType.CR2032
    )

    /*** THEN ***/
    expect(battery).toEqual({
      voltage: 3.065,
      level: 94
    })
  })

  it('should support CR1632 battery type', () => {
    /*** GIVEN ***/
    const type = BatteryType.CR1632

    /*** WHEN ***/
    const batteryBounds = getBatteryBounds(type)

    /*** THEN ***/
    expect(batteryBounds).toEqual({
      minVoltage: 2.5,
      maxVoltage: 3.1
    })
  })

  it('should support CR2032 battery type', () => {
    /*** GIVEN ***/
    const type = BatteryType.CR2032

    /*** WHEN ***/
    const batteryBounds = getBatteryBounds(type)

    /*** THEN ***/
    expect(batteryBounds).toEqual({
      minVoltage: 2.5,
      maxVoltage: 3.1
    })
  })

  it('should fail when specified battery type is unknown', () => {
    /*** GIVEN ***/
    const type = -1

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => getBatteryBounds(type)).toThrowError(`Unsupported battery type : ${type}`)
  })
})
