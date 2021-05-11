import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { createUseStyles } from 'react-jss'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import { localizedMessages } from '../../shared/pray_time_messages'
import { useTimetableState } from '../state'
import { PrayerMonthRendered } from '../state/timetable-state'

const useStyles = createUseStyles({
  timetable: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'

  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  controls: {
    textAlign: 'right',
    borderRadius: 20,
    backgroundColor: '#074207',
    marginBottom: 10,
    '& button': {
      border: 0,
      background: 'transparent',
      padding: 8,
      margin: 4,
      color: 'white',
      '&:hover': {
        background: '#007500',
        borderRadius: 20,
        cursor: 'pointer'
      }
    }
  },
  month: {
    zIndex: 1,
    overflow: 'hidden',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
    thead: {

    },
    '& th, & td': {
      padding: '8px 10px',
      textAlign: 'center',
      cursor: 'pointer',
      position: 'relative'
    },
    '& td:hover::after': {
      backgroundColor: '#BFE3BF',
      content: '" "',
      height: 10000,
      left: '0',
      position: 'absolute',
      top: -5000,
      width: '100%',
      zIndex: -1
    }
  },
  columnHijri: {
    width: 110
  },
  columnDay: {
    width: 80
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
    <div className={classes.timetable}>
      <div className={classes.date}>{gregorianDateString} ({hijriDateString})</div>
      <div className={classes.controls}>
        <button onClick={() => state.gotoPreviousMonth()}>Previous</button>
        <button onClick={() => state.gotoToday()}>Today</button>
        <button onClick={() => state.gotoNextMonth()}>Next</button>
      </div>
      <table className={classes.month}>
        <thead>
          <tr>
            <th>{localizationTimetable.gregorianDay}</th>
            <th className={classes.columnHijri}>{localizationTimetable.hijriDay}</th>
            <th className={classes.columnDay}>{localizedMessages.imsak}</th>
            <th className={classes.columnDay}>{localizedMessages.fajr}</th>
            <th className={classes.columnDay}>{localizedMessages.sunrise}</th>
            <th className={classes.columnDay}>{localizedMessages.dhuhr}</th>
            <th className={classes.columnDay}>{localizedMessages.asr}</th>
            <th className={classes.columnDay}>{localizedMessages.sunset}</th>
            <th className={classes.columnDay}>{localizedMessages.maghrib}</th>
            <th className={classes.columnDay}>{localizedMessages.isha}</th>
            <th className={classes.columnDay}>{localizedMessages.midnight}</th>
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
    backgroundColor: '#009000',
    fontWeight: 'bold'
  },
  day: {
    '&:hover': {
      backgroundColor: '#004800',
      color: 'white'
    }
  },
  time: {
  }
})

export function DayRow(props: PrayerMonthRendered) {
  const classes = useRowStyles()

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
