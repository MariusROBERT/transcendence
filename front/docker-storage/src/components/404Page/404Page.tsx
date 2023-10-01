import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <p style={{ fontSize: '7em' }}>404 - Page Not Found</p>
      <p>
        <a href='/' style={{ color: 'lightgrey', fontSize: '1.5em' }}>Retour a la page principale</a>
      </p>
    </div>
  );
};

export default NotFoundPage;