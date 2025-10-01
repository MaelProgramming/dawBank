import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: Date;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  transactions: Transaction[];
}

export const users: User[] = [];
