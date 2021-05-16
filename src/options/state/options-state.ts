import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'
import { getSetting, setSetting, Setting, Settings } from '../../shared/settings'

type PageType = 'fre' | 'settings'

export class OptionsState {
  page: PageType = 'fre'
  settings: Settings = null

  constructor() {
    makeAutoObservable(this, {})
    this.init()
  }

  async init() {
    const settings = await getSetting<Settings>([
      Setting.currentPosition,
      Setting.timeformat,
      Setting.calculation,
      Setting.timenames,
      Setting.offsets
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
          if (
            this.settings &&
            this.settings.currentPosition.latitude == latitude &&
            this.settings.currentPosition.longitude == longitude
          )
            return
          await setSetting(Setting.currentPosition, { latitude, longitude })
          runInAction(() => (this.settings.currentPosition = position.coords))
        },
        (positionError: GeolocationPositionError) => {
          console.error('Geolocation Error', positionError)
        }
      )
    } else {
      console.error('Geolocation Not supported')
    }
  }

  async updateTimename(timename: string, checked: boolean) {
    const timenames = { ...this.settings.timenames, [timename]: checked }
    await this.updateSetting(Setting.timenames, timenames)
  }

  async updateSetting<T>(setting: Setting, value: T) {
    this.settings[setting.toString()] = value
    await setSetting(setting, value)
    await browser.storage.sync.set({ [setting]: value })
  }

  async toggleAllTimenames(checked: boolean) {
    const timenames = Object.keys(this.settings.timenames).reduce((prev, current) => {
      prev[current] = checked
      return prev
    }, {})
    await this.updateSetting(Setting.timenames, timenames)
  }

  async updateTimeNameOffset(timename: string, value: number) {
    const offsets = { ...this.settings.offsets, [timename]: value }
    await this.updateSetting(Setting.offsets, offsets)
  }
}
