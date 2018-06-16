import { PermitJoinPayload, ZGPermitJoinCommand } from './commands/permit-join'
import { ZGGetDevicesListCommand } from './commands/get-devices-list'
import debug from './debug'

export interface ZGCommand {
  getCode(): ZGCommandCode
  getLabel(): string
  getBufferedPayload?(): Buffer
}

export enum ZGCommandCode {
  PermitJoin = 0x0049,
  GetDevicesList = 0x0015
}

export type ZGCommandPayload = PermitJoinPayload

export function createZGCommand(code: ZGCommandCode, payload?: ZGCommandPayload): ZGCommand {
  debug(`command`)(`new from code: %d`, code)
  switch (code) {
    case ZGCommandCode.PermitJoin:
      return new ZGPermitJoinCommand(code, payload)
    case ZGCommandCode.GetDevicesList:
      return new ZGGetDevicesListCommand(code)
    default:
      throw new Error(`Unsupported command code : ${code}`)
  }
}
