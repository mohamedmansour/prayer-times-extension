import { PrayTimes, PrayerTimeMessages, PrayerTimeFormat, LocationCoordinate }  from './pray_time'

import * as sinon from 'sinon'

global.chrome = global.chrome || {
  i18n: {
    getMessage: sinon.spy(name => name),
  }
}

const messages: PrayerTimeMessages = {
  timeNames: {
    imsak: 'imsak',
    fajr: 'fajr',
    sunrise: 'sunrise',
    dhuhr: 'dhuhr',
    asr: 'asr',
    sunset: 'sunset',
    maghrib: 'maghrib',
    isha: 'isha',
    midnight: 'midnight',
  },
  timeSuffixes: {
    am: 'am',
    pm: 'pm'
  }
}

test('time methods are set correctly', () => {
  expect((new PrayTimes('Jafari', messages)).getMethod()).toBe('Jafari')
  expect((new PrayTimes('Tehran', messages)).getMethod()).toBe('Tehran')
  expect((new PrayTimes('Karachi', messages)).getMethod()).toBe('Karachi')
  expect((new PrayTimes('Makkah', messages)).getMethod()).toBe('Makkah')
  expect((new PrayTimes('Egypt', messages)).getMethod()).toBe('Egypt')
  expect((new PrayTimes('ISNA', messages)).getMethod()).toBe('ISNA')
  expect((new PrayTimes('MWL', messages)).getMethod()).toBe('MWL')
})

test('get times to be consistent', () => {
  const coord: LocationCoordinate = { latitude: 33.921340, longitude: -118.326580 }
  const date = new Date(1617302701 * 1000)
  const praytimes = new PrayTimes('Jafari', messages)
  expect(praytimes.getTimes(date, coord, -8, true)).toStrictEqual({
    imsak: '05:15',
    fajr: '05:25',
    sunrise: '06:40',
    dhuhr: '12:57',
    asr: '16:30',
    sunset: '19:14',
    maghrib: '19:30',
    isha: '20:19',
    midnight: '00:20'
  })
  
  expect(praytimes.getTimes(date, coord, -8, true, PrayerTimeFormat.TwelveHourFormat)).toStrictEqual({
    imsak: '5:15 am',
    fajr: '5:25 am',
    sunrise: '6:40 am',
    dhuhr: '12:57 pm',
    asr: '4:30 pm',
    sunset: '7:14 pm',
    maghrib: '7:30 pm',
    isha: '8:19 pm',
    midnight: '12:20 am'
  })
})