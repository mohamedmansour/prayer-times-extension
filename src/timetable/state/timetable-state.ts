import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import {
  LocationCoordinate,
  PrayerTimeFormat,
  PrayerTimes,
  PrayTimesProvider
} from '../../shared/pray_time'
import { prayTimeMessages } from '../../shared/pray_time_messages'

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

  calendarDate: Date = new Date()
  coordinates: LocationCoordinate | undefined = undefined
  format = PrayerTimeFormat.TwelveHourFormat
  prayTimesProvider: PrayTimesProvider

  constructor() {
    makeAutoObservable(this, {
      prayTimesProvider: false,
      format: false,
      coordinates: false
    })
    this.init()
  }

  async init() {
    this.prayTimesProvider = new PrayTimesProvider('Jafari', prayTimeMessages)

    const { coordinates } = await browser.storage.sync.get(['coordinates'])
    runInAction(async () => (this.coordinates = coordinates))

    this.generateData(this.calendarDate.getFullYear(), this.calendarDate.getMonth())
  }

  /**
   * |month| starts at 0
   */
  generateData(year: number, month: number) {
    if (!this.coordinates) {
      return undefined
    }

    const { latitude, longitude } = this.coordinates
    const date = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 1)
    const today = new Date()

    const data: PrayerMonthRendered[] = []
    while (date < endDate) {
      const times = this.prayTimesProvider.getTimes(
        date,
        { latitude, longitude },
        { format: this.format }
      )

      const isToday = date.getMonth() == today.getMonth() && date.getDate() == today.getDate()
      
      data.push({
        times,
        isToday,
        gregorianDay: date.getDate(),
        hijriDate: getHijriDate(date)
      })
      
      date.setDate(date.getDate() + 1) // next day
    }

    this.data = data
  }

  gotoNextMonth() {
    this.calendarDate.setMonth(this.calendarDate.getMonth() + 1)
    this.generateData(this.calendarDate.getFullYear(), this.calendarDate.getMonth())
  }

  gotoPreviousMonth() {
    this.calendarDate.setMonth(this.calendarDate.getMonth() - 1)
    this.generateData(this.calendarDate.getFullYear(), this.calendarDate.getMonth())
  }

  gotoToday() {
    this.calendarDate = new Date()
    this.generateData(this.calendarDate.getFullYear(), this.calendarDate.getMonth())

  }
}