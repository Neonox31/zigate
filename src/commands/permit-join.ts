import { ZGCommand, ZGCommandCode } from '../command'
import debug from '../debug'

export interface PermitJoinPayload {
  targetShortAddress?: number
  interval?: number
  TCsignificance?: number
}

const toBuffer = (payload: PermitJoinPayload): Buffer => {
  const buf = Buffer.alloc(4)

  buf.writeUInt16BE(payload.targetShortAddress as number, 0)
  buf.writeUInt8(payload.interval as number, 2)
  buf.writeUInt8(payload.TCsignificance as number, 3)

  return buf
}

export class ZGPermitJoinCommand implements ZGCommand {
  code: ZGCommandCode
  label = 'permit-join'
  payload: PermitJoinPayload
  defaultPayload: PermitJoinPayload

  constructor(code: ZGCommandCode, payload: PermitJoinPayload | undefined) {
    this.code = code

    this.defaultPayload = {
      targetShortAddress: 0xfffc,
      interval: 254,
      TCsignificance: 0
    }

    this.payload = { ...this.defaultPayload, ...payload }
    debug(`command:${this.getLabel()}`)(this.payload)
  }

  getCode(): ZGCommandCode {
    return this.code
  }

  getLabel(): string {
    return this.label
  }

  getBufferedPayload(): Buffer {
    return toBuffer(this.payload)
  }
}
