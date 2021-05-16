import { createUseStyles } from 'react-jss';
import { ActiveTimeBadgeProps } from './active-time-badge.props';

export default createUseStyles({
  activeBadge: {
    backgroundColor: (props: ActiveTimeBadgeProps) => props.color ? props.color : 'rgba(45, 156, 219, 0.42)',
    padding: '4px 6px',
    display: 'inline-flex',
    fontSize: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
    '& svg': {
      marginRight: 4
    }
  },
})
