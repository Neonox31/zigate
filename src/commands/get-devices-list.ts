import { ZGCommand, ZGCommandCode } from '../command'
import debug from '../debug'

export class ZGGetDevicesListCommand implements ZGCommand {
  code: ZGCommandCode
  label = 'get-devices-list'

  constructor(code: ZGCommandCode) {
    this.code = code
    debug(`command:${this.getLabel()}`)(`no payload`)
  }

  getCode(): ZGCommandCode {
    return this.code
  }

  getLabel(): string {
    return this.label
  }
}
