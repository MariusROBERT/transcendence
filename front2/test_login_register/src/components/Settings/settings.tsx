import Cookies from 'js-cookie';
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SwitchToggle from "./switchToggle"; 

interface SettingsProps {
    onClose: () => void;
}

interface UserInfos {
    urlImg: string;
    password: string | undefined;
    is2fa_active: boolean;
}

interface Modifications {
    urlImg: string;
    password: string | undefined;
    confirmpwd: string;
    is2fa_active: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {

    const jwtToken = Cookies.get('jwtToken');
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password'); // Type initial : password
    const [userInfos, setUserInfos] = useState<UserInfos>();
    const [modifData, setModifData] = useState<Modifications>({
        urlImg: '',
        password: '',
        confirmpwd: '',
        is2fa_active: false
    });

    const unlockValue = () => {
        setIsDisabled(false);
        setShowConfirmPassword(true);
    }

    const togglePasswordVisibility = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    }

    const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(modifData);
        if (modifData.password?.length != 0 && modifData.password != modifData.confirmpwd)
        {
            setErrorMessage('les passwords ne correspondent pas !');
            return ;
        }
        if (modifData.password?.length === 0 && modifData.confirmpwd.length === 0)
            modifData.password = userInfos?.password;

        
        const rep = await fetch(
            'http://localhost:3001/api/user',
            {
                method: 'PATCH',
                body: JSON.stringify({
                    password: modifData.password,
                    is2fa_active: modifData.is2fa_active,
                    urlImg: modifData.urlImg
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            },
            );
            if (rep.ok) {
                const user = await rep.json();
                setUserInfos(user);
                console.log("coucou: ", user);
            } else { // si je delete le cookie du jwt
                navigate('/login');
                alert("Vous avez ete deconnecte");
                // ou recreer un jwt  
            }
            setIsDisabled(true);
            setShowConfirmPassword(false);
            setErrorMessage('');
    };

    useEffect(() => {
        console.log("une seule fois");

        const getUserInfos = async () => {
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
                    setUserInfos(user);
                    console.log("coucou: ", user); // jai pas pwd
                } else { // si je delete le cookie du jwt
                    navigate('/login');
                    alert("Vous avez ete deconnecte");
                }
            }
            if (jwtToken) {
                getUserInfos(); // appel de la fonction si le jwt est good
        }
    }, [jwtToken]);
    
    return (
        <div>
            <form onSubmit={saveModifications} style={settingsStyle}>
                <button onClick={onClose}>Fermer</button>
                <div style={modifContainer}> {/* IMG */}
                    <img src="" alt="" />
                    <input type="file" />
                </div>
                <div style={modifContainer}> {/* PWD */}
                    <input
                        type={passwordType}
                        onChange={(e) => setModifData({ ...modifData, password: e.target.value })}
                        disabled={isDisabled}
                        placeholder='password'
                    />
                    {showConfirmPassword && (
                        <div style={modifContainer}>
                            <input
                                type={passwordType}
                                value={modifData.confirmpwd}
                                onChange={(e) => setModifData({ ...modifData, confirmpwd: e.target.value })}
                                placeholder="Confirm Password"
                            />
                        </div>
                    )}
                    {showConfirmPassword && (
                        <button type="button" onClick={togglePasswordVisibility}>
                            {passwordType === 'password' ? 'Afficher' : 'Masquer'}
                        </button>
                    )}
                    <button type='button' onClick={unlockValue} >Modifier</button>
                </div>
                <div style={modifContainer}> {/* 2FA */}
                    <p>2FA</p>
                    <SwitchToggle onChange={(change) => setModifData({ ...modifData, is2fa_active: change})} /> {/*recup l'etat de base du 2fa*/}
                </div>
                {errorMessage && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                        {errorMessage}
                    </div>
                )}
                <button type="submit">Enregistrer</button>
            </form>
        </div>
    )
}

const settingsStyle: React.CSSProperties = {
    alignItems: 'center',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    background: 'grey',
    border: '1px solid black',
    color: 'white',
    margin: '10px',
    padding: '10px',
    cursor: 'pointer',
};

const modifContainer: React.CSSProperties = {
    display: 'flex',
};

export default Settings
