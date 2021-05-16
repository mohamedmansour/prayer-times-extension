import { createUseStyles } from 'react-jss';

export default createUseStyles({
  today: {
    backgroundColor: '#009000',
    fontWeight: 'bold'
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