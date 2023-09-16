import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';

function MainPage() {
  const notificationBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'red',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const notificationCountStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const jwtToken = Cookies.get('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
		let cancelled = false;
			fetch('http://localhost:3001/api/user', {
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
          return ;
				}
        return res.json();
      })
      .then((user) => {
        if (cancelled) {
          return
        }
				else {
          if (
            user.invites &&
            Array.isArray(user.invites) &&
            user.invites.length > 0
            ) {
              setShowNotificationBadge(true);
            }
        }
      })
    return () => {
      cancelled = true;
    }
  }, [jwtToken]);
  
  return (
    <>
      <div className="home">
        <Navbar />
        {showNotificationBadge && (
          <div style={notificationBadgeStyle}>
            <span style={notificationCountStyle}>1</span>
          </div>
        )}
      </div>
    </>
  );
}

export default MainPage;
