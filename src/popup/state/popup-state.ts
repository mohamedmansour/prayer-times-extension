import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import { LocationCoordinate, PrayerTimeFormat, PrayerTimes, PrayTimesProvider } from '../../shared/pray_time'
import { prayTimeMessages } from '../../shared/pray_time_messages'

type PageType = 'popup'

export interface PrayerTimeRendered {
  name: string
  time: string
  delta: number
  isNext?: string
}

export class PopupState {
  page: PageType = 'popup'
  prayerTimes: PrayerTimeRendered[] = []
  currentGregorianDate = new Date()
  format = PrayerTimeFormat.TwelveHourFormat
  coordinates: LocationCoordinate | undefined = undefined
  prayTimesProvider: PrayTimesProvider
  prayerTimeNames = ['imsak', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

  constructor() {
    makeAutoObservable(this, {
      prayTimesProvider: false,
      coordinates: false,
      format: false,
      prayerTimeNames: false
    })

    this.init()
  }

  async init() {
    this.prayTimesProvider = new PrayTimesProvider('Jafari', prayTimeMessages)
    this.coordinates = (await browser.storage.sync.get(['coordinates'])).coordinates
    const times = this.getPrayerTimes()
    if (times) {
      runInAction(() => {
        this.prayerTimes = times
      })
    }
  }

  openOptions() {
    browser.runtime.openOptionsPage()
  }
  
  openTimetable() {
    browser.tabs.create({url: browser.runtime.getURL('/views/timetable.html'), active: true })
  }

  private getPrayerTimes() {
    if (!this.coordinates) {
      return undefined
    }
    const { latitude, longitude } = this.coordinates
    const times = this.prayTimesProvider.getTimes(new Date(), { latitude, longitude }, { format: this.format })

    const userTimes: PrayerTimeRendered[] = []
    const currentMinutes = this.currentTimeInMinutes()
    let delta = -1
    let foundNextPrayer = false

    for (const i in this.prayerTimeNames) {
      const name = prayTimeMessages.timeNames[this.prayerTimeNames[i]]
      const time = times[name.toLowerCase()]

      // Prayer time in minutes from day beginning.
      const prayerTimeMinutes = this.dateStringInMinutes(time)
      delta = prayerTimeMinutes - currentMinutes
0
      if (!foundNextPrayer && delta >= 0) {
        foundNextPrayer = true
        userTimes.push({ delta, name, time, isNext: this.getNextPrayerTime(delta) })
      } else {
        userTimes.push({ delta, name, time })
      }
    }

    return userTimes
  }

  private currentTimeInMinutes() {
    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    return 60 * h + m
  }

  private dateStringInMinutes(s: string) {
    const timeSplit = s.split(':')
    let h = parseInt(timeSplit[0])
    const m = parseInt(timeSplit[1])

    if (this.format == PrayerTimeFormat.TwelveHourFormat) {
      const isPm = s.split(' ')[1]== 'pm'
      h = isPm ? (12 + h) : h
    }

    return 60 * h + m
  }

  private getNextPrayerTime(delta: number) {
    const h = Math.floor(delta / 60)
    const m = delta - 60 * h
    // This is the countdown, we might use it for badge
    // const s = (m < 10) ? (h + ':0' + m) : (h + ':' + m)

    // This needs to be localized
    return (h > 0 ? h + ' hrs ' : '') + (m + ' min')
  }
}
