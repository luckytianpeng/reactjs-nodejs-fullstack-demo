// react
import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


// @material-ui/icons components
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import FolderIcon from '@material-ui/icons/Folder';
import RefreshIcon from '@material-ui/icons/Refresh';

// @material-ui/lib components
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';
import { formatBytes } from '../../utilities/utilities';

// style
import { useTreeItemStyles, styles } from './RecursiveTreeView.style';


// mobx
configure({ enforceActions: true });

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { path, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, 
      ...other } = props;

  return (
    <TreeItem
      path={path}
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
};

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const RecursiveTreeView = observer((props) => {
  const { theme, classes } = props;

  const handleLabelClick = () => {
    // click and toggle
    // event.preventDefault();
  }

  const handleNodeToggle = (event, nodeIds) => {
    if (props.onNodeToggle) {
      props.onNodeToggle(event, nodeIds);
    } else {
      if (!props.selfManageExpanded) {
        props.appState.setExpanded(nodeIds);
      }
    }

    event.preventDefault();
  }

  const handleNodeSelect = (event, value) => {   
    if (props.onNodeSelect) {
      props.onNodeSelect(event, value);
    }

    if (value === '~') {
      props.appState.tree();
    }
  }

  const renderTree = (nodes) => (
    nodes.type === 'directory'
        ? <StyledTreeItem
            style={{paddingLeft: theme.spacing(2.5)}}
            key={nodes.id}
            nodeId={nodes.path}
            labelText={nodes.name}
            labelIcon={'~' === nodes.name ? RefreshIcon : FolderIcon}
            labelInfo={formatBytes(nodes.size)}
            color="#1a73e8"
            bgColor="#e8f0fe"
            path={nodes.path}
            onLabelClick={handleLabelClick}
          >
            {
              Array.isArray(nodes.children) 
                  ? nodes.children.map((node) => renderTree(node))
                  : null
            }
          </StyledTreeItem>
    : null
  );

  return (
    props.selfManageExpanded
        ? <TreeView
            className={classes.root}
            defaultCollapseIcon={<ArrowDropDownIcon style={{fontSize: 32}} />}
            defaultExpandIcon={<ArrowRightIcon style={{fontSize: 32}} />}
            defaultExpanded={['~']}
            onNodeToggle={handleNodeToggle}
            onNodeSelect={handleNodeSelect}
          >
            {
              props.appState.fileSystem.tree
                  ? renderTree(props.appState.fileSystem.tree, 1)
                  : null
            }
          </TreeView>
        : <TreeView
            className={classes.root}
            defaultCollapseIcon={<ArrowDropDownIcon style={{ fontSize: 32 }} />}
            defaultExpandIcon={<ArrowRightIcon style={{ fontSize: 32 }} />}
            defaultExpanded={[props.appState.fileSystem.wd]}
            expanded={props.appState.fileSystem.expanded}
            selected={props.appState.fileSystem.wd}
            onNodeToggle={handleNodeToggle}
            onNodeSelect={handleNodeSelect}
          >
            {
              props.appState.fileSystem.tree
              ? renderTree(props.appState.fileSystem.tree, 1)
              : null
            }
          </TreeView>
  );
});

export default withTranslation()
    (withStyles(styles, {withTheme: useTheme})(RecursiveTreeView));
