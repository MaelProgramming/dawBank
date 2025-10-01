import React, { useState } from 'react';
import { payWithCard } from '../services/api';

interface Props {
  userId: string;
  onPaymentSuccess?: (newBalance: number) => void;
}

const CardPayment: React.FC<Props> = ({ userId, onPaymentSuccess }) => {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(''); // MM/YY
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('Utilisateur non connecté');
      setSuccess(false);
      return;
    }
    if (!cardHolder || !cardNumber || !expiry || !cvv || !amount) {
      setMessage('Remplis tous les champs');
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const data = await payWithCard({
        userId,
        amount: Number(amount),
        cardNumber,
        expiry,
        cvv,
        cardHolder,
        description: `Paiement CB ${cardNumber.slice(-4)}`
      });
      setMessage(`✅ ${data.message} - Solde : ${data.balance} €`);
      setSuccess(true);
      onPaymentSuccess?.(data.balance);
      // reset fields except card holder for demo
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setAmount('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erreur paiement');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-box">
      <h3>Paiement par carte (simulé)</h3>
      {message && <p style={{ color: success ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Titulaire" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
        <input placeholder="Numéro de carte (xxxx xxxx xxxx xxxx)" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} style={{ width: 100 }} />
          <input placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} style={{ width: 80 }} />
          <input placeholder="Montant" type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: 120 }} />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Traitement...' : 'Payer'}
        </button>
      </form>
    </div>
  );
};

export default CardPayment;
