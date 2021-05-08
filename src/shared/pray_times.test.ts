import { PrayTimesProvider, PrayerTimeMessages, PrayerTimeFormat, LocationCoordinate }  from './pray_time'

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
  expect((new PrayTimesProvider('Jafari', messages)).getMethod()).toBe('Jafari')
  expect((new PrayTimesProvider('Tehran', messages)).getMethod()).toBe('Tehran')
  expect((new PrayTimesProvider('Karachi', messages)).getMethod()).toBe('Karachi')
  expect((new PrayTimesProvider('Makkah', messages)).getMethod()).toBe('Makkah')
  expect((new PrayTimesProvider('Egypt', messages)).getMethod()).toBe('Egypt')
  expect((new PrayTimesProvider('ISNA', messages)).getMethod()).toBe('ISNA')
  expect((new PrayTimesProvider('MWL', messages)).getMethod()).toBe('MWL')
})

test('get times to be consistent', () => {
  const coord: LocationCoordinate = { latitude: 33.921340, longitude: -118.326580 }
  const date = new Date(1617302701 * 1000)
  const praytimes = new PrayTimesProvider('Jafari', messages)
  expect(praytimes.getTimes(date, coord, { timezone: -8, dst: true })).toStrictEqual({
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
  
  expect(praytimes.getTimes(date, coord,  { timezone: -8, dst: true, format: PrayerTimeFormat.TwelveHourFormat})).toStrictEqual({
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