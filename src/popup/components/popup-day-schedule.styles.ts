import { createUseStyles } from 'react-jss'

export default createUseStyles({
  wrapper: {
    position: 'relative',
    color: 'white',
    padding: '16px',
    minHeight: 167
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/themes/claudio-fonte-1037599-unsplash.png)',
    backgroundPosition: 'center',
    zIndex: -1,
    borderRadius: 10,
    '&::after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      opacity: 0.24,
      mixBlendMode: 'multiply',
      borderRadius: 10,
    }
  },
  backgroundLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/themes/claudio-fonte-1037599-unsplash.png)',
    backgroundPosition: '100%',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(30px)',
    zIndex: -2,
    '&::after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      opacity: 0.36,
      mixBlendMode: 'overlay',
    }
  },
  content: {
    position: 'relative'
  },
  date: {
    marginTop: 20,
    display: 'flex',
    color: '#666666',
    fontSize: 12
  },
  dateItem: {
    flex: 1,
    '&:last-child': {
      textAlign: 'right'
    }
  },
  header: {
    position: 'relative',
    height: 167,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    borderRadius: 10,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 6px 16px rgba(0, 0, 0, 0.25)',
  },
  headerTitle: {
    letterSpacing: '1.5px',
    textTransform: 'uppercase'
  },
  headerTimename: {
    fontSize: 36,
    lineHeight: '42px',
    fontWeight: 300,
    marginTop: 20,
    marginBottom: 7,
    textTransform: 'uppercase'
  },
  headerRelativeTime: {
    fontWeight: 900,
    fontSize: 18,
    lineHeight: '21px'
  },
  settings: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 6,
    fill: 'white',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(75, 77, 82, 0.24)',
    }
  },
  times: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 10,
    borderBottom: '1px solid rgba(65, 65, 65, 0.48)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '0 12px',
    fontSize: 13,
    cursor: 'pointer',
    margin: '8px -6px -8px -6px',
    height: 36,
    fill: '#414141',
    color: '#414141',
    '& svg': {
      marginRight: 20
    },
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(75, 77, 82, 0.12)',
      borderRadius: 6
    }
  },
})
