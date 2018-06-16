import { ZGCommandCode } from '../../src/command'
import { ZGPermitJoinCommand } from '../../src/commands/permit-join'

describe('ZGPermitJoinCommand', () => {
  it('should create a message from specified code and payload', () => {
    /*** GIVEN ***/
    const code = ZGCommandCode.PermitJoin
    const payload = {
      targetShortAddress: 0xfefe,
      interval: 40,
      TCsignificance: 0
    }

    /*** WHEN ***/
    const zgCmd = new ZGPermitJoinCommand(code, payload)

    /*** THEN ***/
    expect(zgCmd).toBeInstanceOf(ZGPermitJoinCommand)
    expect(zgCmd.getCode()).toEqual(code)
    expect(zgCmd.getLabel()).toEqual('permit-join')
    expect(zgCmd.getBufferedPayload()).toEqual(Buffer.from([0xfe, 0xfe, 0x28, 0x0]))
  })
})
