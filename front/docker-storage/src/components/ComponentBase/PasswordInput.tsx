import eye_show from '../../assets/imgs/eye_hide.svg';
import eye_hide from '../../assets/imgs/eye_show.svg';
import React from 'react';

interface Props {
  placeholder?: string;
  hidePassword: boolean;
  setHidePassword: (hidePassword: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  divStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  required?: boolean;
}

export function PasswordInput(props: Props) {
  const eyeStyle: React.CSSProperties = {
    width: '15px',
    height: '15px',
    marginLeft: '-20px',
  };

  return (
    <div
      style={{ ...props.divStyle, display: 'flex', alignItems: 'center' }}
    >
      <input
        type={props.hidePassword ? 'password': 'text'}
        placeholder={props.placeholder || 'password'}
        value={props.password}
        onChange={(e) => props.setPassword(e.target.value)}
        style={{ ...props.style, width: '100%' }}
        required={props.required}
      />
      <img src={props.hidePassword ? eye_show : eye_hide}
           alt={props.hidePassword ? 'show' : 'hide'}
           style={eyeStyle}
           onClick={() => props.setHidePassword(!props.hidePassword)}
      />
    </div>
  );
}