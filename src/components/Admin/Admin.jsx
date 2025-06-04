import React, { useState } from 'react';
import Login from '../Login/Login';
import CreateJobModal from '../CreateJobModal/CreateJobModal';
import styles from './Admin.module.scss';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = (user, pass) => {
    // Validamos contra el admin "root" con contraseña vacía
    if (user === 'root' && pass === '') {
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

      {/* Botón que abre el modal de creación */}
      <button
        className={styles.button}
        onClick={() => setShowModal(true)}
      >
        Crear proceso
      </button>

      {/* Redirigir a listing en PHP tal como antes */}
      <button
        className={styles.button}
        onClick={() => (window.location.href = '/admin/index.php?action=listar')}
      >
        Ver procesos
      </button>

      <button className={styles.button}>Ver postulantes</button>

      {/* Modal para creación de puesto */}
      <CreateJobModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Admin;
