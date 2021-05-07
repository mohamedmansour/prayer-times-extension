import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { createUseStyles } from 'react-jss'
import { useTimetableState } from '../state'
import { PrayerMonthRendered } from '../state/timetable-state'

const useStyles = createUseStyles({
  month: {
    display: 'flex',
    flexDirection: 'column'
  },
  day: {
    display: 'flex',
    flexDirection: 'row'
  }
})

export const MonthView = observer(() => {
  const state = useTimetableState()
  const classes = useStyles()

  const monthString = new Intl.DateTimeFormat(navigator.language, {
    month: 'long',
    year: 'numeric'
  }).format(state.calendarDate)

  return (
    <div>
      <div>{monthString}</div>
      <div>
        <button onClick={() => state.gotoPreviousMonth()}>Previous</button>
        <button onClick={() => state.gotoToday()}>Today</button>
        <button onClick={() => state.gotoNextMonth()}>Next</button>
      </div>
      <div className={classes.month}>
        {state.data.map((day, idx) => (
          <DayRow key={idx} {...day} />
        ))}
      </div>
    </div>
  )
})

const useRowStyles = createUseStyles({
  day: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: (props: any) => (props.isToday ? 'red' : null)
  },
  time: {
    padding: 5
  }
})

export function DayRow(props: PrayerMonthRendered) {
  const classes = useRowStyles(props as any)

  return (
    <div className={classes.day}>
      <div className={classes.time}>{props.gregorianDay}</div>
      <div className={classes.time}>{props.hijriDate}</div>
      <div className={classes.time}>{props.times.imsak}</div>
      <div className={classes.time}>{props.times.fajr}</div>
      <div className={classes.time}>{props.times.sunrise}</div>
      <div className={classes.time}>{props.times.dhuhr}</div>
      <div className={classes.time}>{props.times.asr}</div>
      <div className={classes.time}>{props.times.sunset}</div>
      <div className={classes.time}>{props.times.maghrib}</div>
      <div className={classes.time}>{props.times.isha}</div>
      <div className={classes.time}>{props.times.midnight}</div>
    </div>
  )
}
