import { createUseStyles } from 'react-jss';

export default createUseStyles({
  item: {
    marginBottom: 6
  },
  timeEntry: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 13,
    padding: '5px 8px',
    borderRadius: 6,
    fontWeight: '400',
    lineHeight: '15px'
  },
  prayerName: {
    flex: '1'
  },
  prayerTime: {},
  active: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    fontWeight: '700'
  },
  done: {
    opacity: 0.5
  }
})
