import { ZGMessage, ZGMessageCode } from '../message'
import * as BigNum from 'bignum'
import debug from '../debug'

export type GetDevicesListPayload = Device[]

export interface Device {
  id: number
  shortAddress: string
  MACIEEAddress: string
  powerSource: number
  linkQuality: number
}

const chunk = (arr: Array<any>, size: number): Array<any> => {
  let chunks = []

  while (arr.length) {
    chunks.push(arr.splice(0, size))
  }
  return chunks
}

const fromBuffer = (payload: Buffer): GetDevicesListPayload => {
  return chunk(Array.from(payload), 13)
    .map(
      (c: Array<number>): Buffer => {
        return Buffer.from(c)
      }
    )
    .map(
      (c: Buffer): Device => {
        return {
          id: c.readUInt8(0),
          shortAddress: c.readUInt16BE(1).toString(16),
          MACIEEAddress: BigNum.fromBuffer(c.slice(3, 11)).toString(16),
          powerSource: c.readUInt8(11),
          linkQuality: c.readUInt8(12)
        }
      }
    )
}

export class ZGGetDevicesListMessage implements ZGMessage {
  code: ZGMessageCode
  label = 'get-devices-list'
  payload: GetDevicesListPayload

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

  getPayload(): GetDevicesListPayload {
    return this.payload
  }
}
