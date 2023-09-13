import React, { useState, ChangeEvent, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
}

function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // FONCTION REGISTER & REDIRECTION TO MAIN PAGE
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.username !== '' && formData.password !== '') {
            if (formData.password === formData.confirmPassword) {
                try { // REGISTER
                    const response = await fetch(
                        'http://localhost:3001/api/auth/register',
                        {
                            method: 'POST',

                            body: JSON.stringify({
                                username: formData.username,
                                password: formData.password,
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                    if (response.ok) {
                        console.log('Inscription réussie !');
                        try {  // LOGIN ET REDIRECTION
                            const response = await fetch(
                                'http://localhost:3001/api/auth/login',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        username: formData.username,
                                        password: formData.password,
                                    }),
                                },
                            );
                            if (response.ok) {
                                const jwt = await response.json();
                                Cookies.set('jwtToken', jwt['access-token'], { // stocker jwt dans cookie
                                    expires: 7,
                                }); // 7 jours
                                navigate('/');
                            }
                        } catch (error) {
                            console.error(
                                "Erreur lors de l'envoi de la requête :",
                                error,
                            );
                        }
                    } else {
                        setErrorMessage('Ce username est deja pris !');
                        console.error("Échec de l'inscription. Error", response.status);
                    }
                } catch (error) {
                    console.error(
                        "Erreur lors de l'envoi de la requête :",
                        error,
                    );
                }
            } else {
                setErrorMessage('Les mots de passe ne correspondent pas !');
            }
        }
    };

    return (
        <div>
            <h2>Page d'Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {errorMessage && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                        {errorMessage}
                    </div>
                )}
                <button type="submit">S'Inscrire</button>
            </form>
        </div>
    );
}

export default Register;
