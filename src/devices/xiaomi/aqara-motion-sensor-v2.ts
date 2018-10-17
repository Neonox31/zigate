import { Observable } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { ZGDevice } from '../../device'
import { ZiGate } from '../../zigate'
import { asAttributeReportMessage, ZGMessageCode } from '../../message'
import { AttributeType, ZGAttributeReportMessage } from '../../messages/attribute-report'
import debug from '../../debug'
import { asCommonBatteryPayload, BatteryType } from './utils/battery'
import {
  CommonBatteryPayload,
  CommonBrightnessPayload,
  CommonMotionPayload,
  CommonReedSwitchPayload
} from '../../common'

const motionMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x406 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.BitMap8
  )
}

const brightnessMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x400 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.UInt16
  )
}

const asCommonMotionPayload = (msg: ZGAttributeReportMessage): CommonMotionPayload => {
  const state = msg.getPayload().attributeData === 1

  return {
    state
  }
}

const asCommonBrightnessPayload = (msg: ZGAttributeReportMessage): CommonBrightnessPayload => {
  const level = msg.getPayload().attributeData as number

  return {
    level
  }
}

export class ZGXiaomiAqaraMotionSensorV2Device implements ZGDevice {
  label = 'xiaomi-aqara-motion-sensor-v2'
  shortAddress: string

  messages$: Observable<ZGAttributeReportMessage>
  motion$: Observable<CommonMotionPayload>
  brightness$: Observable<CommonBrightnessPayload>
  battery$: Observable<CommonBatteryPayload>

  constructor(zigate: ZiGate, shortAddress: string) {
    this.shortAddress = shortAddress

    this.messages$ = zigate.messages$.pipe(
      filter(msg => msg.getCode() === ZGMessageCode.AttributeReport),
      map(asAttributeReportMessage),
      filter(msg => msg.getPayload().srcAddress === this.shortAddress)
    )

    this.motion$ = this.messages$.pipe(
      filter(motionMessages),
      map(asCommonMotionPayload),
      tap((payload: CommonMotionPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:motion`)(payload)
      )
    )

    this.brightness$ = this.messages$.pipe(
      filter(brightnessMessages),
      map(asCommonBrightnessPayload),
      tap((payload: CommonReedSwitchPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:brightness`)(payload)
      )
    )

    this.battery$ = this.messages$.pipe(
      filter(msg => msg.getPayload().srcEndpoint === 0x1),
      filter(msg => msg.getPayload().clusterId === 0x0),
      filter(msg => msg.getPayload().attributeId === 0xff01),
      filter(msg => msg.getPayload().attributeSize === 0x21),
      map(msg => asCommonBatteryPayload(msg, BatteryType.CR2450)),
      tap((payload: CommonBatteryPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:battery`)(payload)
      )
    )
  }
}
