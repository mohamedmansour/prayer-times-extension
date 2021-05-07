import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { FirstRunExperience, Settings } from './components'
import { useOptionsState } from './state'

export const OptionsRouter = observer(() => {
  const { page } = useOptionsState()
  switch (page) {
      case 'fre':
        return <FirstRunExperience />
      default:
        return <Settings />
    }
})
