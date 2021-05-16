import { Alarms, browser } from 'webextension-polyfill-ts'
import { PrayerTimeFormat, PrayTimesProvider } from '../shared/pray_time'
import { getSetting, Setting, Settings } from '../shared/settings'

export async function init() {
  browser.storage.onChanged.addListener(async (settings) => await onSettingsChanged(settings))
  browser.alarms.onAlarm.addListener(alarm => onAlarm(alarm))
  await refreshAllAlarms()
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
  await createAlarmsForDay(new Date())
}

async function createAlarmsForDay(date: Date) {
  const settings = await getSetting([
    Setting.calculation,
    Setting.currentPosition,
    Setting.timenames
  ])

  // Reset to beginning of the day so we can get the number of ms
  date.setHours(0, 1, 0, 0)

  const prayTimesProvider = new PrayTimesProvider(settings.calculation)
  const times = prayTimesProvider.getTimes(date, settings.currentPosition, {
    format: PrayerTimeFormat.Float
  })

  Object.keys(settings.timenames).forEach(timename => {
    if (!settings.timenames[timename])
      return
    const time = times[timename]
    browser.alarms.create(timename, {
      when: date.getTime() + (time * 60 * 60 * 1000)
    })
  })
}

async function onAlarm(alarm: Alarms.Alarm) {
  const currentDate = new Date()

  // Alarams that are set in the past are automatically triggered here
  // So set a threshold of a minute, any alarms older than that wont
  // be notified.
  if ((currentDate.getTime() - alarm.scheduledTime) > 60*1000) {
    console.log('Prayer Time was in past!', alarm.name)
  } else {
    console.log('Prayer Time is now!', alarm.name)
  }
  
  // Check if there are any more remaining alarms, if not that implies that
  // all the alarams for today have been completed. Let's setup the alarms
  // for tomorrow.
  const remainingAlarms = await browser.alarms.getAll()
  if (!remainingAlarms.length) {
    currentDate.setDate(currentDate.getDate() + 1)
    await createAlarmsForDay(currentDate)
  }
}