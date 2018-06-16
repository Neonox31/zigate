import debug, * as Debug from '../src/debug'
import spyOn = jest.spyOn

describe('debug', () => {
  spyOn(Debug, 'default')

  it('should show debug messages with given suffix', () => {
    /*** GIVEN ***/
    const suffix = 'foo'

    /*** WHEN ***/
    debug(suffix)('bar')

    /*** THEN ***/
    expect(debug).toHaveBeenCalledWith(suffix)
  })

  it('should show debug messages with no given suffix', () => {
    /*** GIVEN ***/

    /*** WHEN ***/
    debug()('bar')

    /*** THEN ***/
    expect(debug).toHaveBeenCalledWith()
  })
})
