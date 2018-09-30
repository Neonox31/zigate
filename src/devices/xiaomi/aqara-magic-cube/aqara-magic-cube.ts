import { Observable } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { ZGDevice } from '../../../device'
import { ZiGate } from '../../../zigate'
import { asAttributeReportMessage, ZGMessageCode } from '../../../message'
import { AttributeType, ZGAttributeReportMessage } from '../../../messages/attribute-report'
import debug from '../../../debug'
import { asCommonBatteryPayload, BatteryType } from '../utils/battery'
import { CommonBatteryPayload, CommonRemotePayload } from '../../../common'
import oneFaceFlipAttributes from './flip-attributes'

const isGestureMessage = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x2 &&
    msg.getPayload().clusterId === 0x0012 &&
    msg.getPayload().attributeId === 0x0055 &&
    msg.getPayload().attributeType === AttributeType.UInt16
  )
}

const getOneFaceFlipAttribute = (attribute: number) => {
  return oneFaceFlipAttributes.find(attr => attr.value === attribute)
}

const isOneFaceFlipMessage = (msg: ZGAttributeReportMessage) => {
  return getOneFaceFlipAttribute(msg.getPayload().attributeData as number) !== undefined
}

const isTwoFacesFlipMessage = (msg: ZGAttributeReportMessage) => {
  return (
    (msg.getPayload().attributeData as number) >= 0x0080 &&
    (msg.getPayload().attributeData as number) <= 0x0085
  )
}

const shakeMessages = (msg: ZGAttributeReportMessage) => {
  return isGestureMessage(msg) && msg.getPayload().attributeData === 0x0000
}

const flipMessages = (msg: ZGAttributeReportMessage) => {
  return isGestureMessage(msg) && (isOneFaceFlipMessage(msg) || isTwoFacesFlipMessage(msg))
}

const pushMessages = (msg: ZGAttributeReportMessage) => {
  return (
    isGestureMessage(msg) &&
    (msg.getPayload().attributeData as number) >= 0x0100 &&
    (msg.getPayload().attributeData as number) <= 0x0105
  )
}

const doubleTapMessages = (msg: ZGAttributeReportMessage) => {
  return (
    isGestureMessage(msg) &&
    (msg.getPayload().attributeData as number) >= 0x0200 &&
    (msg.getPayload().attributeData as number) <= 0x0205
  )
}

const batteryMessages = (msg: ZGAttributeReportMessage) => {
  return (
    msg.getPayload().srcEndpoint === 0x1 &&
    msg.getPayload().clusterId === 0x0 &&
    msg.getPayload().attributeId === 0xff01 &&
    msg.getPayload().attributeSize === 0x002a
  )
}

const asCommonFlipRemotePayload = (msg: ZGAttributeReportMessage): CommonRemotePayload => {
  const oneFaceFlipAttr = getOneFaceFlipAttribute(msg.getPayload().attributeData as number)

  if (oneFaceFlipAttr !== undefined) {
    return {
      flip: {
        degrees: 90,
        fromFace: oneFaceFlipAttr.fromFace,
        toFace: oneFaceFlipAttr.toFace
      }
    }
  }

  return {
    flip: {
      degrees: 180,
      toFace: (msg.getPayload().attributeData as number) - 0x0080
    }
  }
}

const asCommonPushRemotePayload = (msg: ZGAttributeReportMessage): CommonRemotePayload => {
  return {
    push: {
      face: (msg.getPayload().attributeData as number) - 0x0100
    }
  }
}

const asCommonDoubleTapRemotePayload = (msg: ZGAttributeReportMessage): CommonRemotePayload => {
  return {
    doubleTap: {
      face: (msg.getPayload().attributeData as number) - 0x0200
    }
  }
}

export class ZGXiaomiAqaraMagicCubeDevice implements ZGDevice {
  label = 'xiaomi-aqara-magic-cube'
  shortAddress: string

  messages$: Observable<ZGAttributeReportMessage>
  shake$: Observable<CommonRemotePayload>
  push$: Observable<CommonRemotePayload>
  flip$: Observable<CommonRemotePayload>
  doubleTap$: Observable<CommonRemotePayload>
  battery$: Observable<CommonBatteryPayload>

  constructor(zigate: ZiGate, shortAddress: string) {
    this.shortAddress = shortAddress

    this.messages$ = zigate.messages$.pipe(
      filter(msg => msg.getCode() === ZGMessageCode.AttributeReport),
      map(asAttributeReportMessage),
      filter(msg => msg.getPayload().srcAddress === this.shortAddress)
    )

    this.shake$ = this.messages$.pipe(
      filter(shakeMessages),
      map(_ => ({ shake: true })),
      tap((payload: CommonRemotePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:remote`)(payload)
      )
    )

    this.push$ = this.messages$.pipe(
      filter(pushMessages),
      map(asCommonPushRemotePayload),
      tap((payload: CommonRemotePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:remote`)(payload)
      )
    )

    this.flip$ = this.messages$.pipe(
      filter(flipMessages),
      map(asCommonFlipRemotePayload),
      tap((payload: CommonRemotePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:remote`)(payload)
      )
    )

    this.doubleTap$ = this.messages$.pipe(
      filter(doubleTapMessages),
      map(asCommonDoubleTapRemotePayload),
      tap((payload: CommonRemotePayload) =>
        debug(`device:${this.label}:${this.shortAddress}:remote`)(payload)
      )
    )

    this.battery$ = this.messages$.pipe(
      filter(batteryMessages),
      map(msg => asCommonBatteryPayload(msg, BatteryType.CR1632)),
      tap((payload: CommonBatteryPayload) =>
        debug(`device:${this.label}:${this.shortAddress}:battery`)(payload)
      )
    )
  }
}
