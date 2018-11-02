import { AttributeReportPayload, ZGAttributeReportMessage } from './messages/attribute-report'
import { StatusPayload, ZGStatusMessage } from './messages/status'
import { DeviceAnnouncePayload, ZGDeviceAnnounceMessage } from './messages/device-announce'
import { ActiveEndpointPayload, ZGActiveEndpointMessage } from './messages/active-endpoint'
import { GetDevicesListPayload, ZGGetDevicesListMessage } from './messages/get-devices-list'
import debug from './debug'

export interface ZGMessage {
  getCode(): ZGMessageCode
  getLabel(): string
  getPayload(): ZGMessagePayload
  getRSSI(): number
}

export enum ZGMessageCode {
  AttributeReport = 0x8102,
  Status = 0x8000,
  DeviceAnnounce = 0x004d,
  ActiveEndpoint = 0x0045,
  GetDevicesList = 0x8015
}

export type ZGMessagePayload =
  | AttributeReportPayload
  | StatusPayload
  | DeviceAnnouncePayload
  | ActiveEndpointPayload
  | GetDevicesListPayload

export function createZGMessage(code: ZGMessageCode, payload: Buffer, rssi: number): ZGMessage {
  debug(`message`)(`new from code: %d`, code)
  switch (code) {
    case ZGMessageCode.AttributeReport:
      return new ZGAttributeReportMessage(code, payload, rssi)
    case ZGMessageCode.Status:
      return new ZGStatusMessage(code, payload, rssi)
    case ZGMessageCode.DeviceAnnounce:
      return new ZGDeviceAnnounceMessage(code, payload, rssi)
    case ZGMessageCode.ActiveEndpoint:
      return new ZGActiveEndpointMessage(code, payload, rssi)
    case ZGMessageCode.GetDevicesList:
      return new ZGGetDevicesListMessage(code, payload, rssi)
    default:
      throw new Error(`Unsupported message code : ${code}`)
  }
}

export function asAttributeReportMessage(msg: ZGMessage): ZGAttributeReportMessage {
  return msg as ZGAttributeReportMessage
}
