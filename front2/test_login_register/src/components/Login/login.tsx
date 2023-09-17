import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RedirectToHome } from '../Utils/set_cookie_redirect';
import { FormData } from '../../utils/interfaces';

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
      });
      if (response.ok) {
        RedirectToHome(navigate, response);
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        console.error(`Échec de connection. Error `, response.status);
      }
    } catch (error) {
      console.error(`Error Interne : ${error}`);
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
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
