import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { createUseStyles } from 'react-jss'
import { browser } from 'webextension-polyfill-ts'
import { getHijriDate } from '../../shared/islamic_date'
import { usePopupState } from '../state'
import { PrayerTimeRendered } from '../state/popup-state'

const localization = {
  monthlyView: browser.i18n.getMessage('monthlyView')
}

const useStyles = createUseStyles({
  wrapper: {
    position: 'relative',
    color: 'white',
    padding: '0 16px'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/themes/claudio-fonte-1037599-unsplash.png)',
    backgroundPosition: 'bottom',

    '&::after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      opacity: 0.57
    }
  },
  content: {
    position: 'relative'
  },
  header: {
    padding: '0 8px'
  },
  headerPrimary: {
    padding: '16px 0 4px 0',
    fontSize: 36,
    lineHeight: '42px'
  },
  headerSecondary: {
    fontSize: 13,
    lineHeight: '15px'
  },
  headerSecondaryItem: {
    marginBottom: 5
  },
  settings: {
    position: 'absolute',
    top: 18,
    right: 18,
    fill: 'white',
    zIndex: 1,
    '&:hover': {
      fill: 'black',
      cursor: 'pointer'
    }
  },
  times: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px 8px',
    fontSize: 13,
    lineHeight: '15px',
    borderTop: '1px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    marginTop: 10
  },
  footerContent: {
    flex: 1
  },
  footerControl: {
    whiteSpace: 'nowrap',
    fill: 'white'
  }
})

export const DaySchedule = observer(() => {
  const classes = useStyles()
  const state = usePopupState()

  const gregorianDateString = new Intl.DateTimeFormat(navigator.language, {
    day: '2-digit'
  }).format(state.currentGregorianDate)

  const gregorianMonthYearString = new Intl.DateTimeFormat(navigator.language, {
    month: 'long',
    year: 'numeric'
  }).format(state.currentGregorianDate)

  const hijriString = getHijriDate(state.currentGregorianDate)

  return (
    <div className={classes.wrapper}>
      <div className={classes.background} />
      <div className={classes.settings} onClick={() => state.openOptions()}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.355 8.70505C13.385 8.48005 13.4 8.24755 13.4 8.00005C13.4 7.76005 13.385 7.52005 13.3475 7.29505L14.87 6.11005C15.005 6.00505 15.0425 5.80255 14.96 5.65255L13.52 3.16255C13.43 2.99755 13.2425 2.94505 13.0775 2.99755L11.285 3.71755C10.91 3.43255 10.5125 3.19255 10.07 3.01255L9.79996 1.10755C9.76996 0.927549 9.61996 0.800049 9.43996 0.800049H6.55996C6.37996 0.800049 6.23746 0.927549 6.20746 1.10755L5.93746 3.01255C5.49496 3.19255 5.08996 3.44005 4.72246 3.71755L2.92996 2.99755C2.76496 2.93755 2.57746 2.99755 2.48746 3.16255L1.05496 5.65255C0.96496 5.81005 0.99496 6.00505 1.14496 6.11005L2.66746 7.29505C2.62996 7.52005 2.59996 7.76755 2.59996 8.00005C2.59996 8.23255 2.61496 8.48005 2.65246 8.70505L1.12996 9.89005C0.99496 9.99505 0.95746 10.1975 1.03996 10.3475L2.47996 12.8375C2.56996 13.0026 2.75746 13.055 2.92246 13.0025L4.71496 12.2825C5.08996 12.5675 5.48746 12.8075 5.92996 12.9875L6.19996 14.8925C6.23746 15.0725 6.37996 15.2 6.55996 15.2H9.43996C9.61996 15.2 9.76996 15.0725 9.79246 14.8925L10.0625 12.9875C10.505 12.8075 10.91 12.5675 11.2775 12.2825L13.07 13.0025C13.235 13.0625 13.4225 13.0026 13.5125 12.8375L14.9525 10.3475C15.0425 10.1825 15.005 9.99505 14.8625 9.89005L13.355 8.70505ZM7.99996 10.7C6.51496 10.7 5.29996 9.48505 5.29996 8.00005C5.29996 6.51505 6.51496 5.30005 7.99996 5.30005C9.48496 5.30005 10.7 6.51505 10.7 8.00005C10.7 9.48505 9.48496 10.7 7.99996 10.7Z" />
        </svg>
      </div>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.headerPrimary}>{gregorianDateString}</div>
          <div className={classes.headerSecondary}>
            <div className={classes.headerSecondaryItem}>{gregorianMonthYearString}</div>
            <div className={classes.headerSecondaryItem}>{hijriString}</div>
          </div>
        </div>
        <div className={classes.times}>
          {state.prayerTimes &&
            state.prayerTimes.map((obj, idx) => <PrayerTime key={idx} {...obj} />)}
        </div>
        <div className={classes.footer}>
          <div className={classes.footerContent} onClick={() => state.openTimetable()}>
            {localization.monthlyView}
          </div>
          <div className={classes.footerControl}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 0 24 24"
              width="18px"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
})

const useItemStyles = createUseStyles({
  item: {
    marginBottom: 6
  },
  timeEntry: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 13,
    padding: '5px 8px',
    borderRadius: 6,
    fontWeight: '400',
    lineHeight: '15px'
  },
  prayerName: {
    flex: '1'
  },
  prayerTime: {},
  active: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    fontWeight: '700'
  },
  activeBadge: {
    backgroundColor: 'rgba(45, 156, 219, 0.42)',
    padding: '4px 6px',
    display: 'inline-flex',
    fontSize: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
    '& svg': {
      marginRight: 4
    }
  },
  done: {
    opacity: 0.5
  }
})

function PrayerTime(props: PrayerTimeRendered) {
  const classes = useItemStyles()
  return (
    <div className={classes.item}>
      {props.isNext && (
        <div className={classes.activeBadge}>
          <svg
            width="10"
            height="10"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.99663 0.666626C2.15663 0.666626 0.666626 2.15996 0.666626 3.99996C0.666626 5.83996 2.15663 7.33329 3.99663 7.33329C5.83996 7.33329 7.33329 5.83996 7.33329 3.99996C7.33329 2.15996 5.83996 0.666626 3.99663 0.666626ZM3.99996 6.66663C2.52663 6.66663 1.33329 5.47329 1.33329 3.99996C1.33329 2.52663 2.52663 1.33329 3.99996 1.33329C5.47329 1.33329 6.66663 2.52663 6.66663 3.99996C6.66663 5.47329 5.47329 6.66663 3.99996 6.66663Z"
              fill="white"
            />
            <path
              d="M4.16663 2.33337H3.66663V4.33337L5.41663 5.38337L5.66663 4.97337L4.16663 4.08337V2.33337Z"
              fill="white"
            />
          </svg>
          In {props.isNext}
        </div>
      )}
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
