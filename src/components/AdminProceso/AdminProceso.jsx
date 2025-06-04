import React, { useState } from 'react';
import { FaEdit, FaSave, FaArchive } from 'react-icons/fa';
import AdminPostulaciones from '../AdminPostulaciones/AdminPostulaciones';
import styles from './AdminProceso.module.scss';

const AdminProceso = ({ job }) => {
  // job === objeto con { id, titulo, empresa, ubicacion, fecha_publicacion, fecha_cierre, ... }
  const [editMode, setEditMode] = useState({
    titulo: false,
    empresa: false,
    ubicacion: false,
    fecha_publicacion: false,
    fecha_cierre: false,
  });

  // Estados locales para cada campo editable
  const [campos, setCampos] = useState({
    titulo: job.titulo,
    empresa: job.empresa,
    ubicacion: job.ubicacion,
    fecha_publicacion: job.fecha_publicacion,
    fecha_cierre: job.fecha_cierre,
  });

  const [hayCambios, setHayCambios] = useState(false);

  // --- ARCHIVAR ---
  // Estado para controlar la visibilidad del modal de confirmación
  const [showModal, setShowModal] = useState(false);
  // Estado para indicar si ya se está enviando la petición de archivar
  const [archivando, setArchivando] = useState(false);
  // Resultado del archivado (opcionalmente mostrar mensaje)
  const [mensajeArchivo, setMensajeArchivo] = useState('');

  const manejarToggleEdicion = (campo) => {
    setEditMode((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }));
  };

  const manejarCambioCampo = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHayCambios(true);
  };

  const manejarGuardar = () => {
    fetch(`${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=actualizar-proceso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: job.id,
        titulo: campos.titulo,
        empresa: campos.empresa,
        ubicacion: campos.ubicacion,
        fecha_publicacion: campos.fecha_publicacion,
        fecha_cierre: campos.fecha_cierre,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al guardar cambios`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEditMode({
            titulo: false,
            empresa: false,
            ubicacion: false,
            fecha_publicacion: false,
            fecha_cierre: false,
          });
          setHayCambios(false);
          alert('Cambios guardados correctamente.');
        } else {
          alert('No se pudieron guardar los cambios. Intenta de nuevo.');
        }
      })
      .catch((err) => {
        console.error('Error al guardar proceso:', err);
        alert('Ocurrió un error al guardar los cambios.');
      });
  };

  // --- ARCHIVAR ---
  // Abrir modal de confirmación
  const abrirModal = () => {
    setMensajeArchivo('');
    setShowModal(true);
  };

  // Cerrar modal sin acción
  const cerrarModal = () => {
    setShowModal(false);
  };

  // Al confirmar, enviamos petición para archivar
  const confirmarArchivar = () => {
    setArchivando(true);
    fetch(`${import.meta.env.VITE_EMPLEOS_URL}/index.php?action=archivar-proceso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: job.id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al archivar`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setMensajeArchivo('Proceso archivado correctamente.');
          // Opcional: podrías redirigir o actualizar la lista padre.
        } else {
          setMensajeArchivo(data.message || 'No se pudo archivar el proceso.');
        }
      })
      .catch((err) => {
        console.error('Error al archivar proceso:', err);
        setMensajeArchivo('Ocurrió un error al archivar.');
      })
      .finally(() => {
        setArchivando(false);
      });
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Detalle del Proceso (ID: {job.id})</h2>

      {/* Botón de Archivar */}
      <button
        className={styles.botonArchivar}
        onClick={abrirModal}
        title="Archivar proceso"
        disabled={archivando}
      >
        <FaArchive className={styles.iconoArchivar} /> Archivar
      </button>

      {/* Modal de confirmación */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitulo}>¿Confirmar archivado?</h3>
            {mensajeArchivo && <p className={styles.mensajeResultado}>{mensajeArchivo}</p>}
            <div className={styles.modalAcciones}>
              <button
                className={styles.botonConfirmar}
                onClick={confirmarArchivar}
                disabled={archivando}
              >
                {archivando ? 'Archivando...' : 'CONFIRMAR'}
              </button>
              <button className={styles.botonCerrar} onClick={cerrarModal} disabled={archivando}>
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.gridCampos}>
        {/* 1) Título */}
        <div className={styles.campo}>
          <label className={styles.label}>Título:</label>
          {editMode.titulo ? (
            <input
              type="text"
              name="titulo"
              value={campos.titulo}
              onChange={manejarCambioCampo}
              className={styles.input}
            />
          ) : (
            <span className={styles.valor}>{campos.titulo}</span>
          )}
          <button
            className={styles.botonIcono}
            onClick={() => manejarToggleEdicion('titulo')}
            title={editMode.titulo ? 'Cancelar edición' : 'Editar título'}
          >
            <FaEdit />
          </button>
        </div>

        {/* 2) Empresa */}
        <div className={styles.campo}>
          <label className={styles.label}>Empresa:</label>
          {editMode.empresa ? (
            <input
              type="text"
              name="empresa"
              value={campos.empresa}
              onChange={manejarCambioCampo}
              className={styles.input}
            />
          ) : (
            <span className={styles.valor}>{campos.empresa}</span>
          )}
          <button
            className={styles.botonIcono}
            onClick={() => manejarToggleEdicion('empresa')}
            title={editMode.empresa ? 'Cancelar edición' : 'Editar empresa'}
          >
            <FaEdit />
          </button>
        </div>

        {/* 3) Ubicación */}
        <div className={styles.campo}>
          <label className={styles.label}>Ubicación:</label>
          {editMode.ubicacion ? (
            <input
              type="text"
              name="ubicacion"
              value={campos.ubicacion}
              onChange={manejarCambioCampo}
              className={styles.input}
            />
          ) : (
            <span className={styles.valor}>{campos.ubicacion}</span>
          )}
          <button
            className={styles.botonIcono}
            onClick={() => manejarToggleEdicion('ubicacion')}
            title={editMode.ubicacion ? 'Cancelar edición' : 'Editar ubicación'}
          >
            <FaEdit />
          </button>
        </div>

        {/* 4) Fecha de Publicación */}
        <div className={styles.campo}>
          <label className={styles.label}>Publicado:</label>
          {editMode.fecha_publicacion ? (
            <input
              type="date"
              name="fecha_publicacion"
              value={campos.fecha_publicacion}
              onChange={manejarCambioCampo}
              className={styles.input}
            />
          ) : (
            <span className={styles.valor}>{campos.fecha_publicacion}</span>
          )}
          <button
            className={styles.botonIcono}
            onClick={() => manejarToggleEdicion('fecha_publicacion')}
            title={
              editMode.fecha_publicacion
                ? 'Cancelar edición'
                : 'Editar fecha de publicación'
            }
          >
            <FaEdit />
          </button>
        </div>

        {/* 5) Fecha de Cierre */}
        <div className={styles.campo}>
          <label className={styles.label}>Cierra:</label>
          {editMode.fecha_cierre ? (
            <input
              type="date"
              name="fecha_cierre"
              value={campos.fecha_cierre}
              onChange={manejarCambioCampo}
              className={styles.input}
            />
          ) : (
            <span className={styles.valor}>{campos.fecha_cierre}</span>
          )}
          <button
            className={styles.botonIcono}
            onClick={() => manejarToggleEdicion('fecha_cierre')}
            title={
              editMode.fecha_cierre ? 'Cancelar edición' : 'Editar fecha de cierre'
            }
          >
            <FaEdit />
          </button>
        </div>
      </div>

      {hayCambios && (
        <button className={styles.botonGuardar} onClick={manejarGuardar}>
          <FaSave className={styles.iconoGuardar} /> Guardar cambios
        </button>
      )}

      <div className={styles.separador}></div>

      <div className={styles.postulacionesProceso}>
        <AdminPostulaciones empleoId={job.id} />
      </div>
    </div>
  );
};

export default AdminProceso;
