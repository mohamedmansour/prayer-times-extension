import * as React from 'react'
import { PrayerMonthRendered } from '../state/timetable-state'
import useStyles from './day-row.styles'

export function DayRow(props: PrayerMonthRendered) {
  const classes = useStyles()

  return (
    <tr className={classes.day + (props.isToday ? ' ' + classes.today : '')}>
      <td className={classes.time}>{props.gregorianDay}</td>
      <td className={classes.time}>{props.hijriDate}</td>
      <td className={classes.time}>{props.times.imsak}</td>
      <td className={classes.time}>{props.times.fajr}</td>
      <td className={classes.time}>{props.times.sunrise}</td>
      <td className={classes.time}>{props.times.dhuhr}</td>
      <td className={classes.time}>{props.times.asr}</td>
      <td className={classes.time}>{props.times.sunset}</td>
      <td className={classes.time}>{props.times.maghrib}</td>
      <td className={classes.time}>{props.times.isha}</td>
      <td className={classes.time}>{props.times.midnight}</td>
    </tr>
  )
}
