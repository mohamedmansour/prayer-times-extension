import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { MonthView } from './components'
import { useTimetableState } from './state'

export const TimetableRouter = observer(() => {
  const { page } = useTimetableState()
  switch (page) {
      default:
        return <MonthView />
    }
})
