// import { ZGCommand, ZGCommandCode } from '../command'
//
// export interface Attribute {
//
// }
//
//
// export interface ReadAttributePayload {
//   addressMode?: number
//   targetShortAddress?: string
//   srcEndpoint?: number,
//   destEndpoint?: number,
//   clusterId?: number,
//   direction?: number,
//   manufacturerSpecific?: number,
//   manufacturerId?: number,
//   attributesCount?: number,
//   attributes?: Attribute[]
// }
//
// const toBuffer = (payload: ReadAttributePayload): Buffer => {
//   const buf = Buffer.alloc(4)
//
//   buf.writeUInt16BE(payload.targetShortAddress as number, 0)
//   buf.writeUInt8(payload.interval as number, 2)
//   buf.writeUInt8(payload.TCsignificance as number, 3)
//
//   return buf
// }
//
// export class ZGReadAttributeCommand implements ZGCommand {
//   code: ZGCommandCode
//   label = 'read-attribute'
//   payload: ReadAttributePayload
//   defaultPayload: ReadAttributePayload
//
//   constructor(code: ZGCommandCode, payload: ReadAttributePayload | undefined) {
//     this.code = code
//
//     this.defaultPayload = {
//       targetShortAddress: 0xfffc,
//       interval: 254,
//       TCsignificance: 0
//     }
//
//     this.payload = { ...this.defaultPayload, ...payload }
//   }
//
//   getCode(): ZGCommandCode {
//     return this.code
//   }
//
//   getLabel(): string {
//     return this.label
//   }
//
//   getBufferedPayload(): Buffer {
//     return toBuffer(this.payload)
//   }
// }
