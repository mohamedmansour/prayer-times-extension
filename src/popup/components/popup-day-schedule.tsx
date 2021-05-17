import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { browser } from 'webextension-polyfill-ts'
import { IconSettings } from '../../shared/icon-settings'
import { getHijriDate } from '../../shared/islamic-date'
import { usePopupState } from '../state'
import useStyles from './popup-day-schedule.styles'
import { PrayerTimeRow } from './prayer-time-row'

const localization = {
  monthlyView: browser.i18n.getMessage('popupMonthlyView'),
  upcomingPrayerTime: browser.i18n.getMessage('popupUpcomingPrayerTime')
}

export const DaySchedule = observer(() => {
  const classes = useStyles()
  const state = usePopupState()

  const gregorianDateString = new Intl.DateTimeFormat(navigator.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(state.currentGregorianDate)

  const hijriString = getHijriDate(state.currentGregorianDate)

  return (
    <div className={classes.wrapper}>
      <div className={classes.settings} onClick={() => state.openOptions()}>
        <IconSettings />
      </div>
      <div className={classes.content}>
        <div className={classes.header}>
          {state.nextPrayerTime && (
            <>
              <div className={classes.headerTitle}>{localization.upcomingPrayerTime}</div>
              <div className={classes.headerTimename}>{state.nextPrayerTime.name}</div>
              <div className={classes.headerRelativeTime}>{state.nextPrayerTime.relativeTime}</div>
              <div className={classes.background} />
            </>
          )}
        </div>
        <div className={classes.date}>
          <div className={classes.dateItem}>{gregorianDateString}</div>
          <div className={classes.dateItem}>{hijriString}</div>
        </div>
        <div className={classes.times}>
          {state.prayerTimes &&
            state.prayerTimes.map((obj, idx) => <PrayerTimeRow key={idx} {...obj} />)}
        </div>
        <div className={classes.footer} onClick={() => state.openTimetable()}>
          <svg width="12" height="14" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.33333 7.33333H6V10.6667H9.33333V7.33333ZM8.66667 0V1.33333H3.33333V0H2V1.33333H1.33333C0.593333 1.33333 0.00666666 1.93333 0.00666666 2.66667L0 12C0 12.7333 0.593333 13.3333 1.33333 13.3333H10.6667C11.4 13.3333 12 12.7333 12 12V2.66667C12 1.93333 11.4 1.33333 10.6667 1.33333H10V0H8.66667ZM10.6667 12H1.33333V4.66667H10.6667V12Z" />
          </svg>
          {localization.monthlyView}
        </div>
      </div>
      <div className={classes.backgroundLight} />
    </div>
  )
})
