// /src/components/AdminPostulaciones/AdminPostulaciones.jsx

import React, { useEffect, useState } from 'react';
import styles from './AdminPostulaciones.module.scss';

const AdminPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulacionSeleccionada, setPostulacionSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    // Usamos VITE_EMPLEOS_URL para apuntar al backend de admin
    const url = `${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=ver-postulaciones&t=${Date.now()}`;

    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error('Error al obtener las postulaciones');
        return resp.json();
      })
      .then((data) => {
        setPostulaciones(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar la lista de postulaciones');
        setCargando(false);
      });
  }, []);

  const abrirModal = (postulacion) => {
    setPostulacionSeleccionada(postulacion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setPostulacionSeleccionada(null);
    setModalAbierto(false);
  };

  if (cargando) {
    return <p className={styles.cargando}>Cargando postulaciones...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Postulaciones Recibidas</h2>
      {postulaciones.length === 0 ? (
        <p className={styles.sinResultados}>No hay postulaciones por mostrar.</p>
      ) : (
        <div className={styles.grilla}>
          {postulaciones.map((post) => (
            <div key={post.id} className={styles.card}>
              <p><strong>ID:</strong> {post.id}</p>
              <p><strong>Usuario ID:</strong> {post.usuario_id}</p>
              <p><strong>Empleo ID:</strong> {post.empleo_id}</p>
              <p className={styles.fecha}>
                <strong>Fecha:</strong>{' '}
                {new Date(post.fecha_postulacion).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
              <button
                className={styles.botonVerMas}
                onClick={() => abrirModal(post)}
              >
                VER MÁS
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && postulacionSeleccionada && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.cerrar} onClick={cerrarModal}>
              &times;
            </button>
            <h3>Detalle de la Postulación (ID: {postulacionSeleccionada.id})</h3>
            <div className={styles.detalle}>
              <p><strong>Usuario ID:</strong> {postulacionSeleccionada.usuario_id}</p>
              <p><strong>Empleo ID:</strong> {postulacionSeleccionada.empleo_id}</p>
              <p><strong>Mensaje:</strong></p>
              <p className={styles.mensaje}>{postulacionSeleccionada.mensaje || '— Sin mensaje —'}</p>
              <p>
                <strong>Archivo:</strong>{' '}
                <a
                  href={`${import.meta.env.VITE_EMPLEOS_URL.replace('/admin', '')}/uploads/${postulacionSeleccionada.archivo}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar CV / Adjunto
                </a>
              </p>
              <p>
                <strong>Fecha de Postulación:</strong>{' '}
                {new Date(postulacionSeleccionada.fecha_postulacion).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
            {/* Botón adicional para cerrar el modal */}
            <button
              className={styles.botonVerMas}
              onClick={cerrarModal}
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostulaciones;
