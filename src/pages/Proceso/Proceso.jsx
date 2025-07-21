import React from 'react';
import { useParams } from 'react-router-dom';

import ProcesoHero        from '../../components/ProcesoHero/ProcesoHero';
import ProcesoDescripcion from '../../components/ProcesoDescripcion/ProcesoDescripcion';
import ProcesoFormulario  from '../../components/ProcesoFormulario/ProcesoFormulario';

import useProceso         from '../../hooks/useProceso';
import styles            from './Proceso.module.scss';

const Proceso = () => {
  const { slug } = useParams();
  const { proceso, loading, error } = useProceso(slug);

  console.log('[Proceso.jsx] slug  ➜', slug);
  console.log('[Proceso.jsx] proceso desde hook ➜', proceso);

  if (loading) return <p className={styles.loadingText}>Cargando…</p>;
  if (error)   return <p className={styles.errorText}>⚠️ {error}</p>;
  if (!proceso) return null;

  return (
    <>

      <section className={styles.heroSection}>
        <ProcesoHero {...proceso} />
      </section>
      <div className={styles.procesoContainer}>
        <div className={styles.descripcion}>
          <ProcesoDescripcion procesoData={proceso} />
        </div>

        <div className={styles.formulario}>
          <ProcesoForumulario procesoId={proceso.id} />
        </div>
      </div>
    </>
  );
};

export default Proceso;