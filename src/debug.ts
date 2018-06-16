import debug from 'debug'

export default function(suffix?: string) {
  return debug('zigate' + (suffix ? ':' + suffix : ''))
}
