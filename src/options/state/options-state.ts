import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { CalculationName, PrayerTimeFormat } from '../../shared/pray_time'

type PageType = 'fre' | 'settings'

async function getSetting<T>(keys: string[]) {
  const values = await browser.storage.sync.get(keys)
  const results = {}
  keys.forEach(key => {
    let result = undefined
    const value = values[key]

    switch (key) {
      case 'version':
      case 'currentPosition':
        result = value
        break
      case 'timeformat':
        result = (typeof value == 'undefined') ? PrayerTimeFormat.TwelveHourFormat : PrayerTimeFormat[value]
        break
      case 'calculation':
        result = (typeof value == 'undefined') ? CalculationName.Jafari : CalculationName[value]
        break
      case 'timenames':
        result = (typeof value == 'undefined') ? [
          'imsak',
          'fajr',
          'sunrise',
          'dhuhr',
          'asr',
          'sunset',
          'maghrib',
          'isha',
          'midnight'
        ] : value.split(',')
        break
      // case 'bypassCache':
      //   result = value == true
      //   break
      default:
        result = undefined
        break
    }

    results[key] = result
  })

  return results as T
}

interface Settings {
  currentPosition: GeolocationCoordinates
  calculation: CalculationName
  timeformat: PrayerTimeFormat
  timenames: string[]
}

export class OptionsState {
  page: PageType = 'fre'
  settings: Settings = null

  constructor() {
    makeAutoObservable(this, {})
    this.init()
  }

  async init() {
    const settings = await getSetting<Settings>([
      'currentPosition',
      'timeformat',
      'calculation',
      'timenames'
    ])
    runInAction(async () => {
      this.settings = settings
    })
  }

  queryLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords
          await browser.storage.sync.set({'currentPosition': { latitude, longitude }})
          runInAction(() => this.settings.currentPosition = position.coords)
        },
        (positionError: GeolocationPositionError) => {
          console.error('Geolocation Error', positionError)
        }
      )
    } else {
      console.error('Geolocation Not supported')
    }
  }
}
