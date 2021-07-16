// react
import React, { useState, useRef } from 'react';
import clsx from 'clsx';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';

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

const ChangingPasswordForm = observer((props) => {
  const { classes, t } = props;

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatePassword] = useState('');

  const handleChange = (name, value) => {
    switch(name) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'repeatPassword':
        setRepeatePassword(value);
        break;
      default:
    }
  }

  const handleChangePassword = (event) => {
      const data = {
        'oldPassword': oldPassword,
        'newPassword': password
      };

      fetch(domains.api + 'users', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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

  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl
              fullWidth 
              className={clsx(classes.margin, classes.textField)} 
              variant="outlined"
            >
              <ValidationTextField
                type="password"
                name="oldPassword"
                label={t("old password")}
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
            <FormControl
              fullWidth 
              className={clsx(classes.margin, classes.textField)} 
              variant="outlined"
            >
              <ValidationTextField
                type="password"
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
            <FormControl
              fullWidth
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <ValidationTextField
                type="password"
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
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleChangePassword}
          disabled={
            !(oldPassword
                && password
                && repeatPassword
                && (password === repeatPassword))
          }
        >
          {t("change password")}
        </Button>
      </form>
    </div>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (ChangingPasswordForm));
