import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';

interface User { id: string; name: string; email: string; balance: number }

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  return (
    <div className="user-list">
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email}) - Solde : {u.balance} €</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
