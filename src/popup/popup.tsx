import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PopupRouter } from './popup-router'
import { PopupContext } from './state'
import { PopupState } from './state/popup-state'

function Popup() {
  return (
    <PopupContext.Provider value={new PopupState()}>
      <PopupRouter />
    </PopupContext.Provider>
  )
}

ReactDOM.render((<Popup />), document.getElementById('app-root'))
