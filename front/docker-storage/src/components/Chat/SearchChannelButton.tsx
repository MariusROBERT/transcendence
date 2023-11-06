import { Fetch } from '../../utils';
import { useUIContext } from '../../contexts/UIContext/UIContext';

/*
  //  If channel exist just join it and open right pannel
  //  If channel is private just send an error
  //  If channel protected by password, open ask for password pannel
        //  If right ^ go to first option, if not ^ go to second option
  //  If channel not exist open channel creation
    //  In channel creation you can set name, password, type, and directly add users/admin
*/
export function SearchChannelButton() {
  const { setIsChatMenuOpen, setChannels } = useUIContext();

  //  TODO: clean here
  async function OnJoinChannel() {
    const res = await Fetch('channel/public_all', 'GET');
    setChannels(res?.json);
    setIsChatMenuOpen(true);
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', width: '50%'}}>
       <button
        style={{
          padding: '15px',
          borderRadius: '10px',
          border: '0',
          position: 'relative',
          width: '200px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.3em',
          backgroundColor: 'white',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
        onClick={() => {
          OnJoinChannel();
        }}
      >Search Channel</button>
    </div>
  );
}