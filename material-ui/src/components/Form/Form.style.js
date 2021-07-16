const styles = theme => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    // marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submit2: {
    width: '40%',
    float: 'right',
    margin: theme.spacing(0),
  },
  errorText: {
    color: 'red',
  },
  normalText: {
  },
  margin: {
  },
  textField: {
  },
});

export { styles };
