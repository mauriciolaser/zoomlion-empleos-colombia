import React, { useState } from 'react';
import Login from '../Login/Login';
import styles from './Admin.module.scss';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (user, pass) => {
    if (user === 'user' && pass === 'pass') {
      setAuthenticated(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <h2>Admin Login</h2>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Panel de Administración</h2>
      <button className={styles.button}>Crear proceso</button>
      <button className={styles.button}>Ver procesos</button>
      <button className={styles.button}>Ver postulantes</button>
    </div>
  );
};

export default Admin;
