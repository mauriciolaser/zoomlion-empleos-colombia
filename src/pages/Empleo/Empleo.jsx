import React from 'react';
import { useParams } from 'react-router-dom';

import EmpleoHero        from '../../components/EmpleoHero/EmpleoHero';
import EmpleoDescripcion from '../../components/EmpleoDescripcion/EmpleoDescripcion';
import EmpleoFormulario  from '../../components/EmpleoFormulario/EmpleoFormulario';

import useEmpleo         from '../../hooks/useEmpleo';
import styles            from './Empleo.module.scss';

const Empleo = () => {
  const { slug } = useParams();
  const { empleo, loading, error } = useEmpleo(slug);

  console.log('[Empleo.jsx] slug  ➜', slug);
  console.log('[Empleo.jsx] empleo desde hook ➜', empleo);

  if (loading) return <p className={styles.loadingText}>Cargando…</p>;
  if (error)   return <p className={styles.errorText}>⚠️ {error}</p>;
  if (!empleo) return null;

  return (
    <>
      {/* 100 vw — no está dentro del contenedor limitado */}
      <section className={styles.heroSection}>
        <EmpleoHero {...empleo} />
      </section>

      {/* Contenido limitado a máx. 1200 px */}
      <div className={styles.empleoContainer}>
        <div className={styles.descripcion}>
          <EmpleoDescripcion empleoData={empleo} />
        </div>

        <div className={styles.formulario}>
          <EmpleoFormulario empleoId={empleo.id} />
        </div>
      </div>
    </>
  );
};

export default Empleo;
