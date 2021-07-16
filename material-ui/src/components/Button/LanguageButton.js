// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// @material-ui/icons components
import TranslateOutlinedIcon from '@material-ui/icons/TranslateOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';

// modules
import { configure } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import '../../config/i18n';

// style
import { styles } from './LanguageButton.style';


// mobx
configure({ enforceActions: true });

const LanguageButton = observer((props) => {
  const { t, i18n }  = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (value) => {
    i18n.changeLanguage(value);

    handleClose();
  }

  return (
    <>
      <Button
        color="inherit"
        startIcon={<TranslateOutlinedIcon />}
        onClick={handleClick}
      >
        {t(i18n.language)}
        <KeyboardArrowDownOutlinedIcon fontSize="small" />
      </Button>

      {/* pop menu for languages */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('en')} value={'en'}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('zhHant')} value={'zhHant'}>中文正體</MenuItem>
        <MenuItem onClick={() => changeLanguage('zhHans')} value={'zhHant'}>中文简体</MenuItem>
      </Menu>
    </>
  );
});

export default withTranslation()
    (withStyles(styles, {withTheme: useTheme})
    (LanguageButton));
