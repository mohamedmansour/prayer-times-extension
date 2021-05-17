import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { getSetting, localizedPrayerTimeMessages, PrayerTimeFormat, PrayTimesProvider, Setting, Settings } from '../../shared'

type PageType = 'popup'

export interface PrayerTimeRendered {
  name: string
  time: string
  delta: number
}

export interface NextPrayerTimeRendered {
  name: string
  relativeTime: string
}

export class PopupState {
  page: PageType = 'popup'
  prayerTimes: PrayerTimeRendered[] = []
  nextPrayerTime: NextPrayerTimeRendered
  currentGregorianDate = new Date()
  settings: Settings
  prayersCompletedToday = false

  constructor() {
    makeAutoObservable(this, {})
    this.init()
  }

  async init() {
    browser.storage.onChanged.addListener(
      async (settings) => await this.onSettingsChanged(settings)
    )

    await this.fetchSettings()
    this.refreshPrayerTimes()
  }

  openOptions() {
    browser.runtime.openOptionsPage()
  }

  openTimetable() {
    browser.tabs.create({ url: browser.runtime.getURL('/views/timetable.html'), active: true })
  }

  private async onSettingsChanged(settings: Settings) {
    if (
      settings.calculation != undefined ||
      settings.currentPosition != undefined ||
      settings.timenames != undefined ||
      settings.timeformat != undefined ||
      settings.offsets != undefined
    ) {
      await this.fetchSettings()
      this.refreshPrayerTimes()
    }
  }

  private async fetchSettings() {
    this.settings = await getSetting([
      Setting.calculation,
      Setting.currentPosition,
      Setting.timenames,
      Setting.timeformat,
      Setting.offsets
    ])
  }

  private refreshPrayerTimes() {
    if (!this.settings.currentPosition) {
      return undefined
    }
    const currentDate = new Date()
    const prayerTimes = this.fetchPrayerTimesForDay(currentDate)
    let userTimes = prayerTimes.userTimes
    let nextTime = prayerTimes.nextPrayer
    if (!prayerTimes.nextPrayer) {
      currentDate.setDate(currentDate.getDate() + 1)
      const nextDayPrayerTimes = this.fetchPrayerTimesForDay(currentDate)
      userTimes = nextDayPrayerTimes.userTimes
      nextTime = nextDayPrayerTimes.nextPrayer
      // this.prayersCompletedToday = true // This needs more testing to add the badge when auto redirecting to second day
    }

    if (userTimes) {
      runInAction(() => {
        this.prayerTimes = userTimes
        this.nextPrayerTime = nextTime
      })
    }
  }

  private fetchPrayerTimesForDay(
    date: Date
  ): { userTimes: PrayerTimeRendered[]; nextPrayer: NextPrayerTimeRendered } {
    const prayTimesProvider = new PrayTimesProvider(this.settings.calculation)
    prayTimesProvider.tune(this.settings.offsets)
    const times = prayTimesProvider.getTimes(date, this.settings.currentPosition, {
      format: PrayerTimeFormat.Float
    })
    const userTimes: PrayerTimeRendered[] = []

    // Since this function figures out what the prayer times is for some date, calculate
    // how many days ahead it is so it can be added to the float times. The float times are
    // relative to the same day, so it must be normalized.
    const dayDiff = date.getDay() - new Date().getDay()
    const currentMinutes = 60 * date.getHours() + date.getMinutes()

    let nextPrayer: NextPrayerTimeRendered = undefined

    Object.keys(localizedPrayerTimeMessages).forEach((key) => {
      if (!this.settings.timenames[key]) return

      const name = localizedPrayerTimeMessages[key]

      // Add 24 hours if the day is the next day so the timings will be correct.
      const timeInFloat = times[name.toLowerCase()] + (dayDiff > 0 ? dayDiff * 24 : 0)
      const prayerTimeMinutes = Math.floor(timeInFloat * 60)
      const time = prayTimesProvider.getFormattedTime(
        timeInFloat,
        this.settings.timeformat
      ) as string

      // Prayer time in minutes from day beginning.
      const delta = prayerTimeMinutes - currentMinutes

      if (!nextPrayer && delta >= 0) {
        nextPrayer = { name, relativeTime: this.getNextPrayerTime(delta) }
        userTimes.push({ delta, name, time })
      } else {
        userTimes.push({ delta, name, time })
      }
    })

    return { userTimes, nextPrayer }
  }

  private getNextPrayerTime(delta: number) {
    const h = Math.floor(delta / 60)
    const m = delta - 60 * h
    const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' })

    if (h > 0) {
      return rtf.format(h, 'hours')
    }

    return rtf.format(m, 'minutes')
  }
}
