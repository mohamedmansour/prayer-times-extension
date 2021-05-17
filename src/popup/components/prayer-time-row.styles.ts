import { createUseStyles } from 'react-jss';

export default createUseStyles({
  item: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 13,
    borderRadius: 6,
    fontWeight: 400,
    lineHeight: '15px',
    color: '#333333',
    height: 26,
    alignItems: 'center',
    marginBottom: 4
  },
  prayerName: {
    flex: '1'
  },
  prayerTime: {},
})
