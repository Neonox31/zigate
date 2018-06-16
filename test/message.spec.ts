import { createZGMessage, ZGMessage, ZGMessageCode } from '../src/message'
import { ZGStatusMessage } from '../src/messages/status'
import { ZGAttributeReportMessage } from '../src/messages/attribute-report'
import { ZGDeviceAnnounceMessage } from '../src/messages/device-announce'
import { ZGActiveEndpointMessage } from '../src/messages/active-endpoint'
import { ZGGetDevicesListMessage } from '../src/messages/get-devices-list'

describe('ZGMessage', () => {
  const payload = Buffer.alloc(42)

  it('should create an attribute report message', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.AttributeReport

    /*** WHEN ***/
    const zgMsg = createZGMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGAttributeReportMessage)
  })

  it('should create a status message', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.Status

    /*** WHEN ***/
    const zgMsg = createZGMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGStatusMessage)
  })

  it('should create a device announce message', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.DeviceAnnounce

    /*** WHEN ***/
    const zgMsg = createZGMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGDeviceAnnounceMessage)
  })

  it('should create an active endpoint message', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.ActiveEndpoint

    /*** WHEN ***/
    const zgMsg = createZGMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGActiveEndpointMessage)
  })

  it('should create a get devices list message', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.GetDevicesList
    const payload = Buffer.alloc(13)

    /*** WHEN ***/
    const zgMsg = createZGMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGGetDevicesListMessage)
  })

  it('should fail when specified code is unknown', () => {
    /*** GIVEN ***/
    const code = -1

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => createZGMessage(code, Buffer.alloc(0))).toThrowError(
      `Unsupported message code : ${code}`
    )
  })
})
