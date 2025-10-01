import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';

interface Props {
  userId: string;
}

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
    <div>
      <h2>Historique des transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            [{t.type}] {t.amount} € - {t.description} ({new Date(t.date).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
