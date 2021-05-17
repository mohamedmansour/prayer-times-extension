import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
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
        <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.355 8.70505C13.385 8.48005 13.4 8.24755 13.4 8.00005C13.4 7.76005 13.385 7.52005 13.3475 7.29505L14.87 6.11005C15.005 6.00505 15.0425 5.80255 14.96 5.65255L13.52 3.16255C13.43 2.99755 13.2425 2.94505 13.0775 2.99755L11.285 3.71755C10.91 3.43255 10.5125 3.19255 10.07 3.01255L9.79996 1.10755C9.76996 0.927549 9.61996 0.800049 9.43996 0.800049H6.55996C6.37996 0.800049 6.23746 0.927549 6.20746 1.10755L5.93746 3.01255C5.49496 3.19255 5.08996 3.44005 4.72246 3.71755L2.92996 2.99755C2.76496 2.93755 2.57746 2.99755 2.48746 3.16255L1.05496 5.65255C0.96496 5.81005 0.99496 6.00505 1.14496 6.11005L2.66746 7.29505C2.62996 7.52005 2.59996 7.76755 2.59996 8.00005C2.59996 8.23255 2.61496 8.48005 2.65246 8.70505L1.12996 9.89005C0.99496 9.99505 0.95746 10.1975 1.03996 10.3475L2.47996 12.8375C2.56996 13.0026 2.75746 13.055 2.92246 13.0025L4.71496 12.2825C5.08996 12.5675 5.48746 12.8075 5.92996 12.9875L6.19996 14.8925C6.23746 15.0725 6.37996 15.2 6.55996 15.2H9.43996C9.61996 15.2 9.76996 15.0725 9.79246 14.8925L10.0625 12.9875C10.505 12.8075 10.91 12.5675 11.2775 12.2825L13.07 13.0025C13.235 13.0625 13.4225 13.0026 13.5125 12.8375L14.9525 10.3475C15.0425 10.1825 15.005 9.99505 14.8625 9.89005L13.355 8.70505ZM7.99996 10.7C6.51496 10.7 5.29996 9.48505 5.29996 8.00005C5.29996 6.51505 6.51496 5.30005 7.99996 5.30005C9.48496 5.30005 10.7 6.51505 10.7 8.00005C10.7 9.48505 9.48496 10.7 7.99996 10.7Z" />
        </svg>
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
