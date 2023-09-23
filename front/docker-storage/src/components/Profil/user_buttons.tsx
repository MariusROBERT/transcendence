import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { UserInfos, UserButtonsProps } from '../../utils/interfaces';
import { Fetch, unsecureFetch } from '../../utils';

// TODO : quand on ask a friend dans Profil -> le button du profil dans leaderboard ne se met pas a jour... impossible de faire fonctionner cette merde

const UserButtons: React.FC<UserButtonsProps> = ({ id }) => {
  const jwtToken = Cookies.get('jwtToken');
  const [sendButton, setSendButton] = useState(false); // TODO : mettre la valeur du button askFriend direct pour pas avoir de latence
  const [userInfos, setUserInfos] = useState<UserInfos | null>(null);

  const askFriend = async () => {
    const response = (await Fetch(`user/demand/${id}`, 'PATCH'))?.response;
    if (response?.ok) {
      setSendButton(true);
    } else if (response?.status === 404) {
      throw new Error(`Le user d'id ${id} n'existe pas.`);
    } else if (response?.status === 409) {
      throw new Error(`Vous avez déjà demandé le user ${id}.`);
    }
  }

  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const response = await unsecureFetch('user', 'GET');
        if (response?.ok) {
          const userData = await response?.json();
          setUserInfos(userData);
        } else {
          console.log('Réponse non OK');
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données utilisateur:',
          error,
        );
      }
    };

    if (jwtToken) {
      fetchUserInfos();
    }
  }, [jwtToken]);

  useEffect(() => {
    if (userInfos && userInfos.invited.includes(id as number)) {
      setSendButton(true);
    }
  }, [id, userInfos]);

  return (
    <div>
      <button onClick={askFriend} disabled={sendButton}>
        {sendButton ? 'Sent !' : 'Ask friend'}
      </button>
      <button>Play with</button>
      <button>Message</button>
    </div>
  );
};

export default UserButtons;
