// Archivo: src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useEmpleos from '../../hooks/useEmpleos';
import styles from './Home.module.scss';

const Home = () => {
  const { empleos, loading, error } = useEmpleos();

  if (loading) {
    return <p className={styles.loadingText}>Cargando ofertas...</p>;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.seguimientoSection}>
        <h2>Seguimiento de postulaciones</h2>
        <Link to="/seguimiento">
          <button className={styles.button}>Ingresar código de seguimiento</button>
        </Link>
      </section>

      <section className={styles.listingsSection}>
        <h2>Ofertas de empleo</h2>
        <div className={styles.cardContainer}>
          {empleos.map((job) => (
            <div key={job.id} className={styles.card}>
              {/* Usamos job.titulo en lugar de job.title */}
              <h3>{job.titulo}</h3>

              {/* job.empresa en lugar de job.company */}
              {/* job.ubicacion en lugar de job.location */}
              <p>
                <strong>{job.empresa}</strong> – {job.ubicacion}
              </p>

              {/* job.descripcion en lugar de job.description */}
              <p>{job.descripcion}</p>

              {/* Para la URL, utilizamos job.id en lugar de job.slug */}
              <Link to={`/empleo/${job.id}`} state={{ data: job }}>
                <button className={styles.cardButton}>Ver oferta</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
