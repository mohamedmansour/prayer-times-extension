import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { createUseStyles } from 'react-jss'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import { prayTimeMessages } from '../../shared/pray_time_messages'
import { useTimetableState } from '../state'
import { PrayerMonthRendered } from '../state/timetable-state'

const useStyles = createUseStyles({
  month: {
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
    '& th, & td': {
      padding: 5,
      textAlign: 'center'
    }
  }
})

export const localizationTimetable = {
  gregorianDay: browser.i18n.getMessage('gregorianDay'),
  hijriDay: browser.i18n.getMessage('hijriDay'),
}

export const MonthView = observer(() => {
  const state = useTimetableState()
  const classes = useStyles()

  const gregorianDateString = new Intl.DateTimeFormat(navigator.language, {
    month: 'long',
    year: 'numeric'
  }).format(state.gregorianDate)

  const hijriDateString = getHijriDate(state.gregorianDate, { showDay: false })

  return (
    <div>
      <div>{gregorianDateString} ({hijriDateString})</div>
      <div>
        <button onClick={() => state.gotoPreviousMonth()}>Previous</button>
        <button onClick={() => state.gotoToday()}>Today</button>
        <button onClick={() => state.gotoNextMonth()}>Next</button>
      </div>
      <table className={classes.month}>
        <thead>
          <tr>
            <th>{localizationTimetable.gregorianDay}</th>
            <th>{localizationTimetable.hijriDay}</th>
            <th>{prayTimeMessages.timeNames.imsak}</th>
            <th>{prayTimeMessages.timeNames.fajr}</th>
            <th>{prayTimeMessages.timeNames.sunrise}</th>
            <th>{prayTimeMessages.timeNames.dhuhr}</th>
            <th>{prayTimeMessages.timeNames.asr}</th>
            <th>{prayTimeMessages.timeNames.sunset}</th>
            <th>{prayTimeMessages.timeNames.maghrib}</th>
            <th>{prayTimeMessages.timeNames.isha}</th>
            <th>{prayTimeMessages.timeNames.midnight}</th>
          </tr>
        </thead>
        <tbody>
          {state.data.map((day, idx) => (
            <DayRow key={idx} {...day} />
          ))}
        </tbody>
      </table>
    </div>
  )
})

const useRowStyles = createUseStyles({
  today: {
    backgroundColor: 'red'
  },
  day: {
    '&:nth-child(odd)': {
      backgroundColor: '#eee',
      '&$today': {
        backgroundColor: 'red'
      }
    },
    '&:hover': {
      backgroundColor: 'green',
    }
  },
  time: {
  }
})

export function DayRow(props: PrayerMonthRendered) {
  const classes = useRowStyles(props as any) // eslint-disable-line @typescript-eslint/no-explicit-any

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
