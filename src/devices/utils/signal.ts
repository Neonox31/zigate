import { ZGAttributeReportMessage } from '../../messages/attribute-report'
import { CommonBatteryPayload } from '../../common'

export function asCommonSignalPayload(msg: ZGAttributeReportMessage): CommonBatteryPayload {
  const level = Math.round((msg.getRSSI() * 100) / 255)

  return {
    level
  }
}
