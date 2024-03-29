import { makeAutoObservable } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate, getSetting, PrayerTimes, PrayTimesProvider, Setting, Settings } from '../../shared'

type PageType = 'timetable'

export interface PrayerMonthRendered {
  gregorianDay: number
  hijriDate: string
  times: PrayerTimes
  isToday?: boolean
}

export class TimetableState {
  page: PageType = 'timetable'
  data: PrayerMonthRendered[] = []
  settings: Settings
  gregorianDate = new Date()

  constructor() {
    makeAutoObservable(this, {})
    this.init()
  }

  async init() {
    browser.storage.onChanged.addListener(
      async (settings) => await this.onSettingsChanged(settings)
    )
    
    await this.fetchSettings()
    this.refreshData()
  }

  /**
   * |month| starts at 0
   */
  refreshData() {
    if (!this.settings.currentPosition) {
      return undefined
    }

    const year = this.gregorianDate.getFullYear()
    const month = this.gregorianDate.getMonth()
    const date = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 1)
    const today = new Date()
    const prayTimesProvider = new PrayTimesProvider(this.settings.calculation)
    prayTimesProvider.tune(this.settings.offsets)

    const data: PrayerMonthRendered[] = []
    while (date < endDate) {
      const times = prayTimesProvider.getTimes(
        date,
        this.settings.currentPosition,
        { format: this.settings.timeformat }
      )

      const isToday = date.getMonth() == today.getMonth() && date.getDate() == today.getDate()
      
      data.push({
        times,
        isToday,
        gregorianDay: date.getDate(),
        hijriDate: getHijriDate(date, { showYear: false })
      })
      
      date.setDate(date.getDate() + 1) // next day
    }

    this.data = data
  }

  gotoNextMonth() {
    this.gregorianDate.setMonth(this.gregorianDate.getMonth() + 1)
    this.refreshData()
  }

  gotoPreviousMonth() {
    this.gregorianDate.setMonth(this.gregorianDate.getMonth() - 1)
    this.refreshData()
  }

  gotoToday() {
    this.gregorianDate = new Date()
    this.refreshData()
  }
  
  private async onSettingsChanged(settings: Settings) {
    if (
      settings.calculation != undefined ||
      settings.currentPosition != undefined ||
      settings.timeformat != undefined ||
      settings.offsets != undefined
    ) {
      await this.fetchSettings()
      this.refreshData()
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
}
