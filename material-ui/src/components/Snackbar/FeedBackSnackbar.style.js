const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'middle',
    bottom: theme.spacing(11),
    margin: '0 auto',
    marginLeft: theme.spacing(0.1),
    marginRight: theme.spacing(0.1),
  },
  snackbar: {
    bottom: theme.spacing(20),
  },
});

export { styles };
