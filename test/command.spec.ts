import { createZGCommand, ZGCommandCode } from '../src/command'
import { ZGPermitJoinCommand } from '../src/commands/permit-join'
import { ZGGetDevicesListCommand } from '../src/commands/get-devices-list'

describe('ZGCommand', () => {
  it('should fail when specified code is unknown', () => {
    /*** GIVEN ***/
    const code = -1

    /*** WHEN ***/

    /*** THEN ***/
    expect(() => createZGCommand(code)).toThrowError(`Unsupported command code : ${code}`)
  })

  it('should create a permit join command', () => {
    /*** GIVEN ***/
    const code = ZGCommandCode.PermitJoin

    /*** WHEN ***/
    const zgCmd = createZGCommand(code)

    /*** THEN ***/
    expect(zgCmd).toBeInstanceOf(ZGPermitJoinCommand)
  })

  it('should create a get devices list command', () => {
    /*** GIVEN ***/
    const code = ZGCommandCode.GetDevicesList

    /*** WHEN ***/
    const zgCmd = createZGCommand(code)

    /*** THEN ***/
    expect(zgCmd).toBeInstanceOf(ZGGetDevicesListCommand)
  })
})
