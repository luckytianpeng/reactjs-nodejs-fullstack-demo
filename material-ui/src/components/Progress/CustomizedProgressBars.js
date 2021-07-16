// react
import React from 'react';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'middle',
    bottom: '50%',
    left: 0,
    right: 0,
    margin: '0 auto',
    position: 'absolute',
    zIndex: 3,
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    // left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function FacebookCircularProgress(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomizedProgressBars() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FacebookCircularProgress />
    </div>
  );
}
