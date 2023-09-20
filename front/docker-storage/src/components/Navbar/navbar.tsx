import { useState } from 'react';
import Settings from '../Settings/settings';

const Navbar = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  return (
    <>
      <div style={navbarStyle}>
        <button onClick={openSettings}>Settings</button>
        {settingsVisible && <Settings onClose={closeSettings} isVisible={settingsVisible} />}
      </div>
    </>
  );
};

const navbarStyle = {
  border: '1px solid black',
};

export default Navbar;
