// Archivo: src/components/EmpleoDescripción/EmpleoDescripción.jsx
import React from 'react';
import styles from './EmpleoDescripción.module.scss';

const EmpleoDescripción = ({ posicion, ciudad, fechaLimite, requisitos }) => {
  // Formateamos la fecha límite en formato "dd/mm/aaaa"
  const fechaFormateada = new Date(fechaLimite).toLocaleDateString('es-ES');

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>{posicion}</h2>
      <p className={styles.campo}>
        <span className={styles.label}>Ciudad:</span> {ciudad}
      </p>
      <p className={styles.campo}>
        <span className={styles.label}>Fecha límite:</span> {fechaFormateada}
      </p>
      <div className={styles.requisitos}>
        <span className={styles.label}>Requisitos:</span>
        <ul>
          {requisitos.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmpleoDescripción;
