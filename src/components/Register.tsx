import React, { useState } from 'react';
import { registerUser } from '../services/api';

interface Props {
  onRegisterSuccess: (userId: string) => void;
}

const Register: React.FC<Props> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await registerUser({ name, email, password });
      onRegisterSuccess(user.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur inscription');
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">S’inscrire</button>
      </form>
    </div>
  );
};

export default Register;
