import { createUseStyles } from 'react-jss';

export default createUseStyles({
  today: {
    backgroundColor: '#009000',
    fontWeight: 900
  },
  day: {
    '&:hover': {
      backgroundColor: '#004800',
      color: 'white'
    }
  },
  time: {
  }
})