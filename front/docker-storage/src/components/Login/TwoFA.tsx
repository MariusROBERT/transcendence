import React, { useEffect, useState } from 'react';
import { Popup } from '..';

interface Props {
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
  submit: (code2fa: string) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

export default function TwoFA(props: Props) {
  const [code2fa, setCode2fa] = useState<string>('');

  useEffect(() => {
    if (props.isVisible) {
      document.getElementById('2fa')?.focus();
      setCode2fa('');
    }
  }, [props.isVisible]);

  return (
    <Popup onClose={() => props.setIsVisible(false)}
           isVisible={props.isVisible}
           style={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-evenly',
             flexDirection: 'column',
             backgroundColor: '#5b5a5a',
             borderRadius: 20,
             padding: '3em',
           }}>
      <h2 style={{ margin: '0.5em', fontSize: '5em' }}>2FA</h2>
      <p style={{ color: 'red' }}>{props.errorMessage || '​'}</p>
      <input id={'2fa'}
             type='number'
             name={'twoFactorCode'}
             autoComplete={'one-time-code'}
             maxLength={6}
             value={code2fa}
             onKeyDown={(e) => {
               if (e.key === 'Enter')
                 props.submit(code2fa);
             }}
             onChange={(e) => {
               if (e.target.value.length > 6)
                 e.target.value = e.target.value.slice(0, 6);
               setCode2fa(e.target.value.replace(/[^0-9]/g, ''));
             }}
             style={{
               width: '8ch',
               height: '2em',
               fontSize: '2.5em',
               textAlign: 'center',
               backgroundColor: 'darkgrey',
               borderRadius: 5,
             }}
      />
      <button
        id='2faValidate'
        style={{ display: 'none' }}
        onClick={() => props.submit(code2fa)} />
      <label htmlFor='2faValidate' style={{ margin: '1em' }}>
        <p style={{ backgroundColor: 'darkgrey', padding: '.7em', borderRadius: 5 }}>
          Confirm
        </p>
      </label>
    </Popup>
  );
}