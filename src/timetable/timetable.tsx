import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { TimetableContext } from './state'
import { TimetableState } from './state/timetable-state'
import { TimetableRouter } from './timetable-router'

function Timetable() {
    return (
      <TimetableContext.Provider value={new TimetableState()}>
        <TimetableRouter />
      </TimetableContext.Provider>
    )
  }
  
  ReactDOM.render((<Timetable />), document.getElementById('app-root'))
  
