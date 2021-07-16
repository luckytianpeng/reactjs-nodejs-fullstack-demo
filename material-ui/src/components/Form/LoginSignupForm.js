// react
import React, { useState, useRef } from 'react';
import clsx from 'clsx';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// core components
import ValidationTextField from '../TextField/ValidationTextField';

// configuration
import { domains } from '../../config/domains';

// styles
import { styles } from './Form.style';


// mobx
configure({enforceActions: true});

const LoginSignupForm = observer((props) => {
  const { classes, t } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogIn = (event) => {
    const data = {
      'email': email,
      'password': password
    };

    fetch(domains.api + 'login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      props.appState.setHaveLoggedIn(data.code === 200);

      if (data.code === 200) {
        props.appState.getUser();

        props.appState.tree();
        props.appState.ls();
      }

      props.appState.setFeedBack({
        type: data.code === 200 ? 'success' : 'error',
        message: data.msg,
      });
    })
    .catch((error) => {
      props.appState.setHaveLoggedIn(false);

      props.appState.setFeedBack({
        type: 'error',
        message: error.toString(),
      });
    });

    event.preventDefault();
  }

  const handleSignUp = (event) => {
    const data = {
        'email': email,
        'password': password,
        'fullName': fullName
      };

    fetch(domains.api + 'users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      props.appState.setFeedBack({
        type: data.code === 200 ? 'success' : 'error',
        message: data.msg,
      });
    })
    .catch((error) => {
      props.appState.setFeedBack({
        type: 'error',
        message: error.toString(),
      });
    })

    event.preventDefault();
  }

  const handleChange = (name, value, valid) => {
    switch(name) {
      case 'email':
        setEmail(valid ? value : '');
        break;
      case 'password':
        setPassword(value);
        break;
      case 'repeatPassword':
        setRepeatPassword(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      default:
    }
  }

  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  return (
  <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ValidationTextField
              type="email"
              id="email"
              name="email"
              label={t("email address")}
              autoComplete="email"
              autoFocus
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              validators={['required', 'isEmail']}
              errorMessages={[t('required'), t('email is not valid')]}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth 
              className={clsx(classes.margin, classes.textField)} 
              variant="outlined"
            >
              <ValidationTextField
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                passwordRef={passwordRef}
                repeatPasswordRef={repeatPasswordRef}
                label={t("password")}
                autoComplete="password"
                variant="outlined"
                required
                fullWidth
                onChange={handleChange}
                validators={['required']}
                errorMessages={[t('required')]}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label={t("remember me")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit2}
              onClick={handleLogIn}
              disabled={!(email && password)}
            >
              {t('log in')}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth 
              className={clsx(classes.margin, classes.textField)} 
              variant="outlined"
            >
              <ValidationTextField
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                ref={repeatPasswordRef}
                passwordRef={passwordRef}
                repeatPasswordRef={repeatPasswordRef}
                label={t("confirm password")}
                autoComplete="password"
                variant="outlined"
                required
                fullWidth
                onChange={handleChange}
                validators={['required', 'isPasswordMatch']}
                errorMessages={[t('required'), t('password mismatch')]}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <ValidationTextField
              id="fullName"
              name="fullName"
              label={t("full name")}
              autoComplete="fullname"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              validators={['required']}
              errorMessages={[t('required')]}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSignUp}
          disabled={
            !(email
                && password
                && repeatPassword 
                && (password === repeatPassword)
                && fullName)
          }
        >
          {t('sign up')}
        </Button>
      </form>
    </div>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (LoginSignupForm));
