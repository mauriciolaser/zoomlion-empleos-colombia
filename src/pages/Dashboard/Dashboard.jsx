import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/Auth';
import CreateJobModal from '../../components/CreateJobModal/CreateJobModal';
import AdminGrid from '../../components/AdminGrid/AdminGrid';
import AdminPostulaciones from '../../components/AdminPostulaciones/AdminPostulaciones';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  /* Protección de ruta */
  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true });
  }, [isAuthenticated, navigate]);

  /* Estado interno */
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('panel');      // 'panel' | 'procesos' | 'postulaciones'

  /* Renderizado condicional */
  if (view === 'procesos') {
    return (
      <div className={styles.container}>
        <h2>Listado de Procesos</h2>
        <button className={styles.button} onClick={() => setView('panel')}>
          Volver al panel
        </button>
        <AdminGrid />
      </div>
    );
  }

  if (view === 'postulaciones') {
    return (
      <div className={styles.container}>
        <h2>Postulaciones Recibidas</h2>
        <button className={styles.button} onClick={() => setView('panel')}>
          Volver al panel
        </button>
        <AdminPostulaciones />
      </div>
    );
  }

  /* Panel principal */
  return (
    <div className={styles.container}>
      <h2>Panel de Administración</h2>

      <button className={styles.button} onClick={() => setShowModal(true)}>
        Crear proceso
      </button>

      <button className={styles.button} onClick={() => setView('procesos')}>
        Ver procesos
      </button>

      <button className={styles.button} onClick={() => setView('postulaciones')}>
        Ver postulantes
      </button>

      <button className={styles.button} onClick={logout}>
        Cerrar sesión
      </button>

      <CreateJobModal visible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;
