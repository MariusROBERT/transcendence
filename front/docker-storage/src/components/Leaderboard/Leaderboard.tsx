import { CSSProperties, useEffect, useState } from 'react';
import { UserBanner } from '..';
import { IUser, LeaderboardProps } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';
import Cookies from 'js-cookie';
import { useFriendsRequestContext } from '../../contexts/FriendsRequestContext/FriendsRequestContext';

export function Leaderboard({ searchTerm }: LeaderboardProps) {
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { fetchContext, user } = useUserContext();

  useEffect(() => {
    fetchContext();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getAllProfil = async () => {
      let cancelled = false;
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (cancelled) { // todo : voir si cest utile ici
        return;
      } else {
        if (users && Array.isArray(users) && users.length === 0)
          setErrorMessage('Aucun utilisateur trouvé.');
        else setAllUsers(users);
      }
      return () => {
        cancelled = true;
      };
    };
    getAllProfil();
  }, []);

  useEffect(() => {
    // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
    const displayAllProfil = () => {
      if (!allUsers)
        return (<p>No user</p>);
      const filteredUsers = allUsers
        .filter((user: IUser) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a: IUser, b: IUser) => a.username.localeCompare(b.username)); // alphabetic. Change to winrate sort
      let count = 1;
      const elements = filteredUsers.map((user: IUser) => (
        <div key={user.id} style={userElementStyle}>
          <p>{count++}</p> {/* TO CHANGE */}
          {<UserBanner otherUser={user} />}
          <>
            <p>SCORE %</p>
          </>
        </div>
      ));
      setUserElements(elements);
    };

    displayAllProfil();
  }, [searchTerm, allUsers, user]);

  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className='container'>{userElements}</div>
    </div>
  );
}

const container: CSSProperties = {
  minWidth: '500px',
  background: 'grey',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  maxHeight: '500px',
  overflowY: 'scroll',
};

const userElementStyle: CSSProperties = {
  width: '600px',
  border: '1px solid white',
  flexWrap: 'wrap',
  display: 'flex',
  justifyContent: 'space-around',
  alignContent: 'center',
  background: '#646464',
  color: 'white',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '10px',

};
