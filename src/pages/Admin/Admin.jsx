// /src/pages/Admin/Admin.jsx

import React, { useState } from 'react';
import Login from '../../components/Login/Login';
import CreateJobModal from '../../components/CreateJobModal/CreateJobModal';
import AdminGrid from '../../components/AdminGrid/AdminGrid';
import AdminPostulaciones from '../../components/AdminPostulaciones/AdminPostulaciones';
import styles from './Admin.module.scss';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showPostulaciones, setShowPostulaciones] = useState(false);

  const handleLogin = (user, pass) => {
    // Validamos contra el admin "root" con contraseña vacía
    if (user === 'root' && pass === '') {
      setAuthenticated(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  // Si no está autenticado, mostramos el login
  if (!authenticated) {
    return (
      <div className={styles.container}>
        <h2>Admin Login</h2>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Si autenticado y showGrid === true, renderizamos el listado de procesos
  if (showGrid) {
    return (
      <div className={styles.container}>
        <h2>Listado de Procesos</h2>
        <button
          className={styles.button}
          onClick={() => {
            setShowGrid(false);
            // Al volver al panel principal, aseguramos ocultar postulaciones
            setShowPostulaciones(false);
          }}
        >
          Volver al panel
        </button>
        <AdminGrid />
      </div>
    );
  }

  // Si autenticado y showPostulaciones === true, renderizamos el listado de postulaciones
  if (showPostulaciones) {
    return (
      <div className={styles.container}>
        <h2>Postulaciones Recibidas</h2>
        <button
          className={styles.button}
          onClick={() => {
            setShowPostulaciones(false);
            // Al volver al panel principal, aseguramos ocultar listado de procesos
            setShowGrid(false);
          }}
        >
          Volver al panel
        </button>
        <AdminPostulaciones />
      </div>
    );
  }

  // Si autenticado y aún no se ha pedido ver procesos ni postulaciones, mostramos el panel principal
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

      {/* Botón para ver procesos (AdminGrid) */}
      <button
        className={styles.button}
        onClick={() => {
          setShowGrid(true);
          setShowPostulaciones(false);
        }}
      >
        Ver procesos
      </button>

      {/* Botón para ver postulantes (AdminPostulaciones) */}
      <button
        className={styles.button}
        onClick={() => {
          setShowPostulaciones(true);
          setShowGrid(false);
        }}
      >
        Ver postulantes
      </button>

      {/* Modal para creación de puesto */}
      <CreateJobModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Admin;
