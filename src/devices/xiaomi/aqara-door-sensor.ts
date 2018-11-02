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
  CommonReedSwitchPayload,
  CommonReedSwitchState,
  CommonSignalPayload
} from '../../common'
import { asCommonSignalPayload } from '../utils/signal'

const stateMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x6 &&
    msg.getPayload().attributeId === 0x0 &&
    msg.getPayload().attributeType === AttributeType.Boolean
  )
}

const asCommonReedSwitchPayload = (msg: ZGAttributeReportMessage): CommonReedSwitchPayload => {
  const state =
    msg.getPayload().attributeData === true
      ? CommonReedSwitchState.Opened
      : CommonReedSwitchState.Closed

  return {
    state
  }
}

export class ZGXiaomiAqaraDoorSensorDevice implements ZGDevice {
  label = 'xiaomi-aqara-door-sensor'
  shortAddress: string

  messages$: Observable<ZGAttributeReportMessage>
  state$: Observable<CommonReedSwitchPayload>
  battery$: Observable<CommonBatteryPayload>
  signal$: Observable<CommonSignalPayload>

  constructor(zigate: ZiGate, shortAddress: string) {
    this.shortAddress = shortAddress

    this.messages$ = zigate.messages$.pipe(
      filter(msg => msg.getCode() === ZGMessageCode.AttributeReport),
      map(asAttributeReportMessage),
      filter(msg => msg.getPayload().srcAddress === this.shortAddress)
    )

    this.state$ = this.messages$.pipe(
      filter(stateMessages),
      map(asCommonReedSwitchPayload),
      tap((payload: CommonReedSwitchPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:state`)(payload)
      )
    )

    this.battery$ = this.messages$.pipe(
      filter(msg => msg.getPayload().srcEndpoint === 0x1),
      filter(msg => msg.getPayload().clusterId === 0x0),
      filter(msg => msg.getPayload().attributeId === 0xff01),
      filter(msg => msg.getPayload().attributeSize === 0x1d),
      map(msg => asCommonBatteryPayload(msg, BatteryType.CR1632)),
      tap((payload: CommonBatteryPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:battery`)(payload)
      )
    )

    this.signal$ = this.messages$.pipe(
      map(asCommonSignalPayload),
      tap((payload: CommonBatteryPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:signal`)(payload)
      )
    )
  }
}
