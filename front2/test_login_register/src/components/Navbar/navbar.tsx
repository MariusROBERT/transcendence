import { useState } from 'react';
import LeaderBoard from '../Leaderboard/leaderboard';
import Settings from '../Settings/settings';

const Navbar = () => {
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

  const handleInputClick = async () => {
    setLeaderBoardVisible(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  return (
    <>
      <div style={navbarStyle}>
        <input
          type="text"
          onClick={handleInputClick}
          placeholder="Rechercher par nom d'utilisateur"
          onChange={handleInputChange}
          value={searchTerm}
        />
        {leaderBoardVisible && (
          <button onClick={() => setLeaderBoardVisible(false)}>
            Fermer le leaderboard
          </button>
        )}
        <button onClick={openSettings}>Settings</button>
        {settingsVisible && <Settings onClose={closeSettings} />}
        {leaderBoardVisible && <LeaderBoard searchTerm={searchTerm} />}
      </div>
    </>
  );
};

const navbarStyle = {
  border: '1px solid black',
};

export default Navbar;
