import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';

interface Props { userId: string }
interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
}

const Transactions: React.FC<Props> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions(userId).then(data => setTransactions(data));
  }, [userId]);

  return (
    <div className="transaction-table">
      <h2>Historique des transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleString()}</td>
              <td>{t.type}</td>
              <td>{t.amount} €</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
