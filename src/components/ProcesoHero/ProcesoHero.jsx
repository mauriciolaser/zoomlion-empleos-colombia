import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProcesoHero.module.scss';

/**
 * Hero de la oferta de empleo.
 *
 * @param {string}  titulo        – Título del puesto.
 * @param {string}  ubicacion     – Lugar de la oferta.
 * @param {number}  experiencia   – Años de experiencia mínima.
 * @param {string}  fecha_cierre  – Fecha ISO (YYYY-MM-DD) en que expira.
 */
const ProcesoHero = ({ titulo, ubicacion, experiencia, fecha_cierre }) => {
  /* ─── Formateos ─── */
  const expLabel =
    experiencia === 0 || experiencia
      ? `${experiencia} año${Number(experiencia) === 1 ? '' : 's'}`
      : '—';

  const expiryLabel = fecha_cierre
    ? new Date(fecha_cierre).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—';

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/" className={styles.link}>INICIO</Link>
          <span className={styles.separator}>/</span>
          <span>OFERTA DE EMPLEO</span>
        </nav>

        <h1 className={styles.title}>{titulo || '—'}</h1>

        <ul className={styles.meta}>
          <li>
            <strong>Lugar:</strong> {ubicacion || '—'}
          </li>
          <li>
            <strong>Experiencia mínima:</strong> {expLabel}
          </li>
          <li>
            <strong>Expira:</strong> {expiryLabel}
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ProcesoHero;
