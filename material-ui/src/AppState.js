// modules
import { configure, makeObservable, observable, action } from 'mobx';

// configuration
import { domains } from './config/domains';


// mobx
configure({ enforceActions: true });

class AppState {
  // device
  @observable
  isMobile = false;

  @action
  setIsMobile = (v) => {
    this.isMobile = v;
  }

  // authentication 
  @observable
  haveLoggedIn = false;

  @action
  setHaveLoggedIn = (v) => {
    this.haveLoggedIn = v;
  }

  @observable
  user = {
    fullName: '',
    avatar: '',
  }

  @action
  setUser = (v) => {
    this.user = v;
  }

  @action
  getUser = () => {
    fetch(domains.api + 'users', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      this.user.fullName = data.code === 200 ? data.data.fullName : '';
      this.user.avatar = data.code === 200 ? '~/avatar.png' : '';
    })
    .catch(() => {
      // if no server, then:
      //   Error: TypeError: Failed to fetch
      this.user.fullName = '';
      this.user.avatar = '';
    });
  }

  // cloud file system
  @observable
  fileSystem = {
    tree: null,
    expanded: [], // for <TreeItem />
    wd: '~',      // working directory
    list: null,   // of the wd
    moveTo: '',
  }

  @action
  cd = (v) => {
    this.fileSystem.wd = v;
  }

  @action
  ls = () => {
    this.setProgress(true);

    fetch(domains.api + 'filesystem/tree/' + this.fileSystem.wd, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        this.fileSystem.list = data.data.tree;
      } else {
        this.fileSystem.list = null;
      }

      this.setProgress(false);
    })
    .catch(() => {
      this.fileSystem.list = null;
      this.setProgress(false);
    });
  }

  @action
  tree = () => {
    this.setProgress(true);

    fetch(domains.api + 'filesystem/tree/~', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        this.fileSystem.tree = data.data.tree;
      } else {
        this.fileSystem.tree = null;
        this.fileSystem.expanded = [];
        this.fileSystem.wd = '~';
      }
      this.setProgress(false);
    })
    .catch(() => {
      this.fileSystem.tree = null;
      this.fileSystem.expanded = [];
      this.fileSystem.wd = '~';
      this.setProgress(false);
    });
  }

  @action
  setExpanded = (v) => {
    this.fileSystem.expanded = v;
  }

  @action
  setMoveTo = (v) => {
    this.fileSystem.moveTo = v;
  }

  // UI
  @observable
  feedBack = {
    type: 'success', // { success, info, warning, error }
    message: '',
    snackbarOpen: false,
  }

  @action
  setFeedBack = (v) => {
    console.log('setFeedBack', v);

    this.feedBack.type = v.type.toString();
    this.feedBack.message = v.message.toString();
    this.feedBack.snackbarOpen = true;
  }

  @action
  snackbarClose = () => {
    this.feedBack.snackbarOpen = false;
  }

  @observable
  progress = true;

  @action
  setProgress = (v) => {
    this.progress = v;
  }

  constructor() {
    makeObservable(this);

    fetch(domains.api + 'login', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      this.haveLoggedIn = data.code === 200;
    })
    .catch(() => {
      // no server:
      // Error: TypeError: Failed to fetch
      this.haveLoggedIn = false;
    });

    this.getUser();

    this.ls();
    this.tree();
  }
}

export default AppState;
