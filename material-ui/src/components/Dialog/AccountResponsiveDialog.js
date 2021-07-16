// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// @material-ui/icons components
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// core components
import ImageAvatar from '../Avatar/ImageAvatar';
import AccountSimpleAccordion from '../Accordion/AccountSimpleAccordion';

// style
import { styles } from './AccountResponsiveDialog.style';

// mobx
configure({ enforceActions: true });


const AccountResponsiveDialog = observer((props) => {
  const { classes, t } = props;

  const [open, SetOpen] = React.useState(false);

  const handleClickOpen = () => {
    SetOpen(true);
  };

  const handleClose = () => {
    SetOpen(false);
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={
          props.appState.user.avatar
          ? <ImageAvatar
              variant="square"
              className={classes.small}
              path={props.appState.user.avatar}
              appState={props.appState}
            />
          : <Avatar
              variant="square"
              className={classes.small}
            />
        }
        onClick={handleClickOpen}
      >
        {
          props.appState.user.fullName
              ? props.appState.user.fullName : t('account')
        }
        <UnfoldMoreIcon />
      </Button>

      <Dialog
        fullScreen={props.appState.isMobile}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogActions>
          <DialogTitle
            id="responsive-dialog-title"
          >
            {props.appState.user.fullName 
                ? props.appState.user.fullName : t('account')}
          </DialogTitle>
          <div style={{flexGrow: 1}}></div>
          <Button onClick={handleClose} color="primary" autoFocus>
            {t('done')}
          </Button>
        </DialogActions>

        <DialogContent>
          <AccountSimpleAccordion appState={props.appState} />
        </DialogContent>
        
      </Dialog>
    </>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (AccountResponsiveDialog));
