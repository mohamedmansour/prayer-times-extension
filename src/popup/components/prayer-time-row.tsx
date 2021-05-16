import * as React from 'react'
import { PrayerTimeRendered } from '../state/popup-state'
import { ActiveTimeBadge } from './active-time-badge'
import useStyles from './prayer-time-row.styles'

export function PrayerTimeRow(props: PrayerTimeRendered) {
  const classes = useStyles()
  return (
    <div className={classes.item}>
      {props.isNext && (<ActiveTimeBadge>{props.isNext}</ActiveTimeBadge>)}
      <div
        className={
          classes.timeEntry +
          (props.isNext ? ' ' + classes.active : '') +
          (props.delta < 0 ? ' ' + classes.done : '')
        }
      >
        <span className={classes.prayerName}>{props.name}</span>
        <span className={classes.prayerTime}>{props.time}</span>
      </div>
    </div>
  )
}