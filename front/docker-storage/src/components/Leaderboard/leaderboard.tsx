import { CSSProperties, useEffect, useState } from 'react';
import { RoundButton, UserBanner } from '..';
import { IUser, LeaderboardProps } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { useUserContext } from '../../contexts';
import Cookies from 'js-cookie';

export function Leaderboard({ meUser, searchTerm, isVisible, setIsVisible }: LeaderboardProps) {
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
    fetchContext();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const getUserInfos = async () => {
      getAllProfil();
      const user = (await Fetch('user', 'GET'))?.json;
      if (!user) return;
    };
    getUserInfos(); // appel de la fonction si le jwt est good
  }, [isVisible]);

  useEffect(() => {
    console.log('meUser in Leaderboard', meUser);
  }, [meUser]);

  useEffect(() => {
    // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
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
          <p>{count++}</p> {/* TO CHANGE */}
          {meUser ? <UserBanner otherUser={user} meUser={meUser} /> : <></>}
          <>
            <p>SCORE %</p>
          </>
        </div>
      ));
      setUserElements(elements);
    };

    displayAllProfil();
  }, [searchTerm, allUsers, jwtToken, meUser]);

  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className='container'>{userElements}</div>
      <RoundButton icon={require('../../assets/imgs/icon_close.png')} onClick={() => setIsVisible(false)}></RoundButton>
    </div>
  );
}


const container: CSSProperties = {
  left: '50%',
  width: '70%',
  minWidth: '500px',
  top: '40%',
  background: 'black',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  zIndex: '999',
};

const userElementStyle: CSSProperties = {
  width: '600px',
  border: '1px solid white',
  flexWrap: 'wrap',
  display: 'flex',
  justifyContent: 'space-around',
  alignContent: 'center',
  background: 'grey',
  color: 'white',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '10px',

};
