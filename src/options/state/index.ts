import { createContext, useContext } from 'react'
import { OptionsState } from './options-state'

/**
 * React Context that will wrap the mobx state.
 */
export const OptionsContext = createContext<OptionsState | undefined>(undefined)

/**
 * @returns The mobx state.
 */
export function useOptionsState() {
  return useContext(OptionsContext)!
}
