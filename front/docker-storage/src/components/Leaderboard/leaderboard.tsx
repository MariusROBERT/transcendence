import Cookies from 'js-cookie';
import { CSSProperties, useEffect, useState } from 'react';
import { UserBanner } from '..';
import { IUser, LeaderboardProps } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';

export function Leaderboard({ meUser, searchTerm, isVisible }: LeaderboardProps) {
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    window.location.replace('/login');
    alert('Vous avez été déconnecté');
  }
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { fetchContext } = useUserContext();

  const getAllProfil = async () => {
    let cancelled = false;
    const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
    if (cancelled) { // todo : voir si cest utile ici
      return;
    } else {
      if (users && Array.isArray(users) && users.length === 0)
        setErrorMessage('Aucun utilisateur trouvé.');
      else
        setAllUsers(users);
    }
    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    fetchContext()
  }, [])

  useEffect(() => {
    const getUserInfos = async () => {
      getAllProfil();
      const user = (await Fetch('user', 'GET'))?.json;
      if (!user) return;
    };
    getUserInfos();
  }, [isVisible, jwtToken]);

  const displayAllProfil = () => {
    if (!allUsers)
      return (<><p>No user</p></>)
    const filteredUsers = allUsers
      .filter((user: IUser) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a: IUser, b: IUser) => a.username.localeCompare(b.username)); // alphabetic. Change to winrate sort
    let count = 1;
    const elements = filteredUsers.map((user: IUser) => (
      <div key={user.id} style={userElementStyle}>
        <p>RANK : {count++}</p> {/* TO CHANGE */}
        {meUser ? <UserBanner otherUser={user} meUser={meUser} /> : <></>}
        <>
          <p>SCORE %</p>
        </>
      </div>
    ));
    setUserElements(elements);
  };

  useEffect(() => {
    displayAllProfil();
  }, [searchTerm, allUsers, jwtToken, meUser]);

  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className="container">{userElements}</div>
    </div>
  );
}

const container: CSSProperties = {
  top: '200px',
  background: 'black',
  position: 'absolute',
  border: '3px solid blue',
  height: '90vh',
  display: 'flex',
  justifyContent: 'center',
  zIndex: '999'
};

const userElementStyle = {
  width: '1000px',
  display: 'flex',
  justifyContent: 'space-around',
  background: 'grey',
  border: '1px solid black',
  color: 'white',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
};
