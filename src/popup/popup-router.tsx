import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DaySchedule } from './components'
import { usePopupState } from './state'

export const PopupRouter = observer(() => {
  const { page } = usePopupState()
  switch (page) {
      default:
        return <DaySchedule />
    }
})
