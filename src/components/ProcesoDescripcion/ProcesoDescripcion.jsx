import React, { useMemo } from 'react';
import styles from './ProcesoDescripcion.module.scss';

const ProcesoDescripcion = ({ procesoData }) => {
  /* ───────── logs iniciales ───────── */
  console.log('[ProcesoDescripcion] procesoData recibido ➜', procesoData);

  /* -------- loading “esqueleto” -------- */
  if (!procesoData) {
    console.log('[ProcesoDescripcion] aún sin datos, mostrando spinner');
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        <div className={styles.spinner} />
      </div>
    );
  }

  /* -------- normalización -------- */
  const responsabilidades = useMemo(() => {
    const raw = procesoData.responsabilidades;
    console.log('[ProcesoDescripcion] responsabilidades raw ➜', raw);
    if (!raw) return [];
    return Array.isArray(raw) ? raw : JSON.parse(raw);
  }, [procesoData]);

  const requisitos = useMemo(() => {
    const raw = procesoData.requisitos;
    console.log('[ProcesoDescripcion] requisitos raw ➜', raw);
    if (!raw) return [];
    return Array.isArray(raw) ? raw : JSON.parse(raw);
  }, [procesoData]);

  const { descripcion = '' } = procesoData;

  return (
    <div className={styles.container}>
      {/* Descripción */}
      {descripcion && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Acerca del puesto</h3>
          <p className={styles.text}>{descripcion}</p>
        </div>
      )}

      {responsabilidades.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Responsabilidades</h3>
          <ul className={styles.list}>
            {responsabilidades.map((r, i) => (
              <li key={i} className={styles.listItem}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {requisitos.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Requisitos</h3>
          <ul className={styles.list}>
            {requisitos.map((r, i) => (
              <li key={i} className={styles.listItem}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProcesoDescripcion;
