import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const registerUser = async (user: {name: string, email: string, password: string}) => {
  const res = await axios.post(`${API_URL}/register`, user);
  return res.data;
};

export const loginUser = async (credentials: {email: string, password: string}) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

export const transferMoney = async (transfer: {fromId: string, toEmail: string, amount: number, description?: string}) => {
  const res = await axios.post(`${API_URL}/transfer`, transfer);
  return res.data;
};

export const getTransactions = async (userId: string) => {
  const res = await axios.get(`${API_URL}/${userId}/transactions`);
  return res.data;
};
export const payWithCard = async (payload: {
  userId: string;
  amount: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
  description?: string;
}) => {
  const res = await axios.post(`${API_URL}/pay`, payload);
  return res.data;
};