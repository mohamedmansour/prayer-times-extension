import { browser } from 'webextension-polyfill-ts'
import { CalculationName, LocationCoordinate, PrayerTimeFormat } from './pray_time'

export enum Setting {
  timeformat = 'timeformat',
  calculation = 'calculation',
  timenames = 'timenames',
  version = 'version',
  currentPosition = 'currentPosition',
}

export interface Settings {
  version?: string
  currentPosition?: LocationCoordinate
  calculation?: CalculationName
  timeformat?: PrayerTimeFormat
  timenames?: {[key: string]: boolean}
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
      case Setting.version:
      case Setting.currentPosition:
      default:
        result = value
        break
    }

    results[key] = result
  })

  return results as T
}
