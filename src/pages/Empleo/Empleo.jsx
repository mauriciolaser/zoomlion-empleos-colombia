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
      // Si se accede directamente por URL (sin pasar state), aquí podrías hacer un fetch:
      // fetch(`http://localhost/api/empleos.php?id=${slug}`)
      //   .then(res => res.json())
      //   .then(data => setEmpleoData(data[0]));
      // (Asumiendo que tu PHP admita recibir ?id= y devuelva un array con un solo objeto)
    }
  }, [empleoData, slug]);

  if (!empleoData) {
    return <div className={styles.loadingText}>Cargando...</div>;
  }

  return (
    <div className={styles.empleoContainer}>
      <div className={styles.descripcion}>
        <EmpleoDescripción
          posicion={empleoData.titulo}
          ciudad={empleoData.ubicacion}
          fechaLimite={empleoData.fecha_cierre}
          requisitos={empleoData.descripcion}
        />
      </div>
      <div className={styles.formulario}>
        <EmpleoFormulario />
      </div>
    </div>
  );
};

export default Empleo;
