
import * as React from 'react'
import { ActiveTimeBadgeProps } from './active-time-badge.props'
import useStyles from './active-time-badge.styles'

export function ActiveTimeBadge(props: ActiveTimeBadgeProps) {
  const classes = useStyles(props as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div className={classes.activeBadge}>
      <svg
        width="10"
        height="10"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.99663 0.666626C2.15663 0.666626 0.666626 2.15996 0.666626 3.99996C0.666626 5.83996 2.15663 7.33329 3.99663 7.33329C5.83996 7.33329 7.33329 5.83996 7.33329 3.99996C7.33329 2.15996 5.83996 0.666626 3.99663 0.666626ZM3.99996 6.66663C2.52663 6.66663 1.33329 5.47329 1.33329 3.99996C1.33329 2.52663 2.52663 1.33329 3.99996 1.33329C5.47329 1.33329 6.66663 2.52663 6.66663 3.99996C6.66663 5.47329 5.47329 6.66663 3.99996 6.66663Z"
          fill="white"
        />
        <path
          d="M4.16663 2.33337H3.66663V4.33337L5.41663 5.38337L5.66663 4.97337L4.16663 4.08337V2.33337Z"
          fill="white"
        />
      </svg>
      {props.children}
    </div>
  )
} 
