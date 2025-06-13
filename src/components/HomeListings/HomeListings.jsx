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
      <div className={styles.cardContainer}>
        {empleos.map((job) => (
          <div key={job.id} className={styles.card}>
            <h3>{job.titulo}</h3>
            <p>
              <strong>{job.empresa}</strong> – {job.ubicacion}
            </p>
            <p>{job.descripcion}</p>
            <Link to={`/empleo/${job.id}`} state={{ data: job }}>
              <button className={styles.cardButton}>Ver oferta</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeListings;
