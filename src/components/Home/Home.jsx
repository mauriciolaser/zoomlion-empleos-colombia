import React from 'react';
import { Link } from 'react-router-dom';
import empleosData from '../../data/empleosData.json';
import styles from './Home.module.scss';

const Home = () => (
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
        {empleosData.map(job => (
          <div key={job.id} className={styles.card}>
            <h3>{job.title}</h3>
            <p><strong>{job.company}</strong> – {job.location}</p>
            <p>{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
