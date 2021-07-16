const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',

    margin: 0,
    padding: 0,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
  },
  moreVertButton: {
    margin: 0,
    padding: 0,
  },
  arrowBackButton: {
    margin: 0,
    padding: 0,
  },
  sideAppBar: {
    position: 'fixed',
    top: 0,
    width: '100%',
    float: 'left',
    margin: 0,
    padding: 0,
  },
  appBar: {
    position: 'fixed',
    top: 0,

    margin: 0,
    padding: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  // for scrollbar
  '@global': {
    // width 
    '*::-webkit-scrollbar': {
      width: '8px',
    },
    // Track
    '*::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderradius: '10px',
    },
    // Handle
    '*::-webkit-scrollbar-thumb': {
      background: '#d1d1d1',
    },
    // Handle on hover
    '*::-webkit-scrollbar-thumb:hover': {
      background: '#a1a1a1', 
    },
  },
  breadcrubs: {
    float: 'right',
    marginLeft: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    maginTop: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sidebarContent: {
    flexGrow: 1,
    magin: 0,
    padding: theme.spacing(1, 3, 1, 0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  userMgmtButton: {
    paddingLeft: 0,
  },
  sideBarToolbar: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  userMgntButtonIcon: {
  },
  personButton: {
    border: 0,
  },
  mainPane: {
  },
  fab: {
    position: 'fixed',
    zIndex: '1',
    bottom: theme.spacing(2),
    
    // center
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  wrap: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export { styles };
