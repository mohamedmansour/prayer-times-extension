import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { localizedPrayerTimeMessages } from '../../shared/pray_time_messages'
import { useOptionsState } from '../state'

export const OptionTimenames = observer(() => {
  const state = useOptionsState()
  const timenames = state.settings.timenames

  if (!timenames) return null

  return (
    <div>
      <h2>Visible Times</h2>
      {Object.keys(localizedPrayerTimeMessages).map((timename, idx) => (
        <span key={idx}>
          <input
            checked={timenames[timename]}
            name="timenames"
            onChange={(e) => state.updateTimename(timename, e.target.checked)}
            type="checkbox"
          />
          {localizedPrayerTimeMessages[timename]}
        </span>
      ))}
    </div>
  )
})
