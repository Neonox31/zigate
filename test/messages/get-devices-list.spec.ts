import { ZGMessageCode } from '../../src/message'
import { ZGGetDevicesListMessage } from '../../src/messages/get-devices-list'

describe('ZGGetDevicesListMessage', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.GetDevicesList

    const firstDevice = Buffer.from([
      0x0,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0xfe,
      0x0,
      0xfe
    ])
    const secondDevice = Buffer.from([
      0x1,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0x1,
      0x64
    ])

    const payload = Buffer.concat([firstDevice, secondDevice])

    /*** WHEN ***/
    const zgMsg = new ZGGetDevicesListMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGGetDevicesListMessage)
    expect(zgMsg.getCode()).toEqual(code)
    expect(zgMsg.getLabel()).toEqual('get-devices-list')
    expect(zgMsg.getPayload()).toEqual([
      {
        id: 0,
        shortAddress: 'fefe',
        MACIEEAddress: 'fefefefefefefefe',
        powerSource: 0,
        linkQuality: 254
      },
      {
        id: 1,
        shortAddress: 'ffff',
        MACIEEAddress: 'ffffffffffffffff',
        powerSource: 1,
        linkQuality: 100
      }
    ])
  })
})
