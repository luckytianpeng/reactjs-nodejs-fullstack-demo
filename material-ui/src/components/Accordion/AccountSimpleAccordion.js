// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// core components
import LoginSignupForm from '../Form/LoginSignupForm';
import ChangingPasswordForm from '../Form/ChangingPasswordForm';

// configuration
import { domains } from '../../config/domains';

// style
import { styles } from './SimpleAccordion.style';


// mobx
configure({ enforceActions: true });

const AccountSimpleAccordion =  observer((props) => {
  const { classes, t } = props;

  const logOut = () => {
    fetch(domains.api + 'logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      if (200 === data.code) {
        props.appState.setHaveLoggedIn(false);
        props.appState.setUser({fullName: t('account')});

        props.appState.ls();
        props.appState.tree();
      }

      props.appState.setFeedBack(
        {
          type: data.code === 200 ? 'success' : 'error',
          message: data.msg,
        }
      );
    })
    .catch((error) => {
      props.appState.setFeedBack(
        {
          type: 'error',
          message: error.toString(),
        }
      );
    });
  };

  return (
    <div className={classes.root}>
      {
        props.appState.haveLoggedIn
            ? <>
                <Button
                  xs={12}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={logOut}
                >
                  {t('log out')}
                </Button>

                <Accordion expanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography
                      className={classes.heading}>
                        {t('change password')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ChangingPasswordForm appState={props.appState} />
                  </AccordionDetails>
                </Accordion>
              </>
            : <Accordion expanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography
                      className={classes.heading}
                    >
                      {t('log in or sign up')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <LoginSignupForm appState={props.appState} />
                  </AccordionDetails>
                </Accordion>
      }
    </div>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (AccountSimpleAccordion));
