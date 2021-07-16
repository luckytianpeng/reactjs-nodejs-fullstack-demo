const styles = theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    borderRadius: '5px',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
});

export { styles };
