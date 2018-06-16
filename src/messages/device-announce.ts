import { ZGMessage, ZGMessageCode } from '../message'
import * as BigNum from 'bignum'
import debug from '../debug'

export interface DeviceAnnouncePayload {
  shortAddress: string
  MACIEEAddress: string
  MACCapability: number
}

const fromBuffer = (payload: Buffer): DeviceAnnouncePayload => {
  return {
    shortAddress: payload.readUInt16BE(0).toString(16),
    MACIEEAddress: BigNum.fromBuffer(payload.slice(2, 10)).toString(16),
    MACCapability: payload.readUInt8(10)
  }
}

export class ZGDeviceAnnounceMessage implements ZGMessage {
  code: ZGMessageCode
  label = 'device-announce'
  payload: DeviceAnnouncePayload

  constructor(code: ZGMessageCode, payload: Buffer) {
    this.code = code
    this.payload = fromBuffer(payload)
    debug(`message:${this.getLabel()}`)(this.payload)
  }

  getCode(): ZGMessageCode {
    return this.code
  }

  getLabel(): string {
    return this.label
  }

  getPayload(): DeviceAnnouncePayload {
    return this.payload
  }
}
