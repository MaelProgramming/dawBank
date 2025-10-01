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
// Ajoute en haut du fichier si nécessaire (déjà présents dans ton fichier actuel)
// import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// ...
// const router = Router();
// const users: User[] = [];

function luhnCheck(cardNumber: string): boolean {
  // Luhn algorithm (simple validation)
  const sanitized = cardNumber.replace(/\s+/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function maskCard(cardNumber: string) {
  const sanitized = cardNumber.replace(/\s+/g, '');
  if (sanitized.length <= 4) return sanitized;
  const last4 = sanitized.slice(-4);
  return '**** **** **** ' + last4;
}

// Endpoint : paiement par carte (simulé)
router.post('/pay', (req, res) => {
  const {
    userId,
    amount,
    cardNumber,
    expiry,   // ex: "12/26"
    cvv,      // on n'enregistrera pas le cvv
    cardHolder,
    description
  } = req.body;

  // validations basiques
  if (!userId || !amount || !cardNumber || !expiry || !cvv || !cardHolder) {
    return res.status(400).json({ message: 'Champs manquants pour le paiement' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Montant invalide' });
  }

  // Vérifier carte (Luhn)
  if (!luhnCheck(cardNumber)) {
    return res.status(400).json({ message: 'Numéro de carte invalide' });
  }

  // Optionnel : vérifier la date d'expiration simple (MM/YY)
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) {
    return res.status(400).json({ message: 'Date d\'expiration invalide (format MM/YY)' });
  }
  const mm = parseInt(match[1], 10);
  const yy = parseInt(match[2], 10);
  if (mm < 1 || mm > 12) {
    return res.status(400).json({ message: 'Mois d\'expiration invalide' });
  }
  // comparaison simple année/mois (assume 2000+)
  const now = new Date();
  const expiryDate = new Date(2000 + yy, mm - 1, 1);
  const expiryEnd = new Date(expiryDate.getFullYear(), expiryDate.getMonth() + 1, 0); // dernier jour du mois
  if (expiryEnd < now) {
    return res.status(400).json({ message: 'Carte expirée' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

  if (user.balance < amount) return res.status(400).json({ message: 'Solde insuffisant' });

  // Simuler paiement : débiter le compte
  user.balance -= amount;

  const nowDate = new Date();
  const tx: Transaction = {
    id: uuidv4(),
    type: 'debit',
    amount,
    date: nowDate,
    description: description || `Paiement CB ${maskCard(cardNumber)}`
  };

  user.transactions.push(tx);

  // Note : on NE stocke PAS le CVV et on n'enregistre que la carte masquée si besoin
  // Réponse : transaction et solde
  res.json({
    message: 'Paiement accepté (simulé)',
    transaction: tx,
    balance: user.balance,
    card: maskCard(cardNumber) // uniquement pour affichage
  });
});

export default router;
