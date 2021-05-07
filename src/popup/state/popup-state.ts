import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { PrayerTimes, PrayTimesProvider } from '../../shared/pray_time'
import { prayTimeMessages } from '../../shared/pray_time_messages'

type PageType = 'popup'

export class PopupState {
  page: PageType = 'popup'
  prayerTimes: Partial<PrayerTimes> = {}
  prayerTimeNames = ['fajr', 'dhuhr', 'maghrib']
  coordinates: Partial<GeolocationCoordinates> = {}
  prayTimesProvider: PrayTimesProvider

  constructor() {
    makeAutoObservable(this, {
      prayTimesProvider: false,
      coordinates: false
    })

    this.init()
  }

  async init() {
    this.prayTimesProvider = new PrayTimesProvider('Jafari', prayTimeMessages)
    const { latitude, longitude } = (await browser.storage.sync.get(['coordinates'])).coordinates
    runInAction(() => this.prayerTimes = this.prayTimesProvider.getTimes(new Date(), { latitude, longitude }))
  }
}
