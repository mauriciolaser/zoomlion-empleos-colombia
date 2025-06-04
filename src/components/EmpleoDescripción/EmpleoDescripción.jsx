// Archivo: src/components/EmpleoDescripción/EmpleoDescripción.jsx
import React from 'react';
import styles from './EmpleoDescripción.module.scss';

const EmpleoDescripción = ({ posicion, ciudad, fechaLimite, requisitos }) => {
  return (
    <div className={styles.empleoDetalle}>
      <h2 className={styles.titulo}>{posicion}</h2>
      <p className={styles.info}>
        <strong>Ciudad:</strong> {ciudad}
      </p>
      <p className={styles.info}>
        <strong>Fecha límite:</strong> {fechaLimite}
      </p>

      <h3 className={styles.subtitulo}>Descripción / Requisitos:</h3>
      {/* Aquí tratamos “requisitos” como un simple párrafo de texto */}
      <p className={styles.descripcion}>{requisitos}</p>
    </div>
  );
};

export default EmpleoDescripción;
