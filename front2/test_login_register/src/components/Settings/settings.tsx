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
    password: string;
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

    let pwd:any = '';

// recuperation des donnees du user et surtout de l'etat is2fa_active pour afficher
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
                },);
            if (rep.ok) {
                const user = await rep.json();
                setUserInfos(user);
                pwd = userInfos?.password;
                console.log("ici: ", userInfos?.is2fa_active);
            } else { // si je delete le cookie du jwt
                navigate('/login');
                alert("Vous avez été déconnecté");
            }
        }
        if (jwtToken) 
            getUserInfos(); // appel de la fonction si le jwt est good
    }, [jwtToken]);


// MODIFICATIONS
    // A REVOIR (verifications des inputs):


// je pense qu il faut faire un dto pour modification image et is2fa_active et un autre dto pour le mot de passe, comme 
// ca quand le mot de passe est toucher mais pas remplie on envois rien, auqnd le mot de passe est toucher, rempli et identique 
// au confirm alors on appel /user/update_pwd avec le dto en question, on le hash etc..
// quant au reste ca ne change rien

// a faire : dans front : spliter les interfaces userinfos (pwd / le reste)
//          dans le back : faire un dto juste pwd (UpdatePwdDto: FAIT), et une autre route PATCH 'change_password'

    const saveModifications = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (modifData.confirmpwd === '' && modifData.password === '' && modifData.urlImg === '' && modifData.is2fa_active === userInfos?.is2fa_active)
            return ;
        if (!isDisabled){
            if (modifData.password?.length !== undefined && (modifData.password !== modifData.confirmpwd))
            {
                setErrorMessage('les passwords ne correspondent pas !');
                return ;
            }
        }
        // if (modifData.password?.length === 0 && modifData.confirmpwd?.length === 0)
        // {
        //     console.log(modifData.password); // == ''
        //     console.log(userInfos?.password); // undifined
            
        //     modifData.password = userInfos?.password;
        // }
        if (modifData.is2fa_active === userInfos?.is2fa_active && modifData.urlImg === userInfos.urlImg)
        {
            console.log("verif OK");
            setIsDisabled(true);
            setShowConfirmPassword(false);
        }
        
        const rep = await fetch(
            'http://localhost:3001/api/user', // PATCH
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
            },);
            if (rep.ok) {
                const user = await rep.json();
                setUserInfos(user);
            } else {
                navigate('/login');
                alert("Vous avez été déconnecté");
                // ou recreer un jwt  
            }
            setIsDisabled(true);
            setShowConfirmPassword(false);
            setErrorMessage('');
    };

    return (
        <div>
            <form onSubmit={saveModifications} style={settingsStyle}>
                <button onClick={onClose}>Fermer</button>
                <div style={modifContainer}> {/* IMG */}
                    <img style={imgStyle} src={userInfos?.urlImg} alt="" />
                    <input type="file"
                        onChange={(e) => setModifData({ ...modifData, urlImg: e.target.value })}
                    />
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
                    <SwitchToggle onChange={(change) => setModifData({ ...modifData, is2fa_active: change })}
                    checked={userInfos?.is2fa_active || false} /> 
                        {/*recup l'etat de base du 2fa*/}
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
