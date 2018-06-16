import { ZGFrame } from '../src/frame'

describe('ZGFrame', () => {
  it('should create an empty frame when no buffer is specified', () => {
    /*** GIVEN ***/

    /*** WHEN ***/
    const zgFrame = new ZGFrame()

    /*** THEN ***/
    expect(zgFrame.msgCodeBytes).toEqual(Buffer.from([0, 0]))
    expect(zgFrame.msgLengthBytes).toEqual(Buffer.from([0, 0]))
    expect(zgFrame.checksumBytes).toEqual(Buffer.from([0]))
    expect(zgFrame.msgPayloadBytes).toEqual(Buffer.from([]))
    expect(zgFrame.rssiBytes).toEqual(Buffer.from([0]))
  })

  it('should create a frame with a specified buffer', () => {
    /*** GIVEN ***/
    const buffer = Buffer.from([0x1, 0x0, 0x1, 0x0, 0x2, 0x12, 0xb3, 0xb0, 0x0, 0x3])

    /*** WHEN ***/
    const zgFrame = new ZGFrame(buffer)

    /*** THEN ***/
    expect(zgFrame.msgCodeBytes).toEqual(Buffer.from([0x0, 0x1]))
    expect(zgFrame.msgLengthBytes).toEqual(Buffer.from([0x0, 0x2]))
    expect(zgFrame.checksumBytes).toEqual(Buffer.from([0xb3]))
    expect(zgFrame.msgPayloadBytes).toEqual(Buffer.from([0xb0]))
    expect(zgFrame.rssiBytes).toEqual(Buffer.from([0x0]))
  })

  it('should parse an input frame with no payload', () => {
    /*** GIVEN ***/
    const buffer = Buffer.from([0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x0, 0x3])
    /*** WHEN ***/
    const zgFrame = new ZGFrame(buffer)

    /*** THEN ***/
    expect(zgFrame.msgCodeBytes).toEqual(Buffer.from([0x0, 0x1]))
    expect(zgFrame.msgLengthBytes).toEqual(Buffer.from([0x0, 0x1]))
    expect(zgFrame.checksumBytes).toEqual(Buffer.from([0x0]))
    expect(zgFrame.msgPayloadBytes).toEqual(Buffer.from([]))
    expect(zgFrame.rssiBytes).toEqual(Buffer.from([0x0]))
  })

  it('should fail when input frame is not valid', () => {
    /*** GIVEN ***/
    const buffer = Buffer.from([0x2, 0x3])

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => new ZGFrame(buffer)).toThrowError('Provided frame is not a valid ZG frame.')
  })

  it('should fail when input frame has a wrong checksum', () => {
    /*** GIVEN ***/
    const buffer = Buffer.from([0x1, 0x0, 0x1, 0x0, 0x1, 0x3, 0x0, 0x3])

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => new ZGFrame(buffer)).toThrowError('Provided frame has an invalid checksum.')
  })

  it('should write the message code', () => {
    /*** GIVEN ***/
    const code = 42

    /*** WHEN ***/
    const zgFrame = new ZGFrame()

    zgFrame.writeMsgCode(code)

    /*** THEN ***/
    expect(zgFrame.readMsgCode()).toEqual(code)
  })

  it('should write the message payload with its size', () => {
    /*** GIVEN ***/
    const payload = Buffer.from([0x1, 0x2])

    /*** WHEN ***/
    const zgFrame = new ZGFrame()

    zgFrame.writeMsgPayload(payload)

    /*** THEN ***/
    expect(zgFrame.msgPayloadBytes).toEqual(payload)
    expect(zgFrame.readMsgLength()).toEqual(payload.length)
  })

  it('should write the rssi', () => {
    /*** GIVEN ***/
    const rssi = 42

    /*** WHEN ***/
    const zgFrame = new ZGFrame()

    zgFrame.writeRSSI(rssi)

    /*** THEN ***/
    expect(zgFrame.readRSSI()).toEqual(rssi)
  })

  it('should export frame to a buffer', () => {
    /*** GIVEN ***/
    const buffer = Buffer.from([0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x0, 0x3])

    /*** WHEN ***/
    const zgFrame = new ZGFrame(buffer)

    /*** THEN ***/
    expect(zgFrame.toBuffer()).toEqual(buffer)
  })
})
