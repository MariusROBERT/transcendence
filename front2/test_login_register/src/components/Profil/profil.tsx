import React from 'react';
import FriendButtons from './friend_buttons';
import UserButtons from './user_buttons';

interface User {
    id: number;
    username: string;
    urlImg: string;
    user_status: string;
    winrate: number;
	is_friend: boolean;
}

interface ProfilProps {
    user?: User | null; // Utilisation d'une prop optionnelle
    onClose: () => void;
}

const Profil: React.FC<ProfilProps> = ({ user, onClose }) => {
	if (user?.is_friend === true)
		console.log();
		
    const profilContainer: React.CSSProperties = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // S'assurer que le profil est au-dessus du leaderboard
    };

    const profilContent = {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
    };

    return (
        <div style={profilContainer}>
            <div style={profilContent}>
                {user ? (
                    <>
                        <h2>Profil de {user.username}</h2>
                        <p>ID : {user.id}</p>
                        <img src={user.urlImg}></img>
                        <p>Statut : {user.user_status}</p>
                        <p>Winrate : {user.winrate}</p>
                        <button onClick={onClose}>Fermer</button>
                    </>
                ) : (
                    <p>Utilisateur introuvable.</p>
                )}
				{user?.is_friend ? (
					<FriendButtons/>
				) : (
					<UserButtons id={user?.id}/>
				)}
            </div>
        </div>
    );
};
export default Profil;
