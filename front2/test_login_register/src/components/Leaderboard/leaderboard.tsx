import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Profil from "../Profil/profil";

interface LeaderboardProps {
    searchTerm: string; // Définissez le type de searchTerm
}

export default function Leaderboard({ searchTerm }: LeaderboardProps) {

    const container = {
        border: '1px solid red',
        height: '1000px'
    };

    const userElementStyle = {
        background: "grey",
        border: "1px solid black",
        color: "white",
        margin: "10px",
        padding: "10px",
        cursor: "pointer"
    };

    interface User {
        id: number;
        username: string;
        urlImg: string;
        user_status: string;
        winrate: number;
    }

    const jwtToken = Cookies.get('jwtToken');
    const [userElements, setUserElements] = useState<JSX.Element[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [profilVisible, setProfilVisible] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<User[]>([]); 

    useEffect(() => {
        // Recuperer les users dans le back
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/user/get_all_public_profile", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });
                if (response.ok) { // si ca a fonctionner
                    const users = await response.json(); // recuperer les users
                    setAllUsers(users);
                } else {
                    console.error('Erreur lors de la récupération des données des utilisateurs');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données des utilisateurs :', error);
            }
        }
        if (jwtToken) { // si le jwt est good
            fetchData();
        }
    }, [jwtToken]);

    useEffect(() => {
        // Filtrer et trier les users en fonction de searchTerm lorsque searchTerm change
        const filteredUsers = allUsers
            .filter((user: User) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a: User, b: User) =>
                a.username.localeCompare(b.username)
            );

        const elements = filteredUsers.map((user: User) => (
            <div key={user.id} style={userElementStyle}>
                <p onClick={() => handleOpenProfil(user)}>Nom d'utilisateur : {user.username} </p>
                <p>img : {user.urlImg}</p>
                <p>Status : {user.user_status}</p>
                <p>winrate : {user.winrate}</p>
            </div>
        ));
        setUserElements(elements);
    }, [searchTerm, allUsers]);

    const handleOpenProfil = (user: User) => { // open profil card
        setSelectedUser(user);
        setProfilVisible(true);
    };

    const closeProfil = () => { // close profil card
        setProfilVisible(false);
        setSelectedUser(null);
    };

    return (
        <div style={container}>leaderboard
            <div className="container">
                {userElements}
            </div>
            {profilVisible && (
                <Profil user={selectedUser} onClose={closeProfil} />
            )}
        </div>
    )
}
