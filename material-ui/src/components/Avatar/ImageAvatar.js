// react
import { React, useState, useEffect } from 'react';

// @material-ui/core components
import Avatar from '@material-ui/core/Avatar';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';

// configuration
import { domains } from '../../config/domains';


// mobx
configure({ enforceActions: true });

const ImageAvatar = observer((props) => {
  const [source, setSource] = useState(null);

  useEffect(() => {
    props.appState.setProgress(true);

    fetch(domains.api + 'filesystem/read/' + props.path, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.arrayBuffer())
    .then(data => {
      const base64 = btoa(
        new Uint8Array(data)
          .reduce((data, byte) => data + String.fromCharCode(byte),'')
      );
      setSource("data:;base64," + base64);
      props.appState.setProgress(false);
    })
    .catch((error) => {
      setSource(null);
      console.error('read, Error:', error);
      props.appState.setProgress(false);
    });
  });

  return (
      <Avatar
        variant={props.variant}
        className={props.className}
        src={source}
      />
  );
});

export default ImageAvatar;
