import SerialPort from 'serialport'
import { ZGFrame } from './frame'
import { createZGMessage, ZGMessage } from './message'
import { Observable, fromEvent } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { createZGCommand, ZGCommandCode, ZGCommandPayload } from './command'
import { createZGDevice, ZGDevice, ZGDeviceType } from './device'
import debug from './debug'
import Delimiter = SerialPort.parsers.Delimiter

export { ZGDeviceType } from './device'
export { ZGCommandCode, ZGCommandPayload } from './command'

export class ZiGate {
  messages$: Observable<ZGMessage>

  serialPort: SerialPort
  serialPortParser: Delimiter

  constructor(path: string) {
    this.serialPort = new SerialPort(path, {
      baudRate: 115200
    })

    this.serialPortParser = this.serialPort.pipe(
      new SerialPort.parsers.Delimiter({
        delimiter: [ZGFrame.STOP_BYTE],
        includeDelimiter: true
      })
    )

    this.messages$ = fromEvent(this.serialPortParser, 'data').pipe(
      map((frame: Buffer) => {
        debug('serial:in')(frame)
        const zgFrame = new ZGFrame(frame)
        return createZGMessage(zgFrame.readMsgCode(), zgFrame.msgPayloadBytes, zgFrame.readRSSI())
      }),
      share()
    )

    this.serialPortParser.on('error', err => {
      console.error(err.message)
    })
  }

  sendCommand = (code: ZGCommandCode, payload?: ZGCommandPayload) => {
    const zgCmd = createZGCommand(code, payload)
    const frame = new ZGFrame()

    frame.writeMsgCode(zgCmd.getCode())

    if (zgCmd.getBufferedPayload) {
      frame.writeMsgPayload(zgCmd.getBufferedPayload())
    }

    debug('serial:out')(frame.toBuffer())
    this.serialPort.write(frame.toBuffer())
  }

  createDevice = (type: ZGDeviceType, shortAddress: string): ZGDevice => {
    return createZGDevice(this, type, shortAddress)
  }
}
