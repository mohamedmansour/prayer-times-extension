import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { PrayerTimeFormat, PrayTimesProvider } from '../../shared/pray_time'
import { localizedMessages } from '../../shared/pray_time_messages'
import { getSetting, Setting, Settings } from '../../shared/settings'

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
  settings: Settings
  prayersCompletedToday: boolean

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
      settings[Setting.calculation] != undefined ||
      settings[Setting.currentPosition] != undefined ||
      settings[Setting.timenames] != undefined ||
      settings[Setting.timeformat] != undefined
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
      Setting.timeformat
    ])
  }

  private refreshPrayerTimes() {
    if (!this.settings.currentPosition) {
      return undefined
    }
    const currentDate = new Date()
    const prayerTimes = this.fetchPrayerTimesForDay(currentDate)
    let userTimes = prayerTimes.userTimes

    if (!prayerTimes.foundNextPrayer) {
      currentDate.setDate(currentDate.getDate() + 1)
      const nextDayPrayerTimes = this.fetchPrayerTimesForDay(currentDate)
      userTimes = nextDayPrayerTimes.userTimes
      // this.prayersCompletedToday = true // This needs more testing to add the badge when auto redirecting to second day
    }

    if (userTimes) {
      runInAction(() => {
        this.prayerTimes = userTimes
      })
    }
  }

  private fetchPrayerTimesForDay(
    date: Date
  ): { userTimes: PrayerTimeRendered[]; foundNextPrayer: boolean } {
    const prayTimesProvider = new PrayTimesProvider(this.settings.calculation)
    const times = prayTimesProvider.getTimes(date, this.settings.currentPosition, {
      format: PrayerTimeFormat.Float
    })
    const userTimes: PrayerTimeRendered[] = []
    const dayDiff = date.getDay() - new Date().getDay() + 1
    const currentMinutes = 60 * date.getHours() + date.getMinutes()

    let foundNextPrayer = false

    Object.keys(localizedMessages).forEach((key) => {
      if (!this.settings.timenames[key]) return

      const name = localizedMessages[key]
      const timeInFloat = times[name.toLowerCase()] + (dayDiff > 1 ? dayDiff * 24 : 0)
      console.log(date, name, timeInFloat)
      const prayerTimeMinutes = Math.floor(timeInFloat * 60)
      const time = prayTimesProvider.getFormattedTime(
        timeInFloat,
        this.settings.timeformat
      ) as string

      // Prayer time in minutes from day beginning.
      const delta = prayerTimeMinutes - currentMinutes

      if (!foundNextPrayer && delta >= 0) {
        foundNextPrayer = true
        userTimes.push({ delta, name, time, isNext: this.getNextPrayerTime(delta) })
      } else {
        userTimes.push({ delta, name, time })
      }
    })

    return { userTimes, foundNextPrayer }
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
