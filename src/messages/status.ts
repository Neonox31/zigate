import { ZGMessage, ZGMessageCode } from '../message'
import debug from '../debug'

export interface StatusPayload {
  status: number
  sequenceNumber: number
  packetType: number
}

const fromBuffer = (payload: Buffer): StatusPayload => {
  return {
    status: payload.readUInt8(0),
    sequenceNumber: payload.readUInt8(1),
    packetType: payload.readUInt16BE(2)
  }
}

export class ZGStatusMessage implements ZGMessage {
  code: ZGMessageCode
  label = 'status'
  payload: StatusPayload
  rssi: number

  constructor(code: ZGMessageCode, payload: Buffer, rssi: number) {
    this.code = code
    this.payload = fromBuffer(payload)
    this.rssi = rssi
    debug(`message:${this.getLabel()}`)(this.payload)
  }

  getCode(): ZGMessageCode {
    return this.code
  }

  getLabel(): string {
    return this.label
  }

  getPayload(): StatusPayload {
    return this.payload
  }

  getRSSI(): number {
    return this.rssi
  }
}
