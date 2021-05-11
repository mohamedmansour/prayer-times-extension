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

    const currentDateTime = new Date()
    const prayTimesProvider = new PrayTimesProvider(this.settings.calculation)
    const times = prayTimesProvider.getTimes(currentDateTime, this.settings.currentPosition, {
      format: PrayerTimeFormat.Float
    })
    const userTimes: PrayerTimeRendered[] = []
    const currentMinutes = 60 * currentDateTime.getHours() + currentDateTime.getMinutes()

    let foundNextPrayer = false

    Object.keys(localizedMessages).forEach((key) => {
      if (!this.settings.timenames[key]) return

      const name = localizedMessages[key]
      const timeInFloat = times[name.toLowerCase()]
      const prayerTimeMinutes = Math.floor(timeInFloat * 60)
      const time = prayTimesProvider.getFormattedTime(timeInFloat, this.settings.timeformat) as string

      // Prayer time in minutes from day beginning.
      const delta = prayerTimeMinutes - currentMinutes

      if (!foundNextPrayer && delta >= 0) {
        foundNextPrayer = true
        userTimes.push({ delta, name, time, isNext: this.getNextPrayerTime(delta) })
      } else {
        userTimes.push({ delta, name, time })
      }
    })

    if (userTimes) {
      runInAction(() => {
        this.prayerTimes = userTimes
      })
    }
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
