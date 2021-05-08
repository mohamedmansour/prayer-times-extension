/*
PrayTimes.js: Prayer Times Calculator (ver 3.0)
Copyright (C) 2007-2011 PrayTimes.org

Developers: Hamid Zarrabi-Zadeh (2007-2011)
            Mohamed Mansour (2010-present)

License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

//--------------------- Help and Manual ----------------------
/*

User's Manual:
http://praytimes.org/manual

Calculation Formulas:
http://praytimes.org/calculation


//------------------------ User Interface -------------------------

	getTimes (date, coordinates [, timeZone [, dst [, timeFormat]]])

	setMethod (method)       // set calculation method
	adjust (parameters)      // adjust calculation parameters
	tune (offsets)           // tune times by given offsets
  setFormat(format)        // change the time format
	getMethod ()             // get calculation method
	getSetting ()            // get current calculation parameters
	getOffsets ()            // get current time offsets


//------------------------- Sample Usage --------------------------


	const PT = new PrayTimes('ISNA');
	const times = PT.getTimes(new Date(), [43, -80], -5);
	document.write('Sunrise = '+ times.sunrise)

*/

// Asr Juristic Methods
export enum AsrJuristic {
  Standard = 1, // Shafi`i, Maliki, Ja`fari, Hanbali
  Hanafi = 2, // Hanafi
}

// Midnight Mode
export enum MidnightMethod {
  Standard, // Mid Sunset to Sunrise
  Jafari, // Mid Sunset to Fajr
}

// Adjust Methods for Higher Latitudes
export enum HighLatMethod {
  NightMiddle, // middle of night
  AngleBased, // angle/60th of night
  OneSeventh, // 1/7th of night
  None, // No adjustment
}

export interface LocationCoordinate {
  latitude: number
  longitude: number
  elevation?: number
}

// Time Formats
export enum PrayerTimeFormat {
  TwentyFourFormat,
  TwelveHourFormat,
  TwelveHourFormatWithNoSuffix,
  Float, // floating point number
}

export interface TimeNamesMessages {
  imsak: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  sunset: string
  maghrib: string
  isha: string
  midnight: string
}

export interface TimeSuffixesMessages {
  am: string
  pm: string
}

export interface PrayerTimeMessages {
  timeNames: TimeNamesMessages
  timeSuffixes: TimeSuffixesMessages
}

export interface PrayerTimes {
  imsak: number
  fajr: number
  sunrise: number
  dhuhr: number
  asr: number
  sunset: number
  maghrib: number
  isha: number
  midnight?: number
}

// Calculation Methods
interface CalculationMethod {
  name: string
  params: CalculationMethodSetting
}

enum Direction {
  ClockWise,
  CounterClockWise,
}

interface CalculationMethodSetting {
  imsak: string | number
  fajr?: string | number
  dhuhr?: string | number
  asr: AsrJuristic
  maghrib: string | number
  isha?: string | number
  midnight?: MidnightMethod
  highLats?: HighLatMethod
}

interface ShortDate {
  year: number
  month: number
  day: number
}

interface TimeQuery {
  timezone?: number,
  dst?: boolean,
  format?: PrayerTimeFormat
}

const CalculationMethods: { [method: string]: CalculationMethod } = {
  MWL: {
    name: 'Muslim World League',
    params: { imsak: '10 min', fajr: 18, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: '0 min', isha: 17, midnight: MidnightMethod.Standard, highLats: HighLatMethod.NightMiddle  },
  },
  ISNA: {
    name: 'Islamic Society of North America (ISNA)',
    params: { imsak: '10 min', fajr: 15, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: '0 min', isha: 15, midnight: MidnightMethod.Standard, highLats: HighLatMethod.NightMiddle  },
  },
  Egypt: {
    name: 'Egyptian General Authority of Survey',
    params: { imsak: '10 min', fajr: 19.5, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: '0 min', isha: 17.5, midnight: MidnightMethod.Standard, highLats: HighLatMethod.NightMiddle  },
  },
  Makkah: {
    name: 'Umm Al-Qura University, Makkah',
    params: { imsak: '10 min', fajr: 18.5, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: '0 min', isha: '90 min', midnight: MidnightMethod.Standard, highLats: HighLatMethod.NightMiddle  },
  }, // fajr was 19 degrees before 1430 hijri
  Karachi: {
    name: 'University of Islamic Sciences, Karachi',
    params: { imsak: '10 min', fajr: 18, dhuhr: '0 min',asr: AsrJuristic.Standard,  maghrib: '0 min', isha: 18, midnight: MidnightMethod.Standard, highLats: HighLatMethod.NightMiddle  },
  },
  Tehran: {
    name: 'Institute of Geophysics, University of Tehran',
    params: { imsak: '10 min', fajr: 17.7, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: 4.5, isha: 14, midnight: MidnightMethod.Jafari, highLats: HighLatMethod.NightMiddle  },
  }, // isha is not explicitly specified in this method
  Jafari: {
    name: 'Shia Ithna-Ashari, Leva Institute, Qum',
    params: { imsak: '10 min', fajr: 16, dhuhr: '0 min', asr: AsrJuristic.Standard, maghrib: 4, isha: 14, midnight: MidnightMethod.Jafari, highLats: HighLatMethod.NightMiddle },
  },
}

//----------------------- PrayTimes Class ------------------------

export class PrayTimesProvider {
  // Calculation Methods
  private methods = CalculationMethods

  private calcMethod = 'ISNA'
  private timeFormat = PrayerTimeFormat.TwentyFourFormat
  private InvalidTime = '-----'
  private numIterations = 1
  private offset: PrayerTimes = { imsak: 0, fajr: 0, asr: 0, dhuhr: 0, isha: 0, maghrib: 0, sunrise: 0, sunset: 0, midnight: 0 }
  private setting: CalculationMethodSetting
  //----------------------- Local Variables ---------------------

  private lat: number
  private lng: number
  private elv: number // coordinates
  private timeZone: number
  private julianDate: number // time variables

  //---------------------- Initialization -----------------------
  constructor(method: string, public messages: PrayerTimeMessages) {
    // initialize settings
    this.calcMethod = this.methods[method] ? method : this.calcMethod
    this.setting = this.methods[method].params
  }

  //----------------------- Public Functions ------------------------
  // set calculation method
  setMethod(method: string) {
    if (this.methods[method]) {
      this.adjust(this.methods[method].params)
      this.calcMethod = method
    }
  }

  // set calculating parameters
  adjust(params: CalculationMethodSetting): void {
    for (const id in params) this.setting[id] = params[id]
  }

  // set time offsets
  tune(timeOffsets: PrayerTimes): void {
    for (const i in timeOffsets) this.offset[i] = timeOffsets[i]
  }

  // set time format method.
  timeformat(format: PrayerTimeFormat) {
    this.timeFormat = format
  }

  // get current calculation method
  getMethod(): string {
    return this.calcMethod
  }

  // get current setting
  getSetting(): CalculationMethodSetting {
    return this.setting
  }

  // get current time offsets
  getOffsets(): PrayerTimes {
    return this.offset
  }

  // get default calc parametrs
  getDefaults() {
    return this.methods
  }

  // return prayer times for a given date
  getTimes(
    date: Date,
    coords: LocationCoordinate,
    options?: TimeQuery
  ): PrayerTimes {
    let timezone: number | undefined = options?.timezone
    let dst: boolean | undefined = options?.dst

    this.lat = coords.latitude
    this.lng = coords.longitude
    this.elv = coords.elevation || 0
    this.timeFormat = options?.format || this.timeFormat

    const shortDate: ShortDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }

    if (typeof timezone == 'undefined') timezone = this.getTimeZone(shortDate)
    if (typeof dst == 'undefined') dst = this.isDstObserved(shortDate)

    this.timeZone = 1 * timezone + (dst ? 1 : 0)
    this.julianDate = this.julian(shortDate) - this.lng / (15 * 24)

    return this.computeTimes()
  }

  // convert float time to the given format (see timeFormats)
  private getFormattedTime(time: number, format: PrayerTimeFormat) {
    if (isNaN(time)) return this.InvalidTime
    if (format == PrayerTimeFormat.Float) return time
    const suffixes = [this.messages.timeSuffixes.am, this.messages.timeSuffixes.pm]

    time = DegreeMath.fixHour(time + 0.5 / 60) // add 0.5 minutes to round
    const hours = Math.floor(time)
    const minutes = Math.floor((time - hours) * 60)
    const suffix = format == PrayerTimeFormat.TwelveHourFormat ? suffixes[hours < 12 ? 0 : 1] : ''
    const hour =
      format == PrayerTimeFormat.TwentyFourFormat
        ? this.twoDigitsFormat(hours)
        : ((hours + 12 - 1) % 12) + 1
    return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '')
  }

  //---------------------- Calculation Functions -----------------------

  // compute mid-day time
  private midDay(time: number) {
    const eqt = this.sunPosition(this.julianDate + time).equation
    const noon = DegreeMath.fixHour(12 - eqt)
    return noon
  }

  // compute the time at which sun reaches a specific angle below horizon
  private sunAngleTime(angle: number, time: number, direction: Direction = Direction.ClockWise) {
    const decl = this.sunPosition(this.julianDate + time).declination
    const noon = this.midDay(time)
    const t =
      (1 / 15) *
      DegreeMath.arccos(
        (-DegreeMath.sin(angle) - DegreeMath.sin(decl) * DegreeMath.sin(this.lat)) /
          (DegreeMath.cos(decl) * DegreeMath.cos(this.lat))
      )
    return noon + (direction == Direction.CounterClockWise ? -t : t)
  }

  // compute asr time
  private asrTime(factor: number, time: number) {
    const decl = this.sunPosition(this.julianDate + time).declination
    const angle = -DegreeMath.arccot(factor + DegreeMath.tan(Math.abs(this.lat - decl)))
    return this.sunAngleTime(angle, time)
  }

  // compute declination angle of sun and equation of time
  // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
  private sunPosition(jd: number) {
    const D = jd - 2451545.0
    const g = DegreeMath.fixAngle(357.529 + 0.98560028 * D)
    const q = DegreeMath.fixAngle(280.459 + 0.98564736 * D)
    const L = DegreeMath.fixAngle(q + 1.915 * DegreeMath.sin(g) + 0.02 * DegreeMath.sin(2 * g))

    // const R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g)
    const e = 23.439 - 0.00000036 * D

    const RA = DegreeMath.arctan2(DegreeMath.cos(e) * DegreeMath.sin(L), DegreeMath.cos(L)) / 15
    const eqt = q / 15 - DegreeMath.fixHour(RA)
    const decl = DegreeMath.arcsin(DegreeMath.sin(e) * DegreeMath.sin(L))

    return { declination: decl, equation: eqt }
  }

  // convert Gregorian date to Julian day
  // Ref: Astronomical Algorithms by Jean Meeus: 2440587.5 days + UNIX TIME in days === Julian Day
  private julian(date: ShortDate): number {
    // We could do this approach  but it will be off by 1 minute.
    // const numberOfMillisecondsInDay = 86400000
    // const oneTenthOfDayInMinutes = 1440
    // return (
    //   date.getTime() / numberOfMillisecondsInDay -
    //   date.getTimezoneOffset() / oneTenthOfDayInMinutes +
    //   2440587.5
    // )
    let { year, month } = date
    if (month <= 2) {
      year -= 1
      month += 12
    }
    const A = Math.floor(year / 100)
    const B = 2 - A + Math.floor(A / 4)

    const JD =
      Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) +  date.day + B - 1524.5
    return JD
  }

  //---------------------- Compute Prayer Times -----------------------

  // compute prayer times at given julian date
  private computePrayerTimes(times: PrayerTimes): PrayerTimes {
    const dayTimes = this.dayPortion(times)

    return {
      imsak: this.sunAngleTime(
        this.eval(this.setting.imsak),
        dayTimes.imsak,
        Direction.CounterClockWise
      ),
      fajr: this.sunAngleTime(
        this.eval(this.setting.fajr),
        dayTimes.fajr,
        Direction.CounterClockWise
      ),
      sunrise: this.sunAngleTime(this.riseSetAngle(), dayTimes.sunrise, Direction.CounterClockWise),
      dhuhr: this.midDay(dayTimes.dhuhr),
      asr: this.asrTime(this.asrFactor(this.setting.asr), dayTimes.asr),
      sunset: this.sunAngleTime(this.riseSetAngle(), dayTimes.sunset),
      maghrib: this.sunAngleTime(this.eval(this.setting.maghrib), dayTimes.maghrib),
      isha: this.sunAngleTime(this.eval(this.setting.isha), dayTimes.isha),
    }
  }

  // compute prayer times
  private computeTimes(): PrayerTimes {
    // default times
    let times: PrayerTimes = {
      imsak: 5,
      fajr: 5,
      sunrise: 6,
      dhuhr: 12,
      asr: 13,
      sunset: 18,
      maghrib: 18,
      isha: 18,
    }

    // main iterations
    for (let i = 1; i <= this.numIterations; i++) times = this.computePrayerTimes(times)

    times = this.adjustTimes(times)

    // add midnight time
    times.midnight =
      this.setting.midnight == MidnightMethod.Jafari
        ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2
        : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2

    times = this.tuneTimes(times)
    return this.modifyFormats(times)
  }

  // adjust times
  private adjustTimes(times: PrayerTimes): PrayerTimes {
    for (const i in times) times[i] += this.timeZone - this.lng / 15

    if (this.setting.highLats != HighLatMethod.None) times = this.adjustHighLats(times)

    if (this.isMin(this.setting.imsak))
      times.imsak = times.fajr - this.eval(this.setting.imsak) / 60
    if (this.isMin(this.setting.maghrib))
      times.maghrib = times.sunset + this.eval(this.setting.maghrib) / 60
    if (this.isMin(this.setting.isha))
      times.isha = times.maghrib + this.eval(this.setting.isha) / 60
    times.dhuhr += this.eval(this.setting.dhuhr) / 60

    return times
  }

  // get asr shadow factor
  private asrFactor(asrParam: AsrJuristic): number {
    const factor: number = asrParam.valueOf()
    return factor || this.eval(asrParam)
  }

  // return sun angle for sunset/sunrise
  private riseSetAngle(): number {
    //var earthRad = 6371009; // in meters
    //var angle = DMath.arccos(earthRad/(earthRad+ elv));
    const angle = 0.0347 * Math.sqrt(this.elv) // an approximation
    return 0.833 + angle
  }

  // apply offsets to the times
  private tuneTimes(times: PrayerTimes): PrayerTimes {
    for (const i in times) times[i] += this.offset[i] / 60
    return times
  }

  // convert times to given time format
  private modifyFormats(times: PrayerTimes) {
    for (const i in times) times[i] = this.getFormattedTime(times[i], this.timeFormat)
    return times
  }

  // adjust times for locations in higher latitudes
  private adjustHighLats(times: PrayerTimes) {
    const params = this.setting
    const nightTime = this.timeDiff(times.sunset, times.sunrise)

    times.imsak = this.adjustHLTime(
      times.imsak,
      times.sunrise,
      this.eval(params.imsak),
      nightTime,
      Direction.CounterClockWise
    )
    times.fajr = this.adjustHLTime(
      times.fajr,
      times.sunrise,
      this.eval(params.fajr),
      nightTime,
      Direction.CounterClockWise
    )
    times.isha = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha), nightTime)
    times.maghrib = this.adjustHLTime(
      times.maghrib,
      times.sunset,
      this.eval(params.maghrib),
      nightTime
    )

    return times
  }

  // adjust a time for higher latitudes
  private adjustHLTime(
    time: number,
    base: number,
    angle: number,
    night: number,
    direction: Direction = Direction.ClockWise
  ) {
    const portion = this.nightPortion(angle, night)
    const timeDiff =
      direction == Direction.CounterClockWise
        ? this.timeDiff(time, base)
        : this.timeDiff(base, time)
    if (isNaN(time) || timeDiff > portion)
      time = base + (direction == Direction.CounterClockWise ? -portion : portion)
    return time
  }

  // the night portion used for adjusting times in higher latitudes
  private nightPortion(angle: number, night: number) {
    const method = this.setting.highLats
    let portion = 1 / 2 // MidNight
    if (method == HighLatMethod.AngleBased) portion = (1 / 60) * angle
    if (method == HighLatMethod.OneSeventh) portion = 1 / 7
    return portion * night
  }

  // convert hours to day portions
  private dayPortion(times: PrayerTimes) {
    for (const i in times) times[i] /= 24
    return times
  }

  //---------------------- Time Zone Functions -----------------------

  // get local time zone
  private getTimeZone(date: ShortDate) {
    const year = date.year
    const t1 = this.gmtOffset({ year, month: 0, day: 1 })
    const t2 = this.gmtOffset({ year, month: 6, day: 1 })
    return Math.min(t1, t2)
  }

  // get daylight saving for a given date
  private isDstObserved(date: ShortDate): boolean {
    return this.gmtOffset(date) != this.getTimeZone(date)
  }

  // GMT offset for a given date
  private gmtOffset(date: ShortDate): number {
    const localDate = new Date(date.year, date.month - 1, date.day, 12, 0, 0, 0)
    return (localDate.getTimezoneOffset() / 60) * -1
  }

  //---------------------- Misc Functions -----------------------

  // convert given string into a number
  private eval(str: string | number | undefined) {
    return 1 * parseInt((str + '').split(/[^0-9.+-]/)[0])
  }

  // detect if input contains 'min'
  private isMin(arg: string | number | undefined) {
    return (arg + '').indexOf('min') != -1
  }

  // compute the difference between two times
  private timeDiff(time1: number, time2: number) {
    return DegreeMath.fixHour(time2 - time1)
  }

  // add a leading 0 if necessary
  private twoDigitsFormat(num: number) {
    return num < 10 ? '0' + num : num
  }
}

//---------------------- Degree-Based Math Class -----------------------

class DegreeMath {
  static sin(degree: number): number {
    return Math.sin(this.degreesToRadians(degree))
  }
  static cos(degree: number): number {
    return Math.cos(this.degreesToRadians(degree))
  }
  static tan(degree: number): number {
    return Math.tan(this.degreesToRadians(degree))
  }

  static arcsin(degree: number): number {
    return this.radiansToDegrees(Math.asin(degree))
  }
  static arccos(degree: number): number {
    return this.radiansToDegrees(Math.acos(degree))
  }
  static arctan(degree: number): number {
    return this.radiansToDegrees(Math.atan(degree))
  }

  static arccot(x: number): number {
    return this.radiansToDegrees(Math.atan(1 / x))
  }
  static arctan2(y: number, x: number): number {
    return this.radiansToDegrees(Math.atan2(y, x))
  }

  static fixAngle(angle: number): number {
    return this.fix(angle, 360)
  }
  static fixHour(angle: number): number {
    return this.fix(angle, 24)
  }

  private static degreesToRadians(degree: number): number {
    return (degree * Math.PI) / 180.0
  }
  private static radiansToDegrees(radian: number): number {
    return (radian * 180.0) / Math.PI
  }

  private static fix(a: number, b: number): number {
    a = a - b * Math.floor(a / b)
    return a < 0 ? a + b : a
  }
}
