import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import Transfer from './components/Transfer';
import Transactions from './components/Transactions';
import { payWithCard } from './services/api';
import './App.css';

interface Payment {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [payment, setPayment] = useState<Payment>({ cardHolder:'', cardNumber:'', expiry:'', cvv:'', amount:0 });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Générer carte de test Luhn valide
  const generateTestCard = () => {
    setPayment({
      ...payment,
      cardNumber: '4242424242424242',
      expiry: '12/30',
      cvv: '123',
      cardHolder: user.name
    });
  };

  const handlePaySubmit = async () => {
    // Simulation de refus aléatoire 10%
    if (Math.random() < 0.1) {
      setMessage('❌ Paiement refusé par la banque (simulé)');
      setSuccess(false);
      setShowConfirm(false);
      return;
    }

    try {
      const data = await payWithCard({
        userId: user.id,
        cardHolder: payment.cardHolder,
        cardNumber: payment.cardNumber,
        expiry: payment.expiry,
        cvv: payment.cvv,
        amount: payment.amount,
        description: `Paiement CB ${payment.cardNumber.slice(-4)}`
      });
      setMessage(`✅ ${data.message} - Nouveau solde : ${data.balance} €`);
      setSuccess(true);
      setUser({ ...user, balance: data.balance });
      setPayment({ cardHolder:'', cardNumber:'', expiry:'', cvv:'', amount:0 });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erreur paiement');
      setSuccess(false);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="app">
      <h1>🏦 Banque React</h1>

      {!user && (
        <div className="auth-container">
          <Register onRegisterSuccess={(id) => alert(`Inscrit avec l'ID ${id}`)} />
          <Login onLoginSuccess={(u) => setUser(u)} />
        </div>
      )}

      {user && (
        <>
          {/* Header */}
          <div className="dashboard-header">
            <div className="user-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <div className="balance-section">
              <p>Solde : <span className="balance">{user.balance} €</span></p>
              <button className="logout-btn" onClick={() => setUser(null)}>Déconnexion</button>
            </div>
          </div>

          {/* Dashboard */}
          <div className="dashboard">
            <div className="dashboard-left">
              {/* Transfert entre utilisateurs */}
              <Transfer userId={user.id} />

              {/* Paiement CB */}
              <div className="transfer-box">
                <h3>Paiement par carte (simulé)</h3>
                <button onClick={generateTestCard} style={{marginBottom:5}}>🃏 Générer carte test</button>
                {message && <p style={{color: success ? 'green' : 'red'}}>{message}</p>}
                <form onSubmit={e => { e.preventDefault(); setShowConfirm(true); }}>
                  <input placeholder="Titulaire" value={payment.cardHolder} onChange={e=>setPayment({...payment, cardHolder:e.target.value})} />
                  <input placeholder="Numéro de carte" value={payment.cardNumber} onChange={e=>setPayment({...payment, cardNumber:e.target.value})} />
                  <div style={{display:'flex', gap:8, marginTop:5}}>
                    <input placeholder="MM/YY" value={payment.expiry} onChange={e=>setPayment({...payment, expiry:e.target.value})} style={{width:100}} />
                    <input placeholder="CVV" value={payment.cvv} onChange={e=>setPayment({...payment, cvv:e.target.value})} style={{width:80}} />
                    <input placeholder="Montant" type="number" value={payment.amount} onChange={e=>setPayment({...payment, amount:Number(e.target.value)})} style={{width:120}} />
                  </div>
                  <button type="submit" style={{marginTop:8}}>Payer</button>
                </form>

                {/* Modal de confirmation */}
                {showConfirm && (
                  <div className="modal">
                    <div className="modal-content">
                      <p>Confirmer le paiement de {payment.amount} € ?</p>
                      <button onClick={handlePaySubmit}>Oui</button>
                      <button onClick={()=>setShowConfirm(false)}>Annuler</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Historique */}
              <Transactions userId={user.id} />
            </div>

            <div className="dashboard-right">
              <UserList />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
