import { ZGMessageCode } from '../../src/message'
import { ZGDeviceAnnounceMessage } from '../../src/messages/device-announce'

describe('ZGDeviceAnnounceMessage', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.DeviceAnnounce
    const payload = Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x0])

    /*** WHEN ***/
    const zgMsg = new ZGDeviceAnnounceMessage(code, payload, 100)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGDeviceAnnounceMessage)
    expect(zgMsg.getCode()).toEqual(code)
    expect(zgMsg.getLabel()).toEqual('device-announce')
    expect(zgMsg.getPayload()).toEqual({
      shortAddress: 'fefe',
      MACIEEAddress: 'fefefefefefefefe',
      MACCapability: 0
    })
    expect(zgMsg.getRSSI()).toEqual(100)
  })
})
