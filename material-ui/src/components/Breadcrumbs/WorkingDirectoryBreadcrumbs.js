// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import IconButton from '@material-ui/core/IconButton';

// @material-ui/icons components
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// style
import { styles } from './WorkingDirectoryBreadcrumbs.style';


// mobx
configure({ enforceActions: true });

function getParent(path) {
  const parent = path.split(/[\\/]/).slice(0,-1).join('/');

  return parent;
}

function getName(path) {
  const name = path.split(/[\\/]/).pop();

  return name;
}

const WorkingDirecgtoryBreadcrumbs = observer((props) => {
  const {classes} = props;

  const handleClick = (event) => {
    event.preventDefault();
  
   props.appState.cd(getParent(props.appState.fileSystem.wd));
   props.appState.ls();
  }

  return (
    props.appState.fileSystem.tree &&
    <Breadcrumbs style={{color: 'white'}} aria-label="breadcrumb">
      <IconButton
        id="parentButton"
        className={classes.iconButton}
        color="inherit"
        aria-label="ArrowBack"
        onClick={handleClick}
        disabled={!getParent(props.appState.fileSystem.wd)}
      >
        <SubdirectoryArrowLeftIcon style={{transform: "rotate(90deg)"}} />
      </IconButton>

      <Typography id="wd" color="textPrimary" className={classes.link}>
        {
          getName(props.appState.fileSystem.wd)
        }
      </Typography>
    </Breadcrumbs>
  );
});

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (WorkingDirecgtoryBreadcrumbs));
