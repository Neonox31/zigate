export interface CommonBatteryPayload {
  voltage?: number
  level?: number
}

export enum CommonSwitchState {
  Off = 'off',
  On = 'on'
}

export enum CommonReedSwitchState {
  Closed = 'closed',
  Opened = 'opened'
}

export enum CommonAxis {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export interface CommonPushSwitchPayload {
  count?: number
  held?: boolean
}

export interface CommonToggleSwitchPayload {
  state?: CommonSwitchState
}

export interface CommonReedSwitchPayload {
  state?: CommonReedSwitchState
}

export interface CommonRemotePayload {
  shake?: boolean
  slide?: boolean
  rotation?: {
    axis?: CommonAxis
    degrees?: number
  }
  tap?: boolean
}

export interface CommonLightPayload {
  state?: CommonSwitchState
  level?: number
  color?: {
    hex?: string
    label?: string
  }
}

export interface CommonTemperaturePayload {
  celsius?: number
  fahrenheit?: number
}

export interface CommonHumidityPayload {
  level?: number
}

export interface CommonPressurePayload {
  millibar?: number
}

export interface CommonMotionPayload {
  state?: boolean
}

export interface CommonBrightnessPayload {
  level?: number
}
