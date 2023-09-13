import { useEffect, useState } from 'react';
import LeaderBoard from '../Leaderboard/leaderboard';
import Cookies from 'js-cookie';

function MainPage() {
    const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputClick = async () => {
        setLeaderBoardVisible(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

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

    useEffect(() => {
        const fetchData = async () => {
            const rep = await fetch(
                'http://localhost:3001/api/user',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    },
                },
            );
            if (rep.ok) {
                const user = await rep.json();
                if (user.invites)
                    setShowNotificationBadge(true);
            } else {
                // throw
            }
        }
    fetchData(); // Appel de la fonction fetchData dans useEffect
    }, [jwtToken]); // Déclenché lorsque jwtToken change


    return (
        <>
            <div className="home">
                Main Page
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
                {showNotificationBadge && (
                    <div style={notificationBadgeStyle}>
                        <span style={notificationCountStyle}>1</span>
                    </div>
                )}
            </div>
            {leaderBoardVisible && <LeaderBoard searchTerm={searchTerm} />}
        </>
    );
}

export default MainPage;
