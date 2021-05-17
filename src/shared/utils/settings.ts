import { browser } from 'webextension-polyfill-ts'
import { CalculationName, LocationCoordinate, PrayerTimeFormat } from '../prayer-time-lib'

export enum Setting {
  timeformat = 'timeformat',
  calculation = 'calculation',
  timenames = 'timenames',
  version = 'version',
  currentPosition = 'currentPosition',
  offsets = 'offsets'
}

export interface Settings {
  version?: string
  currentPosition?: LocationCoordinate
  calculation?: CalculationName
  timeformat?: PrayerTimeFormat
  timenames?: {[key: string]: boolean}
  offsets?: {[key: string]: number}
}

export async function setSetting<T>(key: Setting, value: T) {
  await browser.storage.sync.set({[key]: value})
}

export async function getSetting<T>(keys: Setting[]): Promise<Partial<Settings>> {
  const values = await browser.storage.sync.get(keys)
  const results = {}
  keys.forEach(key => {
    let result = undefined
    const value = values[key]

    switch (key) {
      case Setting.timeformat:
        result = (typeof value == 'undefined') ? PrayerTimeFormat.TwelveHourFormat : value
        break
      case Setting.calculation:
        result = (typeof value == 'undefined') ? CalculationName.Jafari : value
        break
      case Setting.timenames:
        result = (typeof value == 'undefined') ? {
          'imsak': true,
          'fajr': true,
          'sunrise': true,
          'dhuhr': true,
          'asr': true,
          'sunset': true,
          'maghrib': true,
          'isha': true,
          'midnight': true
        } : value
        break
      case Setting.offsets:
        result = (typeof value == 'undefined') ? {
          'imsak': 0,
          'fajr': 0,
          'sunrise': 0,
          'dhuhr': 0,
          'asr': 0,
          'sunset': 0,
          'maghrib': 0,
          'isha': 0,
          'midnight': 0
        } : value
        break
      case Setting.currentPosition:
        result = (typeof value == 'undefined') ? { latitude: 21.3891,longitude: 39.8579 } : value
        break
      case Setting.version:
      default:
        result = value
        break
    }

    results[key] = result
  })

  return results as T
}
