import { createContext, useContext } from 'react'
import { PopupState } from './popup-state'

/**
 * React Context that will wrap the mobx state.
 */
export const PopupContext = createContext<PopupState | undefined>(undefined)

/**
 * @returns The mobx state.
 */
export function usePopupState() {
  return useContext(PopupContext)!
}
