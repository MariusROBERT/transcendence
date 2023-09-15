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
        const fetchData = async () => {
            const rep = await fetch('http://localhost:3001/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            if (rep.ok) {
                const user = await rep.json();
                if (
                    user.invites &&
                    Array.isArray(user.invites) &&
                    user.invites.length > 0
                )
                    setShowNotificationBadge(true);
            } else {
                // si je delete le cookie du jwt
                navigate('/login');
                alert('Vous avez ete deconnecte');
                // ou recreer un jwt
            }
        };
        fetchData(); // Appel de la fonction fetchData dans useEffect
    }, [jwtToken]); // Déclenché lorsque jwtToken change

    return (
        <>
            <div className='home'>
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
