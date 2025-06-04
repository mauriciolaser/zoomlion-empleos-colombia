import React, { useEffect, useState } from 'react';
import styles from './AdminGrid.module.scss';
import AdminProceso from '../AdminProceso/AdminProceso';

const AdminGrid = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para saber qué proceso está seleccionado (o null si ninguno)
  const [selectedJob, setSelectedJob] = useState(null);

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

  const manejarVerMas = (job) => {
    setSelectedJob(job);
  };

  const manejarVolver = () => {
    setSelectedJob(null);
  };

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
    <div>
      {/* 1) Si no hay ningún proceso seleccionado, mostramos solo la grilla de procesos */}
      {!selectedJob && (
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
              {/* Botón Ver más */}
              <button
                className={styles.botonVerMas}
                onClick={() => manejarVerMas(job)}
              >
                Ver más
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2) Si hay un proceso seleccionado, mostramos el panel inferior con botón de volver + AdminProceso */}
      {selectedJob && (
        <div className={styles.contenedorInferior}>
          <div className={styles.headerInferior}>
            <button className={styles.botonVolver} onClick={manejarVolver}>
              ← Volver a procesos
            </button>
          </div>
          <AdminProceso job={selectedJob} />
        </div>
      )}
    </div>
  );
};

export default AdminGrid;
