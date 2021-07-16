// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// core components
import SettingForm from '../Form/SettingForm';

// style
import { styles } from './SimpleAccordion.style';


// mobx
configure({ enforceActions: true });

const SettingSimpleAccordion = observer((props) => {
  const {classes, t} = props;

  return (
    <div className={classes.root}>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{t('UI')}</Typography>
        </AccordionSummary>
        <AccordionDetails
          fullWidth
        >
          <SettingForm appState={props.appState} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (SettingSimpleAccordion));
