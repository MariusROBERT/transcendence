import React, { useState } from 'react';
import FriendButtons from './friend_buttons';
import UserButtons from './user_buttons';
import { ProfilProps } from '../../utils/interfaces';

const Profil: React.FC<ProfilProps> = ({ user, onClose }) => {
  return (
    <div style={profilContainer}>
      <div style={profilContent}>
        {user ? (
          <>
            <h2>Profil de {user.username}</h2>
            <p>ID : {user.id}</p>
            <img style={imgStyle} src="/default_profil.png"></img>
            <p>Statut : {user.user_status}</p>
            <p>LAST MATCHS</p>
            <p>Winrate : {user.winrate}</p>
            <button onClick={onClose}>Fermer</button>
            {user?.is_friend ? <FriendButtons /> : <UserButtons id={user.id} />}
          </>
        ) : (
          <p>Utilisateur introuvable.</p>
        )}
      </div>
    </div>
  );
};

const profilContainer: React.CSSProperties = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const profilContent = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
};

const imgStyle = {
  width: '100px',
  height: '100px',
  border: '1px solid red',
};

export default Profil;
