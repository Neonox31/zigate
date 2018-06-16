import { ZGMessageCode } from '../../src/message'
import { ZGStatusMessage } from '../../src/messages/status'

describe('ZGStatusMessage', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.Status
    const payload = Buffer.from([0x0, 0x0, 0x0, 0x49])

    /*** WHEN ***/
    const zgMsg = new ZGStatusMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGStatusMessage)
    expect(zgMsg.getCode()).toEqual(code)
    expect(zgMsg.getLabel()).toEqual('status')
    expect(zgMsg.getPayload()).toEqual({
      status: 0,
      sequenceNumber: 0,
      packetType: 73
    })
  })
})
