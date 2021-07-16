// react
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

// @material-ui/icons components
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// https://zesik.com/react-splitter-layout
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

// core components
import AccountResponsiveDialog from '../Dialog/AccountResponsiveDialog';
import DirectoryContentsList from '../List/DirectoryContentsList';
import FeedBackSnackbar from '../Snackbar/FeedBackSnackbar';
import {StyledMenu, StyledMenuItem} from '../Menu/StyledMenu';
import SettingResponsiveDialog from '../Dialog/SettingResponsiveDialog';
import RecursiveTreeView from '../Tree/RecursiveTreeView';
import WorkingDirecgtoryBreadcrumbs from '../Breadcrumbs/WorkingDirectoryBreadcrumbs';
import CustomizedProgressBars from '../Progress/CustomizedProgressBars';
import VerticalLinearStepper from '../Stepper/VerticalLinearStepper';
import LanguageButton from '../Button/LanguageButton';
import VerticalLinearStepperZhHant from '../Stepper/VerticalLinearStepper.zhHant';
import VerticalLinearStepperZhHans from '../Stepper/VerticalLinearStepper.zhHans';

// configuration
import { domains } from '../../config/domains';

// style
import { styles } from './TogglableSidebarLayout.style';


// mobx
configure({enforceActions: true});

const TogglableSidebarLayout = observer((props) => {
  const { theme, classes, t, i18n } = props;

  const isMobile = () => {
    // https://material-ui.com/customization/breakpoints/
    // sm, small: 600px
    return window.innerWidth < theme.breakpoints.width('sm');
  }

  props.appState.setIsMobile(isMobile());
    
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sidebarVisible, setSidebarVisible] = React.useState(!isMobile());
  const [secondaryPaneSize, setSecondaryPaneSize] =
      React.useState(isMobile() ? window.innerWidth : -1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [isListView, setIsListView] = React.useState(false);

  // SplitterLayout
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  // callback for SplitterLayout
  const onSecondaryPaneSizeChange = (secondaryPaneSize) => {
    setSecondaryPaneSize(secondaryPaneSize);
  }

  const onTreeNodeSelect = (event, value) => {
    setIsListView(true);
    props.appState.cd(value);
    props.appState.ls();
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleFab = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleNewFolder = () => {
    console.log('new Folder...');
    handleNewFolderDialogOpen();
  }

  const handleNewFolderDialogOpen = () => {
    setNewFolderName('');
    setDialogOpen(true);
    setAnchorEl(null);
  }

  const handleNewFolderDialogOk = () => {
    const newFolderFullPath = 
        props.appState.fileSystem.wd + '/' + newFolderName;

    fetch(domains.api + 'filesystem/mkdir', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({directory: newFolderFullPath}),
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
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
      props.appState.setFeedBack({
        type: 'error',
        message: error.toString(),
      });
    });

    setDialogOpen(false);
  }

  const handleFolderUpload = () => {
    setAnchorEl(null);

    document.getElementById("folder").click();
  }

  const handleFolderChange = (event) => {
    const folderName = event.target.files[0].webkitRelativePath
        .split(/[\\/]/).slice(0,-1).join('/');

    const data = new FormData();
    for (const file of event.target.files) {
      data.append('files[]', file, file.name);
    }
    data.append('directory',
        props.appState.fileSystem.wd + '/' + folderName);

    fetch(domains.api + 'filesystem/uploadfiles', {
      method: 'POST',
      credentials: 'include',
      body: data
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        props.appState.ls();
        props.appState.tree();
      }

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
    });
  }

  const handleFileUpload = () => {
    setAnchorEl(null);

    document.getElementById("files").click();
  }

  const handleFileChange = (event) => {
    if (!event.target.files) {
      console.log("no file !!!");
    }

    const data = new FormData();
    for (const file of event.target.files) {
      data.append('files[]', file, file.name);
    }
    data.append('directory', props.appState.fileSystem.wd);

    fetch(domains.api + 'filesystem/uploadfiles', {
      method: 'POST',
      credentials: 'include',
      body: data
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        props.appState.ls();
        props.appState.tree();
      }

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
    });
  }

  return (
    <>
      <FeedBackSnackbar id="feedBackSnackbar" appState={props.appState} />

      {
        props.appState.progress && <CustomizedProgressBars />
      }

      {/* Floating Action Button, associated menu and dialog */}
      {
        props.appState.haveLoggedIn &&
        !(sidebarVisible && props.appState.isMobile) && 
        isListView &&
        <>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            onClick={handleFab}
          >
            <AddIcon />
          </Fab>

          {/* menu for the FAB above */}
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            >
            <StyledMenuItem onClick={handleNewFolder} >
              <ListItemIcon>
                <CreateNewFolderOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("new folder")} />
            </StyledMenuItem>

            <StyledMenuItem onClick={handleFileUpload} >
              <input
                id='files'
                type="file"
                multiple
                style={{display:"None"}}
                onChange={handleFileChange}
              />
              <ListItemIcon>
                <VerticalAlignTopIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("file upload")} />
            </StyledMenuItem>

            <StyledMenuItem onClick={handleFolderUpload}>
              <input
                id="folder"
                type="file"
                name="fileList"
                webkitdirectory=""
                multiple=""
                style={{display:"None"}}
                onChange={handleFolderChange}
              />
              <ListItemIcon>
                <PublishOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t("folder upload")} />
            </StyledMenuItem>
          </StyledMenu>

          {/* dialog for the create-new-folder MenuItem */}
          <Dialog
            fullWidth
            classes={{ paper : classes.dialogPaper}}
            scroll={"paper"}
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">{t('new folder')}</DialogTitle>
            <DialogContent dividers>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                id="name"
                label=""
                value={newFolderName}
                onChange={(event) => {setNewFolderName(event.target.value)}}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                {t('cancel')}
              </Button>
              
              <Button
                onClick={handleNewFolderDialogOk}
                color="primary"
              >
                {t('ok')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }

      {/* Side | Contents */}
      <SplitterLayout
        primaryIndex={1}
        secondaryMinSize={200}
        secondaryInitialSize={
          props.appState.isMobile ? secondaryPaneSize : 250}
        onSecondaryPaneSizeChange={onSecondaryPaneSizeChange}
      >
        {/* side pane */}
        {
          sidebarVisible &&
          <div className="my-pane sideBar">
            <AppBar
              position="static"
              className={classes.sideAppBar}
              style={{width: secondaryPaneSize}}
            >
              <Toolbar className={classes.sideBarToolbar}>
                <AccountResponsiveDialog appState={props.appState} />

                <div className={classes.grow}></div>

                <IconButton
                  className={classes.arrowBackButton}
                  color="inherit"
                  aria-label="ArrowBack"
                  onClick={toggleSidebar}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* this div holds space to avoid overlap */}
            <div className={classes.drawerHeader} />

            <List>
              <ListItem 
                button
                key='Home Page'
                selected={!isListView}
                onClick={() => { setIsListView(false); }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t('home')} />
              </ListItem>
              
              <SettingResponsiveDialog appState={props.appState} />
            </List>

            <Divider />

            <main
              className={clsx(classes.sidebarContent, 
                  {[classes.contentShift]: classes.open,})}
            >
              <RecursiveTreeView
                appState={props.appState}
                onNodeSelect={onTreeNodeSelect}
              />
            </main>
          </div>
        }

        {/* contents pane */}
        {
          <div className={classes.mainPane}>
            <AppBar
              position="static"
              className={classes.appBar}
              style={{
                paddingRight:
                    sidebarVisible 
                        ? secondaryPaneSize + 4 // separator, width: 4px
                        : 0
              }}
            >
              <Toolbar
                className={classes.sideBarToolbar}
              >
                <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                  onClick={toggleSidebar}
                >
                  <MenuIcon />
                </IconButton>

                <div className={classes.grow}></div>

                {
                  isListView &&
                  <WorkingDirecgtoryBreadcrumbs appState={props.appState} />
                }

                <div className={classes.grow}></div>

                <LanguageButton />

                {
                  <IconButton
                    className={classes.moreVertButton}
                    color="inherit"
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              </Toolbar>
            </AppBar>
              
            {/* this div holds space to avoid overlap */}
            <div className={classes.drawerHeader} />

            <main
              className={clsx(classes.content, {
                [classes.contentShift]: classes.open,
              })}
            >
              {
                isListView
                    ? <DirectoryContentsList appState={props.appState} />
                    : ('zhHant' === i18n.language
                        ? <VerticalLinearStepperZhHant /> 
                        : ('zhHans' === i18n.language
                            ? <VerticalLinearStepperZhHans />
                            : <VerticalLinearStepper />
                        )
                      )
              }
            </main>
          </div>
        }
      </SplitterLayout>
    </>
  );
});

TogglableSidebarLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.object.isRequired,
};

export default withTranslation()
                (withStyles(styles, {withTheme: useTheme})
                (TogglableSidebarLayout));
