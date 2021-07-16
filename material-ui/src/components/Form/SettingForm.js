// react
import React from 'react';
import clsx from 'clsx';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// style
import { styles } from './Form.style';


// mobx
configure({ enforceActions: true });

const SettingForm = observer((props) => {
  const {classes, t, i18n} = props;
  
  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl
              variant="outlined"
              className={clsx(classes.margin, classes.textField)}
            >
              <InputLabel id="languageSeletc-label">
                {t('language')}
              </InputLabel>
              <Select
                labelId="languageSeletc-label"
                id="languageSeletc"
                value={i18n.language}
                onChange={(event) => {
                  i18n.changeLanguage(event.target.value);
                }}
                label={t('language')}
              >
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'zhHant'}>中文正體</MenuItem>
                <MenuItem value={'zhHans'}>中文简体</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </div>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (SettingForm));
