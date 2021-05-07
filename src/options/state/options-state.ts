import { makeAutoObservable, runInAction } from 'mobx'
import { browser } from 'webextension-polyfill-ts'

type PageType = 'fre' | 'settings'

export class OptionsState {
  page: PageType = 'fre'
  coordinates: Partial<GeolocationCoordinates> = {}

  constructor() {
    makeAutoObservable(this, {})
    this.init()
  }

  async init() {
    const { coordinates } = await browser.storage.sync.get(['coordinates'])
    runInAction(async () => this.coordinates = coordinates)
  }

  queryLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords
          await browser.storage.sync.set({'coordinates': { latitude, longitude }})
          runInAction(() => this.coordinates = position.coords)
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
