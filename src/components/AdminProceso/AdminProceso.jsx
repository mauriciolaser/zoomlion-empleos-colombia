import React, { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
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

  // Estado para controlar si estamos mostrando el formulario de edición o no (no necesario, 
  // porque controlamos campo a campo con editMode)
  // También podríamos querer un estado para “cambios pendientes”:
  const [hayCambios, setHayCambios] = useState(false);

  // Función para alternar modo edición de un campo
  const manejarToggleEdicion = (campo) => {
    setEditMode((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }));
  };

  // Función para actualizar el valor de un campo
  const manejarCambioCampo = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHayCambios(true);
  };

  // Función para guardar cambios en backend
  const manejarGuardar = () => {
    // Construimos el payload con los campos modificados
    // Solo enviamos al backend los valores actuales en `campos`.
    // Supondremos que el endpoint de actualización es:
    // `${VITE_EMPLEOS_URL}/index.php?action=actualizar-proceso`
    // con método POST y body JSON: { id, titulo, empresa, ubicacion, fecha_publicacion, fecha_cierre }
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
        // Supondremos que el backend responde con { success: true, job: { …nuevo objeto… } }
        if (data.success) {
          // Desactivamos todos los modos de edición
          setEditMode({
            titulo: false,
            empresa: false,
            ubicacion: false,
            fecha_publicacion: false,
            fecha_cierre: false,
          });
          setHayCambios(false);
          // Opcionalmente, podrías actualizar el estado “job” padre si lo necesitas.
          // Por simplicidad no lo haremos aquí; asumimos que, si la página se vuelve a cargar,
          // el listado de procesos se actualizará por separado.
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

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Detalle del Proceso (ID: {job.id})</h2>

      {/* Cada campo con su modo “ver / editar” */}
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

      {/* Botón Guardar (solo si hay cambios) */}
      {hayCambios && (
        <button className={styles.botonGuardar} onClick={manejarGuardar}>
          <FaSave className={styles.iconoGuardar} /> Guardar cambios
        </button>
      )}

      {/* Separador */}
      <div className={styles.separador}></div>

      {/* Sección para ver postulaciones de este proceso */}
      <div className={styles.postulacionesProceso}>
        <AdminPostulaciones empleoId={job.id} />
      </div>
    </div>
  );
};

export default AdminProceso;
