import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { calculationMethods, Setting } from '../../shared'
import { useOptionsState } from '../state'

export const OptionCalculationMethod = observer(() => {
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
