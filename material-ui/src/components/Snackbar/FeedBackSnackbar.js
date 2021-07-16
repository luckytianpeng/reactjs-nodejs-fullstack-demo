// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// configuration
import { ui } from '../../config/ui';

// style
import { styles } from './FeedBackSnackbar.style';


// mobx
configure({ enforceActions: true });

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FeedBackSnackbar = observer((props) => {
  const { classes, t } = props;

  return (
    <>
      <Snackbar
        anchorOrigin={{vertical: "left", horizontal: "bottom" }}
        classes={{ root: classes.root }}
        open={props.appState.feedBack.snackbarOpen}
        autoHideDuration={ui.snackbarAutoHideDuration}
        onClose={props.appState.snackbarClose}
      >
        <Alert
          severity={props.appState.feedBack.type}
          classes={{ root: classes.root }}
        >
          <>
            {
              t(props.appState.feedBack.message.replace(':', '').toLowerCase())
            }
          </>
        </Alert>
      </Snackbar>
    </>
  );
});

export default withTranslation()
    (withStyles(styles, {withTheme: useTheme})(FeedBackSnackbar));
