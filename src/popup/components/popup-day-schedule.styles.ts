import { createUseStyles } from 'react-jss'

export default createUseStyles({
  wrapper: {
    position: 'relative',
    color: 'white',
    padding: '0 16px'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/themes/claudio-fonte-1037599-unsplash.png)',
    backgroundPosition: 'bottom',

    '&::after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      opacity: 0.57
    }
  },
  content: {
    position: 'relative'
  },
  header: {
    padding: '0 8px'
  },
  headerPrimary: {
    padding: '16px 0 4px 0',
    fontSize: 36,
    lineHeight: '42px'
  },
  headerSecondary: {
    fontSize: 13,
    lineHeight: '15px'
  },
  headerSecondaryItem: {
    marginBottom: 5
  },
  settings: {
    position: 'absolute',
    top: 18,
    right: 18,
    fill: 'white',
    zIndex: 1,
    '&:hover': {
      fill: 'black',
      cursor: 'pointer'
    }
  },
  times: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px 8px',
    fontSize: 13,
    borderTop: '1px solid rgba(255,255,255,0.6)',
    cursor: 'pointer',
    marginTop: 10
  },
  footerContent: {
    flex: 1
  },
  footerControl: {
    whiteSpace: 'nowrap',
    fill: 'white'
  }
})
