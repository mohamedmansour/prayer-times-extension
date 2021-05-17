import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { PrayerTimeFormat } from '../../shared/pray-time'
import { Setting } from '../../shared/settings'
import { useOptionsState } from '../state'

export const OptionTimeFormat = observer(() => {
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