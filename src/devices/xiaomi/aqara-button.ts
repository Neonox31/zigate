import { Observable } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { ZGDevice } from '../../device'
import { ZiGate } from '../../zigate'
import { asAttributeReportMessage, ZGMessageCode } from '../../message'
import { ZGAttributeReportMessage } from '../../messages/attribute-report'
import debug from '../../debug'
import { asCommonBatteryPayload, BatteryType } from './utils/battery'
import { CommonBatteryPayload, CommonPushSwitchPayload, CommonSignalPayload } from '../../common'
import { asCommonSignalPayload } from '../utils/signal'

const pushesMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x6 &&
    (msg.getPayload().attributeId === 0x0 || msg.getPayload().attributeId === 0x8000) &&
    msg.getPayload().attributeData !== false
  )
}

const asCommonPushSwitchPayload = (msg: ZGAttributeReportMessage): CommonPushSwitchPayload => {
  const count =
    msg.getPayload().attributeData === true ? 1 : (msg.getPayload().attributeData as number)

  return {
    count
  }
}

export class ZGXiaomiAqaraButtonDevice implements ZGDevice {
  label = 'xiaomi-aqara-button'
  shortAddress: string

  messages$: Observable<ZGAttributeReportMessage>
  pushes$: Observable<CommonPushSwitchPayload>
  battery$: Observable<CommonBatteryPayload>
  signal$: Observable<CommonSignalPayload>

  constructor(zigate: ZiGate, shortAddress: string) {
    this.shortAddress = shortAddress

    this.messages$ = zigate.messages$.pipe(
      filter(msg => msg.getCode() === ZGMessageCode.AttributeReport),
      map(asAttributeReportMessage),
      filter(msg => msg.getPayload().srcAddress === this.shortAddress)
    )

    this.pushes$ = this.messages$.pipe(
      filter(pushesMessages),
      map(asCommonPushSwitchPayload),
      tap((payload: CommonPushSwitchPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:pushes`)(payload)
      )
    )

    this.battery$ = this.messages$.pipe(
      filter(msg => msg.getPayload().srcEndpoint === 0x1),
      filter(msg => msg.getPayload().clusterId === 0x0),
      filter(msg => msg.getPayload().attributeId === 0xff01),
      filter(msg => msg.getPayload().attributeSize === 0x1a),
      map(msg => asCommonBatteryPayload(msg, BatteryType.CR2032)),
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
