import React, { useEffect, useState } from 'react';
import styles from './AdminGrid.module.scss';

const AdminGrid = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
fetch(`${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=listar`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al solicitar los datos`);
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener empleos:', err);
        setError('No se pudo cargar la lista de procesos.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className={styles.status}>Cargando procesos...</p>;
  }

  if (error) {
    return <p className={styles.statusError}>{error}</p>;
  }

  if (jobs.length === 0) {
    return <p className={styles.status}>No hay procesos disponibles.</p>;
  }

  return (
    <div className={styles.grid}>
      {jobs.map((job) => (
        <div key={job.id} className={styles.card}>
          <h3 className={styles.title}>{job.titulo}</h3>
          <p className={styles.info}>
            <strong>Empresa:</strong> {job.empresa}
          </p>
          <p className={styles.info}>
            <strong>Ubicación:</strong> {job.ubicacion}
          </p>
          <p className={styles.info}>
            <strong>Publicado:</strong> {job.fecha_publicacion}
          </p>
          <p className={styles.info}>
            <strong>Cierra:</strong> {job.fecha_cierre}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminGrid;
