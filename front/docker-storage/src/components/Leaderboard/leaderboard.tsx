import Cookies from 'js-cookie';
import { CSSProperties, useEffect, useState } from 'react';
import Profil from '../Profil/profil';
import { AuthGuard, Flex, RoundButton, UserBanner } from '..';
import { IUser, IUserComplete, LeaderboardProps, UserInfos } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { handleOpenProfil } from '../../utils/user_functions';
import { useNavigate } from 'react-router-dom';

export function Leaderboard({ meUser, searchTerm, isVisible }: LeaderboardProps) {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  if (!jwtToken) {
    navigate('/login');
    alert('Vous avez été déconnecté');
  }
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userInfos, setUserInfos] = useState<IUserComplete>();

  console.log("meUser: ", meUser?.username);

  const closeProfil = () => {
    // close profil card
    setSelectedUser(null);
    setProfilVisible(false);
  };

  const getAllProfil = async () => {
    let cancelled = false;
    const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
    // console.log(cancelled); // si on print en Slow 3g on a : 2xtrue si on cancell, et 1 true 1 false si on cancell pas
    if (cancelled) {
      // au cas ou le client cancell le fetch avant la fin
      return;
    } else {
      if (users && Array.isArray(users) && users.length === 0) // A TESTER
        setErrorMessage('Aucun utilisateur trouvé.');
      else
        setAllUsers(users);
    }
    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    const getUserInfos = async () => {
      getAllProfil();
      const user = (await Fetch('user', 'GET'))?.json;
      if (!user) return;
      setUserInfos(user);
    };
    getUserInfos(); // appel de la fonction si le jwt est good
  }, [isVisible]);

  // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
  const displayAllProfil = () => {
    const filteredUsers = allUsers
      .filter((user: IUser) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a: IUser, b: IUser) => a.username.localeCompare(b.username)); // alphabetic. Change to winrate sort
    let count = 1;
    const elements = filteredUsers.map((user: IUser) => (
      <div key={user.id} style={userElementStyle}>
        <p>RANK : {count++}</p> {/* TO CHANGE */}
        {user.id === meUser?.id ? (
          <>
            <Flex zIndex={'10'} flex_direction="row">
                <RoundButton icon={user.urlImg} icon_size={50} onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, user)}></RoundButton> {/* go to own profil */}
                <p onClick={() => handleOpenProfil(setSelectedUser, setProfilVisible, user)}>coucou cest moi: {user.username}</p>
            </Flex>
          </>
        ) :  (
          <UserBanner otherUser={user} meUser={meUser} setSelectedUser={setSelectedUser} setProfilVisible={setProfilVisible} />
        )}
        <>
            <p>SCORE %</p>
        </>
      </div>
    ));

    setUserElements(elements);
  };

  useEffect(() => {
    displayAllProfil();
    setUserInfos(meUser)
  }, [searchTerm, allUsers ,jwtToken]);

  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className="container">{userElements}</div>
      {profilVisible && (
        <AuthGuard isAuthenticated>
          <Profil otherUser={selectedUser} meUser={meUser} onClose={closeProfil} />
        </AuthGuard>
      )}
    </div>
  );
}

const container: CSSProperties = {
  background: 'black',
  position: 'absolute',
  border: '1px solid red',
  height: '90vh',
  display: 'flex',
  justifyContent: 'center',
  zIndex: '999'
};

const imgStyle = {
  width: '100px',
  height: '100px',
  border: '1px solid red',
};

const statusStyle = {
  width: '10px',
  height: '10px',
}

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
