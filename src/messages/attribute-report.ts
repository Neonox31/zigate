import { ZGMessage, ZGMessageCode } from '../message'
import debug from '../debug'

type AttributeData = number | string | boolean | null

export enum AttributeType {
  Null = 0x0,
  Boolean = 0x10,
  BitMap8 = 0x18,
  UInt8 = 0x20,
  UInt16 = 0x21,
  UInt32 = 0x22,
  UInt48 = 0x25,
  Int8 = 0x28,
  Int16 = 0x29,
  Int32 = 0x2a,
  Enum = 0x30,
  String = 0x42
}

export interface AttributeReportPayload {
  sequenceNumber: number
  srcAddress: string
  srcEndpoint: number
  clusterId: number
  attributeId: number
  attributeType: number
  attributeSize: number
  attributeData: AttributeData
  attributeDataRaw: Buffer
}

const attributeDataFromBuffer = (
  attributeType: number,
  attributeSize: number,
  payload: Buffer
): AttributeData => {
  switch (attributeType) {
    case AttributeType.Null:
      return null
    case AttributeType.Boolean:
      return payload.readUInt8(0) === 1
    case AttributeType.BitMap8:
    case AttributeType.UInt8:
    case AttributeType.Enum:
      return payload.readUInt8(0)
    case AttributeType.UInt16:
      return payload.readUInt16BE(0)
    case AttributeType.UInt32:
      return payload.readUInt32BE(0)
    case AttributeType.UInt48:
      return payload.readUIntBE(0, 6)
    case AttributeType.Int8:
      return payload.readInt8(0)
    case AttributeType.Int16:
      return payload.readInt16BE(0)
    case AttributeType.Int32:
      return payload.readInt32BE(0)
    case AttributeType.String:
      return payload.toString('utf8', 0, attributeSize)
    default:
      throw new Error(`Unsupported attribute data type: ${attributeType}`)
  }
}

const fromBuffer = (payload: Buffer): AttributeReportPayload => {
  const DATA_OFFSET = 12
  const msgPayload = {
    sequenceNumber: payload.readUInt8(0),
    srcAddress: payload.readUInt16BE(1).toString(16),
    srcEndpoint: payload.readUInt8(3),
    clusterId: payload.readUInt16BE(4),
    attributeId: payload.readUInt16BE(6),
    attributeType: payload.readUInt16BE(8),
    attributeSize: payload.readUInt16BE(10)
  }

  const attributeData: Buffer = payload.slice(DATA_OFFSET)

  return {
    ...msgPayload,
    attributeData: attributeDataFromBuffer(
      msgPayload.attributeType,
      msgPayload.attributeSize,
      attributeData
    ),
    attributeDataRaw: attributeData
  }
}

export class ZGAttributeReportMessage implements ZGMessage {
  code: ZGMessageCode
  label = 'attribute-report'
  payload: AttributeReportPayload
  payloadBuffer: Buffer

  constructor(code: ZGMessageCode, payload: Buffer) {
    this.code = code
    this.payloadBuffer = payload
    this.payload = fromBuffer(payload)
    debug(`message:${this.getLabel()}`)(this.payload)
  }

  getCode(): ZGMessageCode {
    return this.code
  }

  getLabel(): string {
    return this.label
  }

  getPayload(): AttributeReportPayload {
    return this.payload
  }
}
