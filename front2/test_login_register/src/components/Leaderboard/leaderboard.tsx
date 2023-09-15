import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Profil from '../Profil/profil';
import { useNavigate } from 'react-router-dom';

interface LeaderboardProps {
    searchTerm: string; // Définissez le type de searchTerm
}

export default function Leaderboard({ searchTerm }: LeaderboardProps) {
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwtToken');
    const [userElements, setUserElements] = useState<JSX.Element[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [profilVisible, setProfilVisible] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3001/api/user/get_all_public_profile',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    },
                );
                if (response.ok) {
                    const users = await response.json(); // recuperer les users
                    setAllUsers(users);
                } else {
                    console.error(
                        'Erreur lors de la récupération des données des utilisateurs. Error',
                        response.status,
                    );
                    navigate('/login');
                    alert('Vous avez ete deconnecte');
                }
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des données des utilisateurs :',
                    error,
                );
            }
        };
        if (jwtToken) {
            fetchData(); // appel de la fonction si le jwt est good
        }
    }, [jwtToken]);

    useEffect(() => {
        // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
        const filteredUsers = allUsers
            .filter((user: User) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .sort((a: User, b: User) => a.username.localeCompare(b.username)); // alphabetic. Change to winrate sort

        const elements = filteredUsers.map((user: User) => (
            <div key={user.id} style={userElementStyle}>
                <p onClick={() => handleOpenProfil(user)}>
                    Nom d'utilisateur : {user.username}{' '}
                </p>
                <img style={imgStyle} src={user?.urlImg} />
                <p>Status : {user.user_status}</p>
                <p>winrate : {user.winrate}</p>
            </div>
        ));
        setUserElements(elements);
    }, [searchTerm, allUsers]);

    const handleOpenProfil = (user: User) => {
        // open profil card
        setSelectedUser(user);
        setProfilVisible(true);
    };

    const closeProfil = () => {
        // close profil card
        setSelectedUser(null);
        setProfilVisible(false);
    };

    return (
        <div style={container}>
            leaderboard
            <div className='container'>{userElements}</div>
            {profilVisible && (
                <Profil user={selectedUser} onClose={closeProfil} />
            )}
        </div>
    );
}

const container = {
    border: '1px solid red',
    height: '1000px',
};

const imgStyle = {
    width: '100px',
};

const userElementStyle = {
    background: 'grey',
    border: '1px solid black',
    color: 'white',
    margin: '10px',
    padding: '10px',
    cursor: 'pointer',
};

interface User {
    id: number;
    username: string;
    urlImg: string;
    user_status: string;
    winrate: number;
    is_friend: boolean;
}
