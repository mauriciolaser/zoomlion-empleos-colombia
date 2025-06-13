// src/components/GeneralContactoCard/GeneralContactoCard.jsx
import React from 'react';
import styles from './GeneralContactoCard.module.scss';


const GeneralContactoCard = ({ data, onOpenCotizador }) => {
  if (!data) return null;
  const { pais, representante, telefono, direccion, correo } = data;

  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>
          COMUNÍCATE CON NUESTRO EQUIPO.
        </h3>
      </div>

      <div className={styles.card}>
        <div className={styles.details}>
          <ul>
            <li><strong>Teléfono:</strong> {telefono}</li>
            <li className={styles.address}><strong>Dirección: </strong> {direccion}</li>
            <li><strong>Correo:</strong> {correo}</li>
          </ul>
        </div>


      </div>
    </>
  );
};

export default GeneralContactoCard;
