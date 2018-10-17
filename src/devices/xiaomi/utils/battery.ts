import { ZGAttributeReportMessage } from '../../../messages/attribute-report'
import { CommonBatteryPayload } from '../../../common'

export enum BatteryType {
  CR2032,
  CR1632,
  CR2450
}

export function asCommonBatteryPayload(
  msg: ZGAttributeReportMessage,
  batteryType: BatteryType
): CommonBatteryPayload {
  const batteryBounds = getBatteryBounds(batteryType)
  const voltage = msg.getPayload().attributeDataRaw.readUInt16LE(2) / 1000
  const level = Math.round(
    ((voltage - batteryBounds.minVoltage) * 100) /
      (batteryBounds.maxVoltage - batteryBounds.minVoltage)
  )

  return {
    voltage,
    level
  }
}

export function getBatteryBounds(type: BatteryType) {
  switch (type) {
    case BatteryType.CR1632:
    case BatteryType.CR2032:
    case BatteryType.CR2450:
      return { minVoltage: 2.5, maxVoltage: 3.1 }
    default:
      throw new Error(`Unsupported battery type : ${type}`)
  }
}
