// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

// @material-ui/icons components
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import HeadsetIcon from '@material-ui/icons/Headset';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';


// core components
import ImageAvatar from './ImageAvatar';

// style
import { styles } from './FileTypeAvatar.style';


// mobx
configure({ enforceActions: true });

/*
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types}
*/
function fileType(filename) {
  switch (filename.split('.').pop().toLowerCase()) {
    case 'apng':
    case 'avif':
    case 'gif':
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
    case 'png':
    case 'svg':
    case 'webp':
    case 'bmp':
    case 'ico':
    case 'cur':
    case 'tif':
    case 'tiff':
      return 'image';
    case 'wav':
    case 'mp3':
    case 'mp4':
    case 'acc':
    case 'ogg':
    case 'cfa':
    case 'flac':
    case 'm4a':
      return 'audio';
    default:
      return 'other';
  }
}

const FileTypeAvatar = observer((props) => {
  const { classes, path } = props;

  return (
    <div className={classes.root}>      
      {
        'other' === fileType(path) &&
        <Avatar className={classes.small}>
          <InsertDriveFileIcon />
        </Avatar>
      }
      
      {
        'image' === fileType(path) &&
        <ImageAvatar
          variant="square"
          className={classes.small}
          path={path}
          appState={props.appState}
        />
      }
      
      {
        'audio' === fileType(path) &&
        <Avatar className={classes.small}>
          <HeadsetIcon />
        </Avatar>
      }
    </div>
  );
});

export default withStyles(styles, {withTheme: useTheme})(FileTypeAvatar);
