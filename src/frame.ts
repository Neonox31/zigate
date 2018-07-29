import debug from './debug'

enum ZGFrameChunkSize {
  UInt8 = 1,
  UInt16,
  UInt32,
  UInt64
}

const hasStartByte = (startByte: number, frame: Buffer): boolean => {
  return frame.indexOf(startByte, 0) === 0
}

const hasStopByte = (stopByte: number, frame: Buffer): boolean => {
  return frame.indexOf(stopByte, frame.length - 1) === frame.length - 1
}

const combineBytes = (byte: number, idx: number, frame: number[]): [number, number] => {
  const nextByte = frame[idx + 1]

  return [byte, nextByte]
}

const removeDuplicate = (_: any, idx: number, frame: number[][]): boolean => {
  if (idx === 0) {
    return true
  }

  const [first] = frame[idx - 1]

  return first !== 0x2
}

const encodeBytes = (bytesPair: [number, number]): number => {
  return bytesPair[0] === 0x2 ? bytesPair[1] ^ 0x10 : bytesPair[0]
}

// const decodeByte = (byte: number): number[] => {
//   return byte >= 0x10 ? [byte] : [0x2, byte ^ 0x10]
// }

const readBytes = (bytes: Buffer) => {
  return bytes.readUIntBE(0, bytes.length)
}

const writeBytes = (bytes: Buffer, val: number) => {
  bytes.writeUIntBE(val, 0, bytes.length)
}

const xor = (checksum: number, byte: number): number => {
  return checksum ^ byte
}

const decodeFrame = (frame: Buffer): Buffer => {
  const arrFrame = Array.from(frame)
    .map(combineBytes)
    .filter(removeDuplicate)
    .map(encodeBytes)

  return Buffer.from(arrFrame)
}

// const encodeFrame = (frame: Buffer): Buffer => {
//   const arrFrame = Array
//     .from(frame)
//     .flatMap(decodeByte)
//
//   return Buffer.from(arrFrame);
// }

const getFrameChunk = (frame: Buffer, pos: number, size: ZGFrameChunkSize): Buffer => {
  return frame.slice(pos, pos + size)
}

export class ZGFrame {
  static readonly START_BYTE = 0x1
  static readonly STOP_BYTE = 0x3

  msgCodeBytes: Buffer = Buffer.alloc(ZGFrameChunkSize.UInt16)
  msgLengthBytes: Buffer = Buffer.alloc(ZGFrameChunkSize.UInt16)
  checksumBytes: Buffer = Buffer.alloc(ZGFrameChunkSize.UInt8)
  msgPayloadBytes: Buffer = Buffer.alloc(0)
  rssiBytes: Buffer = Buffer.alloc(0)

  msgLengthOffset = 0

  constructor(frame?: Buffer) {
    if (frame !== undefined) {
      debug('frame')(`new from buffer: %o`, frame)
      // Due to ZiGate incoming frames with erroneous msg length
      this.msgLengthOffset = -1

      if (!ZGFrame.isValid(frame)) {
        throw new Error('Provided frame is not a valid ZG frame.')
      }

      this.buildChunks(decodeFrame(frame))

      if (this.readChecksum() !== this.calcChecksum()) {
        throw new Error(`Provided frame has an invalid checksum.`)
      }
    }
  }

  static isValid(frame: Buffer) {
    return hasStartByte(ZGFrame.START_BYTE, frame) && hasStopByte(ZGFrame.STOP_BYTE, frame)
  }

  buildChunks(frame: Buffer) {
    this.msgCodeBytes = getFrameChunk(frame, 1, this.msgCodeBytes.length)
    this.msgLengthBytes = getFrameChunk(frame, 3, this.msgLengthBytes.length)
    this.checksumBytes = getFrameChunk(frame, 5, this.checksumBytes.length)
    this.msgPayloadBytes = getFrameChunk(frame, 6, this.readMsgLength())
    this.rssiBytes = getFrameChunk(frame, 6 + this.readMsgLength(), ZGFrameChunkSize.UInt8)

    debug('frame')(
      `msg code: %d\nmsg length: %d\nchecksum: %d\nmsg payload: %o\nrssi: %d`,
      this.readMsgCode(),
      this.readMsgLength(),
      this.readChecksum(),
      this.msgPayloadBytes,
      this.readRSSI()
    )
  }

  toBuffer(): Buffer {
    const length = 7 + this.rssiBytes.length + this.readMsgLength()

    return Buffer.concat(
      [
        Uint8Array.from([ZGFrame.START_BYTE]),
        this.msgCodeBytes,
        this.msgLengthBytes,
        this.checksumBytes,
        this.msgPayloadBytes,
        this.rssiBytes,
        Uint8Array.from([ZGFrame.STOP_BYTE])
      ],
      length
    )
  }

  readMsgCode(): number {
    return readBytes(this.msgCodeBytes)
  }

  writeMsgCode(msgCode: number): ZGFrame {
    writeBytes(this.msgCodeBytes, msgCode)
    this.writeChecksum()
    return this
  }

  readMsgLength(): number {
    return readBytes(this.msgLengthBytes) + this.msgLengthOffset
  }

  writeMsgLength(msgLength: number): ZGFrame {
    writeBytes(this.msgLengthBytes, msgLength)
    return this
  }

  readChecksum(): number {
    return readBytes(this.checksumBytes)
  }

  writeMsgPayload(msgPayload: Buffer): ZGFrame {
    this.msgPayloadBytes = Buffer.from(msgPayload)
    this.writeMsgLength(msgPayload.length)
    this.writeChecksum()
    return this
  }

  readRSSI(): number {
    return readBytes(this.rssiBytes)
  }

  writeRSSI(rssi: number): ZGFrame {
    this.rssiBytes = Buffer.from([rssi])
    this.writeChecksum()
    return this
  }

  calcChecksum(): number {
    let checksum = 0x00

    checksum = this.msgCodeBytes.reduce(xor, checksum)
    checksum = this.msgLengthBytes.reduce(xor, checksum)
    checksum = this.rssiBytes.reduce(xor, checksum)
    checksum = this.msgPayloadBytes.reduce(xor, checksum)

    return checksum
  }

  writeChecksum() {
    this.checksumBytes = Buffer.from([this.calcChecksum()])
    return this
  }
}
