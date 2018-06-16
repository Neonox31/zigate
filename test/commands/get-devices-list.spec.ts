import { ZGActiveEndpointMessage } from '../../src/messages/active-endpoint'
import { ZGCommandCode } from '../../src/command'
import { ZGPermitJoinCommand, ZGPermitJoinCommand } from '../../src/commands/permit-join'
import { ZGGetDevicesListCommand } from '../../src/commands/get-devices-list'

describe('ZGGetDevicesListCommand', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGCommandCode.GetDevicesList

    /*** WHEN ***/
    const zgCmd = new ZGGetDevicesListCommand(code)

    /*** THEN ***/
    expect(zgCmd).toBeInstanceOf(ZGGetDevicesListCommand)
    expect(zgCmd.getCode()).toEqual(code)
    expect(zgCmd.getLabel()).toEqual('get-devices-list')
  })
})
