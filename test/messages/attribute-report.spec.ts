import { AttributeType, ZGAttributeReportMessage } from '../../src/messages/attribute-report'
import { ZGMessageCode } from '../../src/message'

describe('ZGAttributeReportMessage', () => {
  const code = ZGMessageCode.AttributeReport
  const basePayload = Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x0, 0x0, 0x0])
  const attributeSize = Buffer.alloc(2)
  const attributeType = Buffer.alloc(2)

  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(1, 0)
    attributeType.writeUInt16BE(AttributeType.Boolean, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUInt8(1, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGAttributeReportMessage)
    expect(zgMsg.getCode()).toEqual(code)
    expect(zgMsg.getLabel()).toEqual('attribute-report')
    expect(zgMsg.getPayload()).toEqual({
      sequenceNumber: 0,
      srcAddress: 'fefe',
      srcEndpoint: 1,
      clusterId: 0,
      attributeId: 0,
      attributeType: AttributeType.Boolean,
      attributeSize: 1,
      attributeData: true,
      attributeDataRaw: Buffer.from([0x1])
    })
  })

  it('should recognize null attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(0, 0)
    attributeType.writeUInt16BE(AttributeType.Null, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg.getPayload().attributeData).toBeNull()
  })

  it('should recognize enum attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(1, 0)
    attributeType.writeUInt16BE(AttributeType.Enum, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUInt8(1, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(1)
  })

  it('should recognize uint8 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(1, 0)
    attributeType.writeUInt16BE(AttributeType.UInt8, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUInt8(1, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(1)
  })

  it('should recognize uint16 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(2, 0)
    attributeType.writeUInt16BE(AttributeType.UInt16, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUInt16BE(256, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(256)
  })

  it('should recognize uint32 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(4, 0)
    attributeType.writeUInt16BE(AttributeType.UInt32, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUInt32BE(65536, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(65536)
  })

  it('should recognize uint48 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(6, 0)
    attributeType.writeUInt16BE(AttributeType.UInt48, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeUIntBE(4294967296, 0, 6)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(4294967296)
  })

  it('should recognize int8 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(1, 0)
    attributeType.writeUInt16BE(AttributeType.Int8, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeInt8(1, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(1)
  })

  it('should recognize int16 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(2, 0)
    attributeType.writeUInt16BE(AttributeType.Int16, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeInt16BE(128, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(128)
  })

  it('should recognize int32 attribute type', () => {
    /*** GIVEN ***/
    attributeSize.writeUInt16BE(4, 0)
    attributeType.writeUInt16BE(AttributeType.Int32, 0)
    const attributeData = Buffer.alloc(attributeSize.readUInt16BE(0))
    attributeData.writeInt32BE(32768, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('number')
    expect(zgMsg.getPayload().attributeData).toEqual(32768)
  })

  it('should recognize string attribute type', () => {
    /*** GIVEN ***/
    const attributeData = Buffer.from('foo')
    attributeSize.writeUInt16BE(attributeData.length, 0)
    attributeType.writeUInt16BE(AttributeType.String, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, attributeData])

    /*** WHEN ***/
    const zgMsg = new ZGAttributeReportMessage(code, payload)

    /*** THEN ***/
    expect(typeof zgMsg.getPayload().attributeData).toBe('string')
    expect(zgMsg.getPayload().attributeData).toEqual('foo')
  })

  it('should fail when attribute type is not recognized', () => {
    /*** GIVEN ***/
    const attrType = 0xfefe
    attributeSize.writeUInt16BE(0, 0)
    attributeType.writeUInt16BE(attrType, 0)
    const payload = Buffer.concat([basePayload, attributeType, attributeSize, Buffer.alloc(0)])

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => new ZGAttributeReportMessage(code, payload)).toThrowError(
      `Unsupported attribute data type: ${attrType}`
    )
  })
})
