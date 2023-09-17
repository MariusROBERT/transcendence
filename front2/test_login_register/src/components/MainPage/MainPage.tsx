import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';
import { UserAndInvites } from '../../utils/interfaces';

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
          return;
        }
        return res.json();
      })
      .then((user) => {
        if (cancelled) {
          return;
        } else {
          if (
            user.invites &&
            Array.isArray(user.invites) &&
            user.invites.length > 0
          ) {
            fetch('http://localhost:3001/api/user/get_all_public_profile', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`, // Assurez-vous d'inclure l'authentification si nécessaire
              },
            })
              .then((response) => response.json())
              .then((allProfiles) => {
                // 2. Filtrer les profils pour ceux correspondant aux IDs dans 'user.invites'
                const invitedProfiles = allProfiles.filter(
                  (profile: UserAndInvites) =>
                    user.invites.includes(profile.id),
                );

                // 3. Afficher les noms d'utilisateur des profils invités
                invitedProfiles.forEach((profile: UserAndInvites) => {
                  console.log(`Nom d'utilisateur invité : ${profile.username}`);
                });
              })
              .catch((error) => {
                console.error(
                  "Une erreur s'est produite lors de la récupération des profils:",
                  error,
                );
                // Gérez l'erreur ici
              });
            setShowNotificationBadge(true);
          }
        }
      });
    return () => {
      cancelled = true;
    };
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
