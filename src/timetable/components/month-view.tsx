import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import { localizedMessages } from '../../shared/pray_time_messages'
import { useTimetableState } from '../state'
import { DayRow } from './day-row'
import useStyles from './month-view.styles'

export const localizationTimetable = {
  gregorianDay: browser.i18n.getMessage('gregorianDay'),
  hijriDay: browser.i18n.getMessage('hijriDay')
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
      <div className={classes.date}>
        {gregorianDateString} ({hijriDateString})
      </div>
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
