import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useOptionsState } from '../state'
import { OptionCalculationMethod } from './option-calculation-method'
import { OptionCurrentPosition } from './option-current-postion'
import { OptionTimeFormat } from './option-timeformat'
import { OptionTimenames } from './option-timenames'

export const FirstRunExperience = observer(() => {
  const state = useOptionsState()

  if (!state.settings) {
    return <>Loading...</>
  }

  return (
    <>
      <h1>FRE</h1>

      <OptionCurrentPosition />
      <OptionCalculationMethod />
      <OptionTimeFormat />
      <OptionTimenames />
    </>
  )
})
