import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { usePopupState } from '../state'

export const DaySchedule = observer(() => {
  const state = usePopupState()
  return (
    <div>
      Day Schedule!
      {state.prayerTimes && (
        state.prayerTimeNames.map((name, idx) => (
          <div key={idx}><span>{name}</span><span>{state.prayerTimes[name]}</span></div>
        ))
      )}
    </div>
  )
})
