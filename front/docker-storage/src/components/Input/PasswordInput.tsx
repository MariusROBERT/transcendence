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
  regex?: RegExp;
}

export function PasswordInput(props: Props) {
  const [isHover, setIsHover] = useState<boolean>(true);
  const [errorColor, setErrorColor] = useState<string>('red');

  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
  };

  const eyeStyle: React.CSSProperties = {
    ...iconStyle,
    position: 'relative',
    // marginLeft: '-20px',
    right: '25px',
  };

  const validationStyle: React.CSSProperties = {
    ...iconStyle,
    position: 'relative',
    // marginLeft: '-20px',
    right: '10px',
  };

  const popUpStyle: React.CSSProperties = {
    backgroundColor: 'red',
    position: 'absolute',
    zIndex: 1000,
    top: 5,
    padding: 5,
    borderRadius: 5,
    right: -10,
  };

  const mainRegex = props.regex || /^\S((?=.*?[a-z]+)(?=.*?[A-Z]+)(?=.*?[0-9]+)(?=.*?[!@#\-+=\[\]\\\/`'";:?.,<>~]+).{8,})\S$/;
  const minMaj = /[A-Z]/;
  const minMin = /[a-z]/;
  const minDigit = /[0-9]/;
  const minSpecial = /[!@#\-+=\[\]\\\/`'";:?.,<>~]/;
  const minLen = /.{8,}/;
  const spaceAround = /(^\s)|(\s$)|(^\s.+\s$)/;

  function errorsInfo() {
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
    if (spaceAround.test(props.password))
      errors.push('space');
    return (
      <p style={popUpStyle}>
        {errors.map((error) => <span>{error}<br/></span>)}
      </p>
    );
  }

  return (
    <div
      style={{ ...props.divStyle, display: 'flex', alignItems: 'center' }}
    >
      <input
        type={props.hidePassword ? 'password' : 'text'}
        placeholder={props.placeholder || 'password'}
        value={props.password}
        onChange={(e) => props.setPassword(e.target.value)}
        style={{ ...props.style, width: '100%' }}
        required={props.required}
        pattern={mainRegex.source}
        onInvalid={async (e) => {
          e.preventDefault();
          for (let i = 0; i < 3; i++) {
            setErrorColor('#ffAAAAff');
            await new Promise(resolve => setTimeout(resolve, 200))
            setErrorColor('red');
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        }}
      />
      {/* default: min 8 char, 1 uppercase, 1 lowercase, 1 number, 1 special char, spaces allowed but not at the beginning or the end */}
      <img src={props.hidePassword ? eye_show : eye_hide}
           alt={props.hidePassword ? 'show' : 'hide'}
           style={eyeStyle}
           onClick={() => props.setHidePassword(!props.hidePassword)}
      />
      {props.password.match(mainRegex) ?
        <img src={check} alt='valid' style={{ ...validationStyle, backgroundColor: 'chartreuse' }} />
        :
        <div style={{ position: 'relative' }}
             onMouseEnter={() => setIsHover(true)}
             // onMouseLeave={() => setIsHover(false)}
        >
          <img src={cross} alt='invalid' style={{ ...validationStyle, backgroundColor: errorColor }} />
          {isHover && errorsInfo()}
        </div>
      }
    </div>
  );
}