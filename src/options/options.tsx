import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { OptionsRouter } from './options-router'
import { OptionsContext } from './state'
import { OptionsState } from './state/options-state'

function Options() {
  return (
    <OptionsContext.Provider value={new OptionsState()}>
      <OptionsRouter />
    </OptionsContext.Provider>
  )
}

ReactDOM.render((<Options />), document.getElementById('app-root'))
