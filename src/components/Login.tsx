import React, { useState } from 'react';
import { loginUser } from '../services/api';

interface Props {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser({ email, password });
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur login');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
