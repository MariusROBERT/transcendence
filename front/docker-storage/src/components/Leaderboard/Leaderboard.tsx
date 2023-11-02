import { CSSProperties, useEffect, useState } from 'react';
import { Popup, SearchBar, UserBanner } from '..';
import { IUser } from '../../utils/interfaces';
import { Fetch, color } from '../../utils';
import { useFriendsRequestContext, useUserContext } from '../../contexts';
import { useUIContext } from '../../contexts/UIContext/UIContext';

export function Leaderboard({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (value: string) => void }) {
  const [userElements, setUserElements] = useState<JSX.Element[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { fetchContext, user } = useUserContext();
  const { fetchFriendsRequestContext } = useFriendsRequestContext();
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < 650);
  const { isLeaderboardOpen, setIsLeaderboardOpen } = useUIContext();

  useEffect(() => {
    setMobile(window.innerWidth < 650);
  }, [window.innerWidth]);

  useEffect(() => {
    fetchContext();
    // eslint-disable-next-line
  }, [isLeaderboardOpen]);

  useEffect(() => {
    const getAllProfil = async () => {
      await fetchFriendsRequestContext();
      const users = (await Fetch('user/get_all_public_profile', 'GET'))?.json;
      if (!users)
        return;
      setAllUsers(users);
    };
    getAllProfil();
    // eslint-disable-next-line
  }, [isLeaderboardOpen]);

  useEffect(() => {
    // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
    function filterAndSortUsers() {
      if (!allUsers)
        return (<p>No user</p>);
      const rankedUsers = allUsers
        .filter((user: IUser) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
          && user.rank != 0
        )
        .sort((a: IUser, b: IUser) => (a.rank - b.rank)); // TODO: sort by ELO
       const unrankedUsers =  allUsers.filter((user: IUser) =>
       user.username.toLowerCase().includes(searchTerm.toLowerCase())
       && user.rank == 0);
       const sortedUsers = [...rankedUsers, ...unrankedUsers];

      const elements = sortedUsers.map((user: IUser) => (
        <div key={user.id} style={userElementStyle}>
          <p>{user.rank > 0 ? user.rank : 'NC'}</p>
          {<UserBanner otherUser={user} />}
          <p style={{ fontWeight: 'bold' }}>{user.elo}</p>
        </div>
      ));
      setUserElements(elements);
    }

    filterAndSortUsers();
  }, [searchTerm, allUsers, user]);

  const container: CSSProperties = {
    background: '#00375C',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    maxHeight: '500px',
    overflowY: 'scroll',
    borderRadius: '50px',
    // width: mobile ? 200 : 700,
  };

  const userElementStyle: CSSProperties = {
    maxWidth: mobile ? 500 : 600,
    borderBottom: '2px solid white',
    flexWrap: 'nowrap',
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'center',
    background: `radial-gradient(circle, ${color.blue} 0%,  ${color.light_blue} 100%)`,
    color: 'white',
    margin: '10px 0',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '50px',
  };

  if (!isLeaderboardOpen)
    return (<></>);

  return (
    <Popup isVisible={isLeaderboardOpen} onClose={() => { setIsLeaderboardOpen(false) }}>
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBar setSearchTerm={setSearchTerm}
            isVisible={isLeaderboardOpen}
            id={'searchBar'}>
            {'search for a user...'}
          </SearchBar>
        </div>
        <div style={{display:'flex', flexDirection:'row'}}>
        <p style={ProfilStyle}>Rank </p>
        <p style={ProfilStyle}>Username </p>
        <p style={{position:'absolute', right:'0', ...ProfilStyle}}>Elo</p>
        </div >
        <div  style={{maxHeight: '600px', overflowY: 'scroll'}}>
        {userElements}
        {userElements.length === 0 && (
          <div style={{ color: 'white', marginTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <p>No user found.</p>
            </div>
          </div>)}
        </div>
      </div>
    </Popup>
  );
}

const ProfilStyle: CSSProperties = {
  minWidth: '13ch',
  fontSize:'20px'
};
