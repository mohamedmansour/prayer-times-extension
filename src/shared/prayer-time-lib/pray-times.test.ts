import { PrayTimesProvider, PrayerTimeFormat, LocationCoordinate, CalculationName }  from './pray-time'

const coord: LocationCoordinate = { latitude: 33.921340, longitude: -118.326580 }
const date = new Date(1617302701 * 1000)
const options = { timezone: -8, dst: true }

test('time methods are set correctly', () => {
  expect((new PrayTimesProvider(CalculationName.Jafari)).getMethod()).toBe(CalculationName.Jafari)
  expect((new PrayTimesProvider(CalculationName.Tehran)).getMethod()).toBe(CalculationName.Tehran)
  expect((new PrayTimesProvider(CalculationName.Karachi)).getMethod()).toBe(CalculationName.Karachi)
  expect((new PrayTimesProvider(CalculationName.Makkah)).getMethod()).toBe(CalculationName.Makkah)
  expect((new PrayTimesProvider(CalculationName.Egypt)).getMethod()).toBe(CalculationName.Egypt)
  expect((new PrayTimesProvider(CalculationName.ISNA)).getMethod()).toBe(CalculationName.ISNA)
  expect((new PrayTimesProvider(CalculationName.MWL)).getMethod()).toBe(CalculationName.MWL)
})

test('get times to be consistent', () => {
  const praytimes = new PrayTimesProvider(CalculationName.Jafari)
  expect(praytimes.getTimes(date, coord, options)).toStrictEqual({
    imsak: '05:15',
    fajr: '05:25',
    sunrise: '06:40',
    dhuhr: '12:57',
    asr: '16:30',
    sunset: '19:14',
    maghrib: '19:30',
    isha: '20:19',
    midnight: '24:20'
  })
  
  expect(praytimes.getTimes(date, coord,  { ...options, format: PrayerTimeFormat.TwelveHourFormat})).toStrictEqual({
    imsak: '5:15 AM',
    fajr: '5:25 AM',
    sunrise: '6:40 AM',
    dhuhr: '12:57 PM',
    asr: '4:30 PM',
    sunset: '7:14 PM',
    maghrib: '7:30 PM',
    isha: '8:19 PM',
    midnight: '12:20 AM'
  })
})

test('tune offset times', () => {
  const praytimes = new PrayTimesProvider(CalculationName.Jafari)
  praytimes.tune({
    fajr: 0,
    dhuhr: 3,
    asr: -1,
    maghrib: 10,
    isha: -2
  })
  expect(praytimes.getTimes(date, coord, options)).toStrictEqual({
    imsak: '05:15',
    fajr: '05:25',
    sunrise: '06:40',
    dhuhr: '13:00',
    asr: '16:29',
    sunset: '19:14',
    maghrib: '19:40',
    isha: '20:17',
    midnight: '24:20'
  })
})

test('adjust settings', () => {
  const praytimes = new PrayTimesProvider(CalculationName.Jafari)
  const settings = praytimes.getSettings()
  settings.fajr = 15.5 // Change angle
  praytimes.adjust(settings)

  expect(praytimes.getTimes(date, coord, options)).toStrictEqual({
    imsak: '05:21',
    fajr: '05:31',
    sunrise: '06:40',
    dhuhr: '12:57',
    asr: '16:30',
    sunset: '19:14',
    maghrib: '19:30',
    isha: '20:19',
    midnight: '24:22'
  })

  settings.dhuhr = '10 min' // Add 10 minutes (similar to offsets)
  praytimes.adjust(settings)
  expect(praytimes.getTimes(date, coord, options)).toStrictEqual({
    imsak: '05:21',
    fajr: '05:31',
    sunrise: '06:40',
    dhuhr: '13:07',
    asr: '16:30',
    sunset: '19:14',
    maghrib: '19:30',
    isha: '20:19',
    midnight: '24:22'
  })
})