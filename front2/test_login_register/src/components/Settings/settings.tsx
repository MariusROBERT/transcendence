import Cookies from 'js-cookie';
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SwitchToggle from "./switchToggle";
import bcrypt from 'bcrypt';

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
    confirmpwd: string | undefined;
    is2fa_active: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {

    const jwtToken = Cookies.get('jwtToken');
    const [salt, setSalt] = useState<string | number>('');
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
        console.log("pwd: ", modifData.password);
        console.log("LENGTH pwd: ", modifData.password?.length);
        console.log("cfrmPwd: ", modifData.confirmpwd);
        if (!isDisabled){
            if (modifData.password?.length !== undefined && (modifData.password !== modifData.confirmpwd))
            {
                setErrorMessage('les passwords ne correspondent pas !');
                return ;
            }
        }
        if (modifData.password?.length === 0 && modifData.confirmpwd?.length === 0)
            modifData.password = userInfos?.password;
        if (modifData.is2fa_active === userInfos?.is2fa_active && modifData.urlImg === userInfos.urlImg)
        {
            console.log("verif OK");
            setIsDisabled(true);
            setShowConfirmPassword(false);
            // if (modifData.password) {
            //     const hashedPwd = await bcrypt.hash(modifData.password, salt);
            //     modifData.password = hashedPwd;
            // }
            // if (modifData.password === userInfos.password)
            // {
            //     setErrorMessage('le passwords est le meme !');
            //     return ;
            // }
        }
        
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
                setSalt(user.salt);
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
                    <img style={imgStyle} src={userInfos?.urlImg} alt="" />
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

const imgStyle: React.CSSProperties = {
    width: '100px',
    border: "1px solid red",
    zIndex: '99999'
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
