// react
import React from 'react';

// @material-ui/core components
import { withStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';

// @material-ui/icons components
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// modules
import validator from 'validator';

// styles
import { styles } from './ValidationTextField.style';


/**
 * @class TextField with validators.
 * @param {string[]} props.validators - {['isEmail', 'required', 'isPasswordMatch']}
 * @param {string[]} props.errorMessages
 * @see {@link ./Form/LoginSignupForm.js} for example.
 */
class ValidationTextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',  // hold the input value
      error: false,
      helperText: '',
      showPassword: false,
    };
  }

  /**
   * For password match.
   * @param {string} name - The name of variable.
   * @param {*} value - The value of variable.
   */
  setVariable = (name, value) => {
    this.setState((state) => {
      return {...state, [name]: value}
    });
  }

  isPasswordMatch = (event) => {
    if (!this.props.passwordRef || !this.props.repeatPasswordRef) {
      return true;  // cannot handle no-reference
    }

    const pwd = this.props.passwordRef.current;
    const rpt = this.props.repeatPasswordRef.current;

    if (!pwd || !rpt) {
      return true;  // cannot handle no-reference
    }

    const i = rpt.props.validators.indexOf('isPasswordMatch');
    if (i === -1) {
      return true;  // no requirement 
    }

    if ((event.target.name === 'password'
            && event.target.value !== rpt.state.value)
        ||
        (event.target.name === 'repeatPassword'
            && event.target.value !== pwd.state.value)) {

      rpt.setVariable('helperText', rpt.props.errorMessages[i]);
      rpt.setVariable('error', true);

      return false;
    } else {
      rpt.setVariable('helperText', '');
      rpt.setVariable('error', false);

      return true;
    }
  }

  onChange = (event) => {
    this.setState({value: event.target.value});

    this.setState({helperText: ''});
    this.setState({error: false});

    let valid = true;
    this.props.validators.forEach((e, i) => {
      switch (e) {
        case 'required':
          if (!event.target.value) {
            this.setState({helperText: this.props.errorMessages[i]});
            valid = false;
          }
          break;
        case 'isEmail':
          if (event.target.value && !validator.isEmail(event.target.value)) {
            this.setState({helperText: this.props.errorMessages[i]});
            valid = false;
          }
          break;
        case 'isPasswordMatch':
          break;
        default:
      }
    });

    // isPasswordMatch
    if (valid) {
      if (event.target.name === 'password' 
              || event.target.name === 'repeatPassword') {
        valid = this.isPasswordMatch(event);
        if (valid) {
          if (this.props.onChange) {
            this.props.onChange('password', event.target.value, valid);
            this.props.onChange('repeatPassword', event.target.value, valid);
          }
          return;
        }
      }
    } else {
      this.setState({error: true});
    }

    // call back
    if (this.props.onChange) {
      this.props.onChange(event.target.name, event.target.value, valid);
    }
  }

  handleClickShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      this.props.type === 'password'
          ? <>
              <InputLabel htmlFor={this.props.id} error={this.state.error}>
                {this.props.label + (this.props.required ? ' * ' : '')}
              </InputLabel>

              <OutlinedInput
                {...this.props}

                type={this.state.showPassword ? 'text' : 'password'}
                label={this.props.label + (this.props.required ? ' * ' : '')}
                value={this.state.value}
                onChange={this.onChange}

                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      edge="end"
                    >
                      {
                        this.state.showPassword
                            ? <Visibility /> : <VisibilityOff />
                      }
                    </IconButton>
                  </InputAdornment>
                }
              />

              <FormHelperText error={this.state.error}>
                {this.state.helperText}
              </FormHelperText>
            </>
          : <TextField
              {...this.props}
              
              error={this.state.error}
              helperText={this.state.helperText}

              value={this.state.value}
              onChange={this.onChange}
            />
    );
  }
}

export default (withStyles(styles, {withTheme: useTheme})
    (ValidationTextField));
