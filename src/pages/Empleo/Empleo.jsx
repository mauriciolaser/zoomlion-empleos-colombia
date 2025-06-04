// Archivo: src/pages/Empleo.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EmpleoDescripción from '../../components/EmpleoDescripción/EmpleoDescripción';
import EmpleoFormulario from '../../components/EmpleoFormulario/EmpleoFormulario';
import styles from './Empleo.module.scss';

const Empleo = () => {
  const location = useLocation();
  const { slug } = useParams();
  const stateData = location.state?.data || null;

  const [empleoData, setEmpleoData] = useState(stateData);

  useEffect(() => {
    if (!empleoData) {
      // Si se accede directamente por slug, aquí se podría hacer un fetch para obtener los datos
      // Ejemplo (pendiente implementar):
      // fetch(`/api/empleos/${slug}`)
      //   .then(res => res.json())
      //   .then(data => setEmpleoData(data));
    }
  }, [empleoData, slug]);

  if (!empleoData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.empleoContainer}>
      <div className={styles.descripcion}>
        <EmpleoDescripción
          posicion={empleoData.posicion}
          ciudad={empleoData.ciudad}
          fechaLimite={empleoData.fechaLimite}
          requisitos={empleoData.requisitos}
        />
      </div>
      <div className={styles.formulario}>
        <EmpleoFormulario />
      </div>
    </div>
  );
};

export default Empleo;
