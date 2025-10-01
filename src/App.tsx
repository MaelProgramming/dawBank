import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import Transfer from './components/Transfer';
import Transactions from './components/Transactions';

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <div className="App">
      <h1>Mon Application Bancaire</h1>

      {!user && (
        <>
          <Register onRegisterSuccess={(id) => alert(`Inscrit avec l'ID ${id}`)} />
          <Login onLoginSuccess={(u) => setUser(u)} />
        </>
      )}

      {user && (
        <>
          <p>Connecté : {user.name} ({user.email}) - Solde : {user.balance} €</p>
          <Transfer userId={user.id} />
          <Transactions userId={user.id} />
          <UserList />
        </>
      )}
    </div>
  );
}

export default App;
