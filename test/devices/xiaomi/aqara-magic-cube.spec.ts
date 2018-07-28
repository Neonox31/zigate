import { ZiGate } from '../../../src/zigate'
import { MockZiGate } from '../../mocks/zigate'
import { createZGMessage, ZGMessageCode } from '../../../src/message'
import { TestScheduler } from 'rxjs/testing'
import { ZGXiaomiAqaraMagicCubeDevice } from '../../../src/devices/xiaomi/aqara-magic-cube/aqara-magic-cube'
import { CommonAxis } from '../../../src/common'

function assertDeepEqual(actual: any, expected: any) {
  expect(actual).toEqual(expected)
}

describe('ZGXiaomiAqaraMagicCubeDevice', () => {
  let scheduler: TestScheduler

  beforeEach(() => {
    scheduler = new TestScheduler(assertDeepEqual)
  })

  it('should emit current device messages', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const firstMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xff, 0xff, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])
      )
      const secondMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x0, 0xfe, 0xfe, 0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-b-', {
        a: firstMessage,
        b: secondMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.messages$).toBe('---b-', { b: secondMessage })
    })
  })

  it('should emit messages when shaked', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const shakeMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x24, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x2, 0x0, 0x0])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: shakeMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.shake$).toBe('-b-', { b: { shake: true } })
    })
  })

  it('should emit messages when pushed on face 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x0])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 0
          }
        }
      })
    })
  })

  it('should emit messages when pushed on face 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x1])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 1
          }
        }
      })
    })
  })

  it('should emit messages when pushed on face 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x2])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 2
          }
        }
      })
    })
  })

  it('should emit messages when pushed on face 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x3])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 3
          }
        }
      })
    })
  })

  it('should emit messages when pushed on face 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x4])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 4
          }
        }
      })
    })
  })

  it('should emit messages when pushed on face 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const slideMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([0x27, 0xfe, 0xfe, 0x02, 0x0, 0x12, 0x0, 0x55, 0x0, 0x21, 0x0, 0x02, 0x01, 0x5])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: slideMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.push$).toBe('-b-', {
        b: {
          push: {
            face: 5
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 0 to 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x41
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 0,
            toFace: 1
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 0 to 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x42
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 0,
            toFace: 2
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 0 to 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x44
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 0,
            toFace: 4
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 0 to 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x45
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 0,
            toFace: 5
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 1 to 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x48
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 1,
            toFace: 0
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 1 to 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x4a
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 1,
            toFace: 2
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 1 to 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x4b
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 1,
            toFace: 3
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 1 to 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x4d
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 1,
            toFace: 5
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 2 to 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x50
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 2,
            toFace: 0
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 2 to 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x51
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 2,
            toFace: 1
          }
        }
      })
    })
  })
  it('should emit messages when flipped from face 2 to 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x53
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 2,
            toFace: 3
          }
        }
      })
    })
  })
  it('should emit messages when flipped from face 2 to 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x54
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 2,
            toFace: 4
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 3 to 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x59
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 3,
            toFace: 1
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 3 to 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x5a
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 3,
            toFace: 2
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 3 to 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x5c
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 3,
            toFace: 4
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 3 to 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x5d
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 3,
            toFace: 5
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 4 to 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x60
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 4,
            toFace: 0
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 4 to 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x62
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 4,
            toFace: 2
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 4 to 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x63
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 4,
            toFace: 3
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 4 to 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x65
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 4,
            toFace: 5
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 5 to 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x68
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 5,
            toFace: 0
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 5 to 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x69
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 5,
            toFace: 1
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 5 to 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x6b
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 5,
            toFace: 3
          }
        }
      })
    })
  })

  it('should emit messages when flipped from face 5 to 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x2a,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x6c
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 90,
            fromFace: 5,
            toFace: 4
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x80
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 0
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x81
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 1
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x82
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 2
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x83
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 3
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x84
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 4
          }
        }
      })
    })
  })

  it('should emit messages when 180° flipped to face 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x32,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x00,
          0x85
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.flip$).toBe('-b-', {
        b: {
          flip: {
            degrees: 180,
            toFace: 5
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 0', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x00
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 0
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 1', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x01
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 1
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 2', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x02
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 2
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 3', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x03
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 3
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 4', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x04
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 4
          }
        }
      })
    })
  })

  it('should emit messages when tapped twice on face 5', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const rotationMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x34,
          0xfe,
          0xfe,
          0x02,
          0x00,
          0x12,
          0x00,
          0x55,
          0x00,
          0x21,
          0x00,
          0x02,
          0x02,
          0x05
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: rotationMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.doubleTap$).toBe('-b-', {
        b: {
          doubleTap: {
            face: 5
          }
        }
      })
    })
  })

  it('should emit messages about battery health', () => {
    scheduler.run(helpers => {
      /*** GIVEN ***/
      const batteryMessage = createZGMessage(
        ZGMessageCode.AttributeReport,
        Buffer.from([
          0x3c,
          0xfe,
          0xfe,
          0x01,
          0x0,
          0x0,
          0xff,
          0x01,
          0x0,
          0x42,
          0x0,
          0x002a,
          0x1,
          0x21,
          0xf9,
          0x0b,
          0x03,
          0x28,
          0x1e,
          0x04,
          0x21,
          0xa8,
          0x43,
          0x05,
          0x21,
          0x12,
          0x0,
          0x6,
          0x24,
          0x6,
          0x0,
          0x0,
          0x0,
          0x0,
          0x0a,
          0x21,
          0x0,
          0x0
        ])
      )

      const zigate = new MockZiGate()

      zigate.messages$ = helpers.hot('-a-', {
        a: batteryMessage
      })

      /*** WHEN ***/
      const zgDevice = new ZGXiaomiAqaraMagicCubeDevice(zigate as ZiGate, 'fefe')

      /*** THEN ***/
      helpers.expectObservable(zgDevice.battery$).toBe('-b-', {
        b: {
          voltage: 3.065,
          level: 94
        }
      })
    })
  })
})
