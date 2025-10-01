import React, { useState } from 'react';
import { transferMoney } from '../services/api';

interface Props { userId: string }

const Transfer: React.FC<Props> = ({ userId }) => {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transferMoney({ fromId: userId, toEmail, amount });
      setMessage('Transfert effectué ! ✅');
      setSuccess(true);
      setToEmail(''); setAmount(0);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erreur transfert ❌');
      setSuccess(false);
    }
  };

  return (
    <div className="transfer-box">
      <h2>Transfert</h2>
      {message && <p style={{ color: success ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email destinataire" value={toEmail} onChange={e => setToEmail(e.target.value)} />
        <input type="number" placeholder="Montant" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Transfer;
