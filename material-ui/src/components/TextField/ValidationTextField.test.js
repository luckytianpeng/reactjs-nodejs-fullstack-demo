// react
import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';
import ValidationTextField from './ValidationTextField';

test('validation, error message', () => {
  const signUpEmailLabel = 'Signup Email Address';
  const invalidEmailAddress = 'email';
  const validEmailAddress = 'email@email.com';
  const requiredMsg = 'required';
  const invalidEmailAddressMsg = 'email is not valid';

  const passwordLabel = 'Password';
  const repeatPasswordLabel = 'Repeat Password';
  const isPasswordMatchMsg = 'password mismatch';

  const passwordRef = React.createRef(null);
  const repeatPasswordRef = React.createRef(null);

  render(
    <>
      <ValidationTextField
        id={signUpEmailLabel}
        type="email"
        name="email"
        label={signUpEmailLabel}
        validators={['required', 'isEmail']}
        errorMessages={[requiredMsg, invalidEmailAddressMsg]}
      />
      <ValidationTextField
        id={passwordLabel}
        type="password"
        name="password"
        ref={passwordRef}
        passwordRef={passwordRef}
        repeatPasswordRef={repeatPasswordRef}
        label={passwordLabel}
        validators={['required']}
        errorMessages={['required']}
      />
      <ValidationTextField
        id={repeatPasswordLabel}
        type="password"
        name="repeatPassword"
        ref={repeatPasswordRef}
        passwordRef={passwordRef}
        repeatPasswordRef={repeatPasswordRef}
        label={repeatPasswordLabel}
        validators={['required', 'isPasswordMatch']}
        errorMessages={[requiredMsg, isPasswordMatchMsg]}
      />
    </>
  );

  // Email:
  const input = screen.getByLabelText(signUpEmailLabel);
  expect(input).toBeInTheDocument();

  // invalid email address, error message
  fireEvent.change(input, { target: { value: invalidEmailAddress } });
  const errMsg = screen.getByText(invalidEmailAddressMsg);
  expect(errMsg).toBeInTheDocument();

  // required message
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.queryByText(requiredMsg)).toBeInTheDocument();

  // valid email address
  fireEvent.change(input, { target: { value: validEmailAddress } });
  expect(screen.queryByText(invalidEmailAddressMsg)).toBeNull();

  // Password:
  const password = screen.getByLabelText(passwordLabel);
  expect(password).toBeInTheDocument();

  expect(screen.queryByText(requiredMsg)).toBeNull();

  // give a value and then clear
  fireEvent.change(password, { target: { value: 'a' } });
  expect(screen.queryByText(requiredMsg)).toBeNull();
  fireEvent.change(password, { target: { value: '' } });
  expect(screen.queryByText(requiredMsg)).toBeInTheDocument();

  fireEvent.change(password, { target: { value: 'b' } });
  expect(screen.queryByText(requiredMsg)).toBeNull();

  // Repeat Password:
  const repeatPassword = screen.getByLabelText(repeatPasswordLabel);
  expect(repeatPassword).toBeInTheDocument();

  // input password firstly
  fireEvent.change(password, { target: { value: 'abc' } });
  expect(screen.queryByText(isPasswordMatchMsg)).toBeInTheDocument();

  // ok
  fireEvent.change(repeatPassword, { target: { value: 'abc' } });
  expect(screen.queryByText(isPasswordMatchMsg)).toBeNull();

  // dismatch
  fireEvent.change(repeatPassword, { target: { value: 'cba' } });
  expect(screen.queryByText(isPasswordMatchMsg)).toBeInTheDocument();

  // modify password 
  fireEvent.change(password, { target: { value: 'cba' } });
  expect(screen.queryByText(isPasswordMatchMsg)).toBeNull();
});
