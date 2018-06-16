import { ZGMessageCode } from '../../src/message'
import { ZGActiveEndpointMessage } from '../../src/messages/active-endpoint'

describe('ZGActiveEndpointMessage', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGMessageCode.ActiveEndpoint
    const payload = Buffer.from([0xfe, 0xfe])

    /*** WHEN ***/
    const zgMsg = new ZGActiveEndpointMessage(code, payload)

    /*** THEN ***/
    expect(zgMsg).toBeInstanceOf(ZGActiveEndpointMessage)
    expect(zgMsg.getCode()).toEqual(code)
    expect(zgMsg.getLabel()).toEqual('active-endpoint')
    expect(zgMsg.getPayload()).toEqual({
      shortAddress: 'fefe'
    })
  })
})
