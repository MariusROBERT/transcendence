import Cookies from 'js-cookie';
import { CSSProperties, useEffect, useState } from 'react';
import Profil from '../Profil/profil';
import { useNavigate } from 'react-router-dom';
import { AuthGuard, Flex, RoundButton } from '..';
import { LeaderboardProps, User, UserInfos } from '../../utils/interfaces';
import { UserButton } from '../User/UserButton';

// TODO : rafraichir quand il click sur ask as friend

export default function Leaderboard({ searchTerm }: LeaderboardProps) {
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profilVisible, setProfilVisible] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userInfos, setUserInfos] = useState<UserInfos>();

  const handleOpenProfil = (user: User) => {
    // open profil card
    setSelectedUser(user);
    setProfilVisible(true);
  };

  const closeProfil = () => {
    // close profil card
    setSelectedUser(null);
    setProfilVisible(false);
  };

  const getAllProfil = () => {
    let cancelled = false;
    fetch('http://localhost:3001/api/user/get_all_public_profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          navigate('/login');
          alert(`Vous avez ete déconnecté car vous n'êtes pas authorisé`);
          // mettre ce message sur la page login ?
          return;
        }
        return res.json();
      })
      .then((user) => {
        // console.log(cancelled); // si on print en Slow 3g on a : 2xtrue si on cancell, et 1 true 1 false si on cancell pas
        if (cancelled) {
          // au cas ou le client cancell le fetch avant la fin
          return;
        } else {
          if (user && Array.isArray(user) && user.length === 0)
            // A TESTER
            setErrorMessage('Aucun utilisateur trouvé.');
          else setAllUsers(user);
        }
      });
    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    const getUserInfos = async () => {
      getAllProfil();

      const rep = await fetch('http://localhost:3001/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (rep.ok) {
        const user = await rep.json();
        setUserInfos(user);
      } else {
        // si je delete le cookie du jwt
        navigate('/login');
        alert('Vous avez été déconnecté');
      }
    };
    if (jwtToken) getUserInfos(); // appel de la fonction si le jwt est good
  }, [jwtToken]);

  // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
  const displayAllProfil = () => {
    const filteredUsers = allUsers
      .filter((user: User) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a: User, b: User) => a.username.localeCompare(b.username)); // alphabetic. Change to winrate sort
    let count = 1;
    const elements = filteredUsers.map((user: User) => (
      <div key={user.id} style={userElementStyle}>
        <p>RANK : {count++}</p> {/* TO CHANGE */}
         {/* USE USER */}
        {user.id === userInfos?.id ? (
          <>
            <Flex zIndex={'10'} flex_direction="row">
                <RoundButton icon={user.urlImg} icon_size={50} onClick={() => handleOpenProfil(user)}></RoundButton> {/* go to own profil */}
                <p onClick={() => handleOpenProfil(user)}>coucou cest moi: {user.username}</p>
            </Flex>
            {/* </p> */}
          </>
        ) :  (
          <>
           <Flex zIndex={'10'} flex_direction="row">
                <RoundButton icon={user.urlImg} icon_size={50} onClick={() => handleOpenProfil(user)}></RoundButton>
                <p onClick={() => handleOpenProfil(user)}>{user.username}</p>
            </Flex>
            {user.user_status ? 
              <img style={statusStyle} src={require('../../assets/imgs/icon_status_connected.png')} />
            :
              <img style={imgStyle} src={require('../../assets/imgs/icon_status_disconnected.png')} />
            }
            <UserButton user_name={user.username} id={user.id} icon_url={user.urlImg} is_friend={user.is_friend} ></UserButton>
          </>
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
  }, [searchTerm, allUsers]);

  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className="container">{userElements}</div>
      {profilVisible && (
        <AuthGuard isAuthenticated>
          <Profil user={selectedUser} onClose={closeProfil} />
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
