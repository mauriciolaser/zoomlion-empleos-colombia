import React, { useEffect, useState } from 'react';
import styles from './AdminGrid.module.scss';
import AdminProceso from '../AdminProceso/AdminProceso';

const AdminGrid = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para saber qué proceso está seleccionado (o null si ninguno)
  const [selectedJob, setSelectedJob] = useState(null);

  // Nuevo estado para el filtro: "Todos" o "Activos"
  const [filtro, setFiltro] = useState('Activos');

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

  // Maneja el cambio de filtro desde el <select>
  const manejarCambioFiltro = (e) => {
    setFiltro(e.target.value);
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

  // Filtramos según el estado `filtro`
  const hoy = new Date();
  const trabajosFiltrados = jobs.filter((job) => {
    if (filtro === 'Activos') {
      // Convertir fecha_cierre a Date
      const fechaCierre = new Date(job.fecha_cierre);
      // Activo si fecha_cierre >= hoy y archivado === 0
      return fechaCierre >= hoy && job.archivado === 0;
    }
    // Si es "Todos", devolvemos todo sin filtrar
    return true;
  });

  return (
    <div>
      {/* -------------- FILTRO -------------- */}
      {!selectedJob && (
        <div className={styles.filtroContainer}>
          <label htmlFor="filtroProcesos" className={styles.labelFiltro}>
            Mostrar:
          </label>
          <select
            id="filtroProcesos"
            value={filtro}
            onChange={manejarCambioFiltro}
            className={styles.selectFiltro}
          >
            <option value="Todos">Todos</option>
            <option value="Activos">Activos</option>
          </select>
        </div>
      )}

      {/* 1) Si no hay ningún proceso seleccionado, mostramos la grilla filtrada */}
      {!selectedJob && (
        <div className={styles.grid}>
          {trabajosFiltrados.length === 0 ? (
            <p className={styles.status}>No hay procesos que coincidan con el filtro.</p>
          ) : (
            trabajosFiltrados.map((job) => (
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
                <button
                  className={styles.botonVerMas}
                  onClick={() => manejarVerMas(job)}
                >
                  Ver más
                </button>
              </div>
            ))
          )}
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
