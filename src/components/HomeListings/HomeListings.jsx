import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeListings.module.scss';

const HomeListings = ({ empleos }) => {
  return (
    <section className={styles.listingsSection}>
      <div className={styles.sectionTitleWrapper}>
        <div className={styles.lineLeft} />
        <h2 className={styles.title}>OFERTAS DE EMPLEO</h2>
        <div className={styles.lineRight} />
      </div>

      {/* Contenido envuelto */}
      <div className={styles.contentWrapper}>
        <div className={styles.cardContainer}>
{empleos.map((job) => (
  <div key={job.id} className={styles.card}>
    {/* Contenido principal */}
    <div className={styles.jobContent}>
      <h3>{job.titulo}</h3>
      <p><strong>Ubicación: </strong> {job.ubicacion}</p>
      <p><strong>Experiencia mínima: </strong> {job.experiencia} años.</p>
      <p><strong>Límite para postular: </strong> {job.fecha_cierre}</p>
    </div>

    {/* Línea decorativa */}
    <div className={styles.decorativeLine} />

    {/* Botón fuera del wrapper de contenido */}
    <Link to={`/empleo/${job.id}`} state={{ data: job }}>
      <button className={styles.cardButton}>Ver oferta</button>
    </Link>
  </div>
))}


        </div>

      </div>
    </section>
  );
};

export default HomeListings;
