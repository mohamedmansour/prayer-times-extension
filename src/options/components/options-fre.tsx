import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useOptionsState } from '../state'

export const FirstRunExperience = observer(() => {
  const state = useOptionsState()

  return <>
    <h1>FRE</h1>
    {state.coordinates && (
      <div>
        <p>
          <strong>Latitude:</strong> {state.coordinates.latitude} &nbsp;
          <strong>Longitude:</strong> {state.coordinates.longitude}
        </p>
      </div>
    )}
    
    <button onClick={() => state.queryLocation()}>Refresh Location</button>
  </>
})
