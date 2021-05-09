import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { calculationMethods, CalculationName, PrayerTimeFormat } from '../../shared/pray_time'
import { useOptionsState } from '../state'

export const FirstRunExperience = observer(() => {
  const state = useOptionsState()

  if (!state.settings) {
    return <>Loading...</>
  }

  return <>
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

    <h2>Calculation Method</h2>
    <select value={state.settings.calculation}>
      {Object.keys(calculationMethods).map((method) => (
        <option key={method} value={method}>{calculationMethods[method].name}</option>
      ))}
    </select>

    <h2>Time Format</h2>
    <select value={state.settings.timeformat}>
      <option value={PrayerTimeFormat.TwelveHourFormat}>12 hours</option>
      <option value={PrayerTimeFormat.TwentyFourFormat}>24 hours</option>
    </select>

    <h2>Visible Times</h2>
    {state.settings.timenames.map((timename, idx) => (
      <span key={idx}><input value={timename} type="checkbox" /> {timename}</span>
    ))}
  </>
})
