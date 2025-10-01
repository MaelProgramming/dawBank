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

export class BankService {
  private users: User[] = [];

  constructor() {
    const saved = localStorage.getItem('users');
    if (saved) this.users = JSON.parse(saved);
  }

  private save() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  register(user: User) {
    this.users.push(user);
    this.save();
  }

  login(email: string, password: string) {
    return this.users.find(u => u.email === email && u.password === password) || null;
  }

  transfer(fromId: string, toEmail: string, amount: number) {
    const from = this.users.find(u => u.id === fromId);
    const to = this.users.find(u => u.email === toEmail);
    if (!from || !to) throw new Error('Utilisateur introuvable');
    if (from.balance < amount) throw new Error('Solde insuffisant');

    from.balance -= amount;
    to.balance += amount;

    const now = new Date();
    from.transactions.push({ id: crypto.randomUUID(), type: 'debit', amount, date: now, description: `Transfert vers ${to.email}` });
    to.transactions.push({ id: crypto.randomUUID(), type: 'credit', amount, date: now, description: `Transfert depuis ${from.email}` });

    this.save();
  }
}
