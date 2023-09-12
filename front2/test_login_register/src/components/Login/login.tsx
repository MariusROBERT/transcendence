import React, { ChangeEvent, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

interface FormData {
	username: string;
	password: string;
}

const Login: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		username: '',
		password: '',
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

	if (formData.username !== "" && formData.password !== "") {
		try {
			const response = await fetch('http://localhost:3001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.username,
					password: formData.password,
				}),
			})
			if (response.ok) { // stocker jwt dans cookie
				const jwt = await response.json();
				Cookies.set('jwtToken', jwt['access-token'], { expires: 7 }); // 7 jours
				navigate("/");
			}
			else
				setErrorMessage("Ce user n'est pas connue de la base de donnée !");
		} catch (error) {
			setErrorMessage("Ce user n'est pas connue de la base de donnée !");
			console.error(`Error : ${error}`);	}
	}

  };

  return (
    <div>
      <h2>Connexion</h2>
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
			{errorMessage && <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>}
			<button type="submit">Se connecter</button>
		</form>
    </div>
  );
};

export default Login;
