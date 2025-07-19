import React, { useMemo } from 'react';
import styles from './EmpleoDescripcion.module.scss';

const EmpleoDescripcion = ({ empleoData }) => {
  /* ───────── logs iniciales ───────── */
  console.log('[EmpleoDescripcion] empleoData recibido ➜', empleoData);

  /* -------- loading “esqueleto” -------- */
  if (!empleoData) {
    console.log('[EmpleoDescripcion] aún sin datos, mostrando spinner');
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        <div className={styles.spinner} />
      </div>
    );
  }

  /* -------- normalización -------- */
  const responsabilidades = useMemo(() => {
    const raw = empleoData.responsabilidades;
    console.log('[EmpleoDescripcion] responsabilidades raw ➜', raw);
    if (!raw) return [];
    return Array.isArray(raw) ? raw : JSON.parse(raw);
  }, [empleoData]);

  const requisitos = useMemo(() => {
    const raw = empleoData.requisitos;
    console.log('[EmpleoDescripcion] requisitos raw ➜', raw);
    if (!raw) return [];
    return Array.isArray(raw) ? raw : JSON.parse(raw);
  }, [empleoData]);

  const { descripcion = '' } = empleoData;

  /* -------- render final -------- */
  return (
    <div className={styles.container}>
      {/* Descripción */}
      {descripcion && (
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Acerca del puesto</h3>
          <p className={styles.text}>{descripcion}</p>
        </div>
      )}

      {/* Responsabilidades */}
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

      {/* Requisitos */}
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

export default EmpleoDescripcion;
