import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeListings.module.scss';

const HomeListings = ({ procesos }) => (
  <section id="home-listings" className={styles.listingsSection}>
    <div className={styles.sectionTitleWrapper}>
      <div className={styles.lineLeft} />
      <h2 className={styles.title}>OFERTAS DE EMPLEO</h2>
      <div className={styles.lineRight} />
    </div>

    <div className={styles.contentWrapper}>
      {procesos && procesos.length > 0 ? (
        <div className={styles.cardContainer}>
          {procesos.map((job) => (
            <div key={job.id} className={styles.card}>
              <div className={styles.jobContent}>
                <h3>{job.titulo}</h3>
                <p><strong>Ubicación:</strong> {job.ubicacion}</p>
                <p><strong>Experiencia mínima:</strong> {job.experiencia} años.</p>
                <p><strong>Límite para postular:</strong> {job.fecha_cierre}</p>
              </div>

              <div className={styles.decorativeLine} />

              <Link to={`/proceso/${job.slug}`} state={{ data: job }}>
                <button className={styles.cardButton}>Ver oferta</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3 className={styles.emptyTitle}>No hay convocatorias disponibles</h3>
          <p className={styles.emptyMessage}>
            En este momento no tenemos ofertas de empleo activas. 
            Te invitamos a revisar nuevamente pronto.
          </p>
        </div>
      )}
    </div>
  </section>
);

export default HomeListings;