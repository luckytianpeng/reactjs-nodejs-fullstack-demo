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
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// @material-ui/icons components
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import VerticalAlignBottomOutlinedIcon from '@material-ui/icons/VerticalAlignBottomOutlined';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';
import { formatBytes } from '../../utilities/utilities';

// core components
import FileTypeAvatar from '../Avatar/FileTypeAvatar';
import RecursiveTreeView from '../Tree/RecursiveTreeView';
import { StyledMenu, StyledMenuItem } from '../Menu/StyledMenu';

// configuration
import { domains } from '../../config/domains';

// style
import { styles } from './DirectoryContentsList.style';


// mobx
configure({ enforceActions: true });

const DirectoryContentsList = observer((props) => {
  const {classes, t}  = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentNodeName, setCurrentNodeName] = React.useState('');
  const [currentNodePath, setCurrentNodePath] = React.useState('');
  const [currentNodeType, setCurrentNodeType] = React.useState('');
  const [dialogType, setDialogType] = React.useState('');
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);

  const listRef = React.createRef();

  const handleClickListItem = (event, node) => {
    setSelectedItems([node.path]);
  
    if (node.type === 'directory') {
      props.appState.cd(node.path);
      props.appState.ls();
    } else {
      // file
    }
  
    event.preventDefault();
  }

  const handleClickMore = (event, node) => {
    setSelectedItems([node.path]);
    setCurrentNodeName(node.name);
    setCurrentNodePath(node.path);
    setCurrentNodeType(node.type);

    setAnchorEl(event.currentTarget);

    event.preventDefault();
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRename = () => {
    handleRenameDialogOpen();
  }

  const handleMoveTo = () => {
    handleMoveToDialogOpen();
  }

  const handleRemove = (event, path) => {
    fetch(domains.api + 'filesystem/rm', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({path: path}),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
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
      props.appState.setFeedBack(
        {
          type: 'error',
          message: error.toString(),
        }
      );
    });
    
    handleMenuClose();
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleRenameDialogOpen = () => {
    setDialogType('rename');
    setDialogTitle(t('rename'));
    setDialogOpen(true);
    setAnchorEl(null);
  }

  const handleMoveToDialogOpen = () => {
    props.appState.setMoveTo(null);
    setDialogType('moveto');
    setDialogTitle(t('move to'));
    setDialogOpen(true);
    setAnchorEl(null);
  }

  const handleDownload = () => {
    if ('file'=== currentNodeType) {
      const fileName = currentNodeName;

      fetch(domains.api + 'filesystem/read/' + currentNodePath, {
        method: 'GET',
        credentials: 'include',
      })
      .then(function(t) {
        return t.blob().then((b) => {
              let a = document.createElement("a");
              a.href = URL.createObjectURL(b);
              a.setAttribute("download", fileName);
              document.body.appendChild(a); 
              a.click();
              // URL.revokeObjectURL(a.href);
              document.body.removeChild(a);
          }
        );
      });
    } else {
      props.appState.setFeedBack(
        {
          type: 'warning', 
          message: t('only file can be download'),
        }
      );
    }

    handleMenuClose();
  }

  const handleMoveToDialogOk = (event, oldPath) => {
    const newParent = props.appState.fileSystem.moveTo;
    const oldName = oldPath.split(/[\\/]/).pop();

    const newPath = newParent + '/' + oldName;

    fetch(domains.api + 'filesystem/mv', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({source: oldPath, dest: newPath}),
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
      props.appState.setFeedBack(
        {
          type: 'error',
          message: error.toString(),
        }
      );
    });

    setDialogOpen(false);
  }

  const handleRenameDialogOk = (event, oldPath, newName) => {
    const parent = oldPath.split(/[\\/]/).slice(0,-1).join('/');
    const newPath = parent + '/' + newName;

    fetch(domains.api + 'filesystem/mv', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({source: oldPath, dest: newPath}),
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
      props.appState.setFeedBack(
        {
          type: 'error',
          message: error.toString(),
        }
      );
    });

    setDialogOpen(false);
  }

  const onNodeSelect = (event, value) => {
    props.appState.setMoveTo(value);
  }

  const renderItem = (node) => (
    <ListItem
      button
      key={node.path}
      path={node.path}
      selected={selectedItems.includes(node.path)}
      onClick={(event) => handleClickListItem(event, node)}
    >
      <ListItemAvatar>
        {
          node.type === 'directory'
          ? <Avatar><FolderIcon /></Avatar>
          : <FileTypeAvatar appState={props.appState} path={node.path} />
        }
      </ListItemAvatar>

      <ListItemText
        primary={
          <div className={classes.wrap}>
            {node.name}
          </div>
        }
        secondary={formatBytes(node.size)}
      />

      <ListItemSecondaryAction
        style={{float: "right"}}
        onClick={(event) => handleClickMore(event, node)}
      >
        <IconButton edge="end" aria-label="delete">
          <MoreHorizIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <>
      {/* list of directory contents */}
      <List ref={listRef} className={classes.root}>
        {
          (props.appState.fileSystem.list
              &&Array.isArray(props.appState.fileSystem.list.children))
          ?
            props.appState.fileSystem.list.children.map((node) => 
                renderItem(node))
          : null
        }
      </List>

      {/* pop menu for MoreHorizIcon button */}
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <StyledMenuItem disabled>
          <ListItemText primary={
            <div className={classes.wrap}>
              {currentNodeName}
            </div>
          } />
        </StyledMenuItem>

        <Divider />

        <StyledMenuItem onClick={handleMoveTo}>
          <ListItemIcon>
            <FolderOpenOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("move to")} />
        </StyledMenuItem>

        <StyledMenuItem onClick={handleRename}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("rename")} />
        </StyledMenuItem>

        <StyledMenuItem
          disabled={'file'!== currentNodeType}
          onClick={handleDownload}>
          <ListItemIcon>
            <VerticalAlignBottomOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("download")} />
        </StyledMenuItem>

        <Divider />

        <StyledMenuItem
          onClick={(event) => handleRemove(event, currentNodePath)}
        >
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t("remove")}
            style={{color: "red"}}
          />
        </StyledMenuItem>
      </StyledMenu>

      {/* dialog for pop menu, rename and moveto */}
      <Dialog
        fullWidth
        classes={'moveto' === dialogType ? { paper : classes.dialogPaper} : {}}
        scroll={"paper"}
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          {
            'rename' === dialogType &&
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label=""
              fullWidth
              value={currentNodeName}
              onChange={(event) => setCurrentNodeName(event.target.value)}
            />
          }

          {
            'moveto' === dialogType &&
            <RecursiveTreeView
              appState={props.appState}
              onNodeSelect={onNodeSelect}
              defaultExpanded={['~']}
              selected={'~'}
              selfManageExpanded={true}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t('cancel')}
          </Button>
          
          {
            'rename' === dialogType &&
              <Button onClick={(event) => 
                  handleRenameDialogOk(event, currentNodePath, currentNodeName)
                }
                color="primary"
              >
                {t('ok')}
              </Button>
          }

          {
            'moveto' === dialogType &&
              <Button onClick={(event) => 
                  handleMoveToDialogOk(event, currentNodePath)
                }
                color="primary"
              >
                {t('ok')}
              </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
});

export default withTranslation()
    (withStyles(styles, {withTheme: useTheme})
    (DirectoryContentsList));
