import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { localizedPrayerTimeMessages } from '../../shared/pray_time_messages'
import { useOptionsState } from '../state'
import useStyles from './option-timenames.styles'

const localizedMessages = {
  optionsTimenameTitle: browser.i18n.getMessage('optionsTimenameTitle'),
  optionsTimenameColumnName: browser.i18n.getMessage('optionsTimenameColumnName'),
  optionsTimenameColumnOffset: browser.i18n.getMessage('optionsTimenameColumnOffset')
}

export const OptionTimenames = observer(() => {
  const classes = useStyles()
  const state = useOptionsState()
  const toggleAllRef = useRef<HTMLInputElement>()
  const timenames = state.settings.timenames

  if (!timenames) return null

  const updateTimeName = (name: string, checked: boolean) => {
    toggleAllRef.current.checked = false
    state.updateTimename(name, checked)
  }

  return (
    <div>
      <h2>{localizedMessages.optionsTimenameTitle}</h2>
      <table>
        <thead>
          <tr>
            <th>
              <input
                ref={toggleAllRef}
                onChange={(e) => state.toggleAllTimenames(e.target.checked)}
                type="checkbox"
              />
            </th>
            <th className={classes.nameColumn}>{localizedMessages.optionsTimenameColumnName}</th>
            <th>{localizedMessages.optionsTimenameColumnOffset}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(localizedPrayerTimeMessages).map((timename, idx) => (
            <tr key={idx}>
              <td>
                <input
                  checked={timenames[timename]}
                  onChange={(e) => updateTimeName(timename, e.target.checked)}
                  type="checkbox"
                />
              </td>
              <td>{localizedPrayerTimeMessages[timename]}</td>
              <td>
                <input
                  className={classes.offset}
                  type="number"
                  value={state.settings.offsets[timename]}
                  onChange={(e) => state.updateTimeNameOffset(timename, parseInt(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
