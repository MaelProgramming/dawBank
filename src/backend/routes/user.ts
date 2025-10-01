import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: Date;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  transactions: Transaction[];
}

const users: User[] = [];

const router = Router();

// Inscription
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email déjà utilisé' });
  }

  const newUser: User = { id: uuidv4(), name, email, password, balance: 1000, transactions: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Identifiants invalides' });
  res.json(user);
});

// Transfert
router.post('/transfer', (req, res) => {
  const { fromId, toEmail, amount, description } = req.body;

  const from = users.find(u => u.id === fromId);
  const to = users.find(u => u.email === toEmail);

  if (!from || !to) return res.status(404).json({ message: 'Utilisateur introuvable' });
  if (from.balance < amount) return res.status(400).json({ message: 'Solde insuffisant' });

  from.balance -= amount;
  to.balance += amount;

  const now = new Date();

  const debitTransaction: Transaction = {
    id: uuidv4(),
    type: 'debit',
    amount,
    date: now,
    description: description || `Transfert vers ${to.email}`
  };

  const creditTransaction: Transaction = {
    ...debitTransaction,
    id: uuidv4(),
    type: 'credit',
    description: `Transfert depuis ${from.email}`
  };

  from.transactions.push(debitTransaction);
  to.transactions.push(creditTransaction);

  res.json({ from, to });
});

// Récupérer l’historique
router.get('/:userId/transactions', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
  res.json(user.transactions);
});

// Lister tous les utilisateurs (pour test/debug)
router.get('/', (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    balance: u.balance,
    transactions: u.transactions
  }));
  res.json(safeUsers);
});

export default router;
