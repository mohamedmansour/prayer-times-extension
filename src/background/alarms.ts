import { Alarms, browser } from 'webextension-polyfill-ts'
import { PrayerTimeFormat, PrayTimesProvider } from '../shared/pray_time'
import { getSetting, Setting, Settings } from '../shared/settings'

export async function init() {
  browser.storage.onChanged.addListener(async (settings) => await onSettingsChanged(settings))
  browser.alarms.onAlarm.addListener(alarm => onAlarm(alarm))
}

async function onSettingsChanged(settings: Settings) {
  if (
    settings.calculation != undefined ||
    settings.currentPosition != undefined ||
    settings.timenames != undefined
  ) {
    await refreshAllAlarms()
  }
}

async function refreshAllAlarms() {
  await browser.alarms.clearAll()
  
  const settings = await getSetting([
    Setting.calculation,
    Setting.currentPosition,
    Setting.timenames
  ])

  // Reset to beginning of the day so we can get the number of ms
  const date = new Date()
  date.setHours(0, 1, 0, 0)

  const prayTimesProvider = new PrayTimesProvider(settings.calculation)
  const times = prayTimesProvider.getTimes(date, settings.currentPosition, {
    format: PrayerTimeFormat.Float
  })

  Object.keys(settings.timenames).forEach(timename => {
    const time = times[timename]
    browser.alarms.create(timename, {
      when: date.getTime() + (time * 60 * 60 * 1000)
    })
  })
}

function onAlarm(alarm: Alarms.Alarm) {
  console.log('Prayer Time is now!', alarm.name)
}