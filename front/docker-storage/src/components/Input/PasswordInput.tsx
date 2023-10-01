// import eye_hide from '../../assets/imgs/eye_hide.svg';
import eye_show from '../../assets/imgs/eye_hide.svg';
// import eye_show from '../../assets/imgs/eye_show.svg';
import eye_hide from '../../assets/imgs/eye_show.svg';
import check from '../../assets/imgs/icon_check.svg';
import cross from '../../assets/imgs/icon_cross.svg';
import React, { useState } from 'react';

interface Props {
  placeholder?: string;
  hidePassword: boolean;
  setHidePassword: (hidePassword: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  divStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  required?: boolean;
  noVerify?: boolean;
  confirmPassword?: string;
}

export function PasswordInput(props: Props) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [errorColor, setErrorColor] = useState<string>('red');

  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
  };

  const eyeStyle: React.CSSProperties = {
    ...iconStyle,
    position: 'absolute',
    right: 10,
  };

  const validationStyle: React.CSSProperties = {
    ...iconStyle,
    position: 'absolute',
    right: -25,
    top: -10,
  };

  const popUpStyle: React.CSSProperties = {
    backgroundColor: errorColor,
    position: 'absolute',
    zIndex: 1000,
    top: -8,
    padding: 5,
    borderRadius: '5px 0 5px 5px',
    right: -25,
  };

  const mainRegex = /^((?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#\-+=[\]\\/`'";:?.,<>~]).{8,})$/;
  const minMaj = /[A-Z]/;
  const minMin = /[a-z]/;
  const minDigit = /[0-9]/;
  const minSpecial = /[!@#\-+=[\]\\/`'";:?.,<>~]/;
  const minLen = /.{8,}/;

  function errorsInfo() {
    if (props.confirmPassword) {
      if (props.password !== props.confirmPassword)
        return (
          <p style={popUpStyle}>Passwords don't match</p>
        );
      return;
    }
    let errors: string[] = [];
    if (!minMin.test(props.password))
      errors.push('min');
    if (!minMaj.test(props.password))
      errors.push('maj');
    if (!minDigit.test(props.password))
      errors.push('digit');
    if (!minSpecial.test(props.password))
      errors.push('special');
    if (!minLen.test(props.password))
      errors.push('len');
    return (
      <p style={popUpStyle}>
        {errors.map((error) => <span>{error}<br /></span>)}
      </p>
    );
  }

  const ok =
    <div style={{ position: 'relative' }}>
      <img src={check} alt='valid' style={{ ...validationStyle, backgroundColor: 'chartreuse' }} />
    </div>;

  const notOk =
    <div style={{ position: 'relative' }}
         onMouseEnter={() => setIsHover(true)}
         onMouseLeave={() => setIsHover(false)}
    >
      <img src={cross} alt='invalid' style={{ ...validationStyle, backgroundColor: errorColor }} />
      {isHover && errorsInfo()}
    </div>;

  function verification() {
    if (!props.noVerify && props.password) {
      if (props.confirmPassword) {
        return (props.password === props.confirmPassword ? ok : notOk);
      }
      return (props.password.match(mainRegex) ? ok : notOk);
    }
  }

  return (
    <div
      style={{ ...props.divStyle, position: 'relative', display: 'flex', alignItems: 'center' }}
    >
      <input
        type={props.hidePassword ? 'password' : 'text'}
        placeholder={props.placeholder || 'password'}
        value={props.password}
        onChange={(e) => props.setPassword(e.target.value)}
        style={{ ...props.style, width: '100%' }}
        required={props.required}
        pattern={props.noVerify ? undefined : (props.confirmPassword || mainRegex.source)}
        onInvalid={async (e) => {
          e.preventDefault();
          for (let i = 0; i < 3; i++) {
            setErrorColor('#ffAAAAff');
            await new Promise(resolve => setTimeout(resolve, 200));
            setErrorColor('red');
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }}
      />
      {/* default: min 8 char, 1 uppercase, 1 lowercase, 1 number, 1 special char, spaces allowed but not at the beginning or the end */}
      <img src={props.hidePassword ? eye_show : eye_hide}
           alt={props.hidePassword ? 'show' : 'hide'}
           style={eyeStyle}
           onClick={() => props.setHidePassword(!props.hidePassword)}
      />
      {verification()}
    </div>
  );
}