import * as React from 'react'
import { PrayerTimeRendered } from '../state/popup-state'
import useStyles from './prayer-time-row.styles'

export function PrayerTimeRow(props: PrayerTimeRendered) {
  const classes = useStyles()
  return (
    <div className={classes.item}>
      <span className={classes.prayerName}>{props.name}</span>
      <span className={classes.prayerTime}>{props.time}</span>
    </div>
  )
}
