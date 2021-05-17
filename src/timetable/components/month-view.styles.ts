import { createUseStyles } from 'react-jss';

export default createUseStyles({
  timetable: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'

  },
  date: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 20
  },
  controls: {
    textAlign: 'right',
    borderRadius: 20,
    backgroundColor: '#074207',
    marginBottom: 10,
    '& button': {
      border: 0,
      background: 'transparent',
      padding: 8,
      margin: 4,
      color: 'white',
      '&:hover': {
        background: '#007500',
        borderRadius: 20,
        cursor: 'pointer'
      }
    }
  },
  month: {
    zIndex: 1,
    overflow: 'hidden',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
    thead: {

    },
    '& th, & td': {
      padding: '8px 10px',
      textAlign: 'center'
    }
  },
  columnHijri: {
    width: 110
  },
  columnDay: {
    width: 80
  }
})
