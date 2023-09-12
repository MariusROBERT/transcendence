import React from 'react'

interface User {
    id: number;
    username: string;
    urlImg: string;
    user_status: string;
    winrate: number;
}

interface ProfilProps {
    user?: User | null; // Utilisation d'une prop optionnelle
    onClose: () => void;
  }

const Profil: React.FC<ProfilProps> = ({ user, onClose }) => {

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
                        <p>Image : {user.urlImg}</p>
                        <p>Statut : {user.user_status}</p>
                        <p>Winrate : {user.winrate}</p>
                        <button onClick={onClose}>Fermer</button>
                    </>
                ) : (
                    <p>Utilisateur introuvable.</p>
                )}
            </div>
        </div>
    )
}
export default Profil;
