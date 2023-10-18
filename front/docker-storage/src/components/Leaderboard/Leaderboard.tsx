import { CSSProperties, useEffect, useState } from 'react';
import { UserBanner } from '..';
import { IUser, LeaderboardProps } from '../../utils/interfaces';
import { Fetch } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';

export function Leaderboard({ searchTerm }: LeaderboardProps) {
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { fetchContext, user } = useUserContext();
  const { fetchFriendsRequestContext } = useFriendsRequestContext();
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < 650);
  useEffect(() => {
    setMobile(window.innerWidth < 650);
  }, [window.innerWidth]);

  useEffect(() => {
    fetchContext();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getAllProfil = async () => {
      await fetchFriendsRequestContext();
      let cancelled = false;
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (cancelled) { // todo : voir si cest utile ici
        return;
      }
      if (users && Array.isArray(users) && users.length === 0)
        setErrorMessage('Aucun utilisateur trouvé.');
      else setAllUsers(users);

      return () => {
        cancelled = true;
      };
    };
    getAllProfil();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
    function filterAndSortUsers() {
      if (!allUsers)
        return (<p>No user</p>);
      const filteredUsers = allUsers
        .filter((user: IUser) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a: IUser, b: IUser) => a.username.localeCompare(b.username)); // TODO: sort by ELO

      const elements = filteredUsers.map((user: IUser) => (
        <div key={user.id} style={userElementStyle}>
          <p>{'RANK'}</p> {/* TO CHANGE */}
          {<UserBanner otherUser={user} />}
          <p>ELO pt</p>
        </div>
      ));
      setUserElements(elements);
    }

    filterAndSortUsers();
  }, [searchTerm, allUsers, user]);

  const container: CSSProperties = {
    background: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    maxHeight: '500px',
    overflowY: 'scroll',
    // width: mobile ? 200 : 700,
  };

  const userElementStyle: CSSProperties = {
    maxWidth: mobile ? 500 : 600,
    border: '1px solid white',
    flexWrap: 'nowrap',
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'center',
    background: '#646464',
    color: 'white',
    margin: '10px 0',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '10px',
  };


  return (
    <div style={container}>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
      <div className='container'>{userElements}</div>
      {userElements.length === 0 && !errorMessage && (
        <div style={{ color: 'white', marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No user found.</p>
          </div>
          <div style={{ ...userElementStyle, visibility: 'hidden' }} />
        </div>
      )
      }
    </div>
  );
}
