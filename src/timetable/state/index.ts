import { createContext, useContext } from 'react'
import { TimetableState } from './timetable-state'

/**
 * React Context that will wrap the mobx state.
 */
export const TimetableContext = createContext<TimetableState | undefined>(undefined)

/**
 * @returns The mobx state.
 */
export function useTimetableState() {
  return useContext(TimetableContext)!
}
