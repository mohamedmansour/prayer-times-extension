import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { calculationMethods, CalculationName, PrayerTimeFormat } from '../../shared/pray_time'
import { localizedMessages } from '../../shared/pray_time_messages'
import { Setting } from '../../shared/settings'
import { useOptionsState } from '../state'

export const FirstRunExperience = observer(() => {
  const state = useOptionsState()

  if (!state.settings) {
    return <>Loading...</>
  }

  return (
    <>
      <h1>FRE</h1>

      <h2>Location</h2>
      {state.settings.currentPosition && (
        <div>
          <p>
            <strong>Latitude:</strong> {state.settings.currentPosition.latitude} &nbsp;
            <strong>Longitude:</strong> {state.settings.currentPosition.longitude}
          </p>
        </div>
      )}

      <button onClick={() => state.queryLocation()}>Refresh Location</button>

      <CalculationMethod />
      <TimeFormat />
      <Timenames />
    </>
  )
})

const CalculationMethod = observer(() => {
  const state = useOptionsState()
  const calculation = state.settings.calculation
  return (
    <div>
      <h2>Calculation Method</h2>
      <select
        value={calculation}
        onChange={(e) => state.updateSetting(Setting.calculation, parseInt(e.target.value))}
      >
        {Object.keys(calculationMethods).map((method) => (
          <option key={method} value={method}>
            {calculationMethods[method].name}
          </option>
        ))}
      </select>
    </div>
  )
})

const TimeFormat = observer(() => {
  const state = useOptionsState()
  const timeformat = state.settings.timeformat
  return (
    <div>
      <h2>Time Format</h2>
      <select
        value={timeformat}
        onChange={(e) => state.updateSetting(Setting.timeformat, parseInt(e.target.value))}
      >
        <option value={PrayerTimeFormat.TwelveHourFormat}>12 hours</option>
        <option value={PrayerTimeFormat.TwentyFourFormat}>24 hours</option>
      </select>
    </div>
  )
})

const Timenames = observer(() => {
  const state = useOptionsState()
  const timenames = state.settings.timenames

  if (!timenames) return null

  return (
    <div>
      <h2>Visible Times</h2>
      {Object.keys(localizedMessages).map((timename, idx) => (
        <span key={idx}>
          <input
            checked={timenames[timename]}
            name="timenames"
            onChange={(e) => state.updateTimename(timename, e.target.checked)}
            type="checkbox"
          />{' '}
          {localizedMessages[timename]}
        </span>
      ))}
    </div>
  )
})
