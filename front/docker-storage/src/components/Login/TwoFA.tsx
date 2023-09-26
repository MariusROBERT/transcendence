import React, { useState } from 'react';

interface Props {
  setIsVisible: (isVisible: boolean) => void;
  submit: (code2fa: string) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

export default function TwoFA(props: Props) {
  const [code2fa, setCode2fa] = useState<string>('');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999,
      backgroundColor: 'rgba(70,70,70,0.5)',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        backgroundColor: '#5b5a5a',
        borderRadius: 20,
        padding: '3em',
      }}>
        <h2 style={{ margin: '0.5em', fontSize: '5em' }}>2FA</h2>
        <p style={{ minHeight: '1ch', display: 'block' }}>{props.errorMessage || ' '}</p>
        <input id={'2fa'}
               type='number'
               name={'twoFactorCode'}
               autoComplete={'one-time-code'}
               maxLength={6}
               value={code2fa}
               onKeyDown={(e) => {
                 console.log(e.key);
                 if (e.key.match(/[a-z]/)) {
                   console.log(e.key);
                  setCode2fa(code2fa.replace(/[^0-9]/g, ''));
               }}}
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
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <button
            id='2faCancel'
            style={{ display: 'none' }}
            onClick={() => {
              props.setIsVisible(false);
              props.setErrorMessage('');
            }} />
          <label htmlFor='2faCancel'>
            <p style={{ backgroundColor: 'darkgrey', padding: '.7em', margin: '1em', borderRadius: 5 }}>
              Cancel
            </p>
          </label>
          <button
            id='2faValidate'
            style={{ display: 'none' }}
            onClick={() => props.submit(code2fa)} />
          <label htmlFor='2faValidate'>
            <p style={{ backgroundColor: 'darkgrey', padding: '.7em', margin: '1em', borderRadius: 5 }}>
              Confirm
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}