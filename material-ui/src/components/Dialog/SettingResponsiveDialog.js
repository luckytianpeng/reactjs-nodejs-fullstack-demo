// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// @material-ui/icons components
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// core components
import SettingSimpleAccordion from '../Accordion/SettingSimpleAccordion';

// style
import { styles } from './SettingResponsiveDialog.style';


// mobx
configure({enforceActions: true});

const SettingResponsiveDialog = observer((props) => {
  const { t } = props;

  const [open, SetOpen] = React.useState(false);

  const handleClickOpen = () => {
    SetOpen(true);
  };

  const handleClose = () => {
    SetOpen(false);
  };

  return (
    <>
      <ListItem
        button
        id="settingButton"
        key='Settings'
        onClick={handleClickOpen}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={t('setting')} />
      </ListItem>

      <Dialog
        fullWidth
        fullScreen={props.appState.isMobile}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogActions>
          <DialogTitle
            id="responsive-dialog-title"
          >
            {t('setting')}
          </DialogTitle>
          <div style={{flexGrow: 1}}></div>
          <Button onClick={handleClose} color="primary" autoFocus>
            {t('done')}
          </Button>
        </DialogActions>

        <DialogContent>
          <SettingSimpleAccordion appState={props.appState} />
        </DialogContent>
        
      </Dialog>
    </>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (SettingResponsiveDialog));
