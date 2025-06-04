// /src/components/CreateJobModal/CreateJobModal.jsx

import React, { useState } from 'react';
import styles from './CreateJobModal.module.scss';

const CreateJobModal = ({ visible, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [cargando, setCargando] = useState(false);

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      titulo.trim() === '' ||
      descripcion.trim() === '' ||
      empresa.trim() === '' ||
      ubicacion.trim() === '' ||
      fechaPublicacion.trim() === ''
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setCargando(true);

    const payload = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      empresa: empresa.trim(),
      ubicacion: ubicacion.trim(),
      fecha_publicacion: fechaPublicacion,
    };
    if (fechaCierre.trim() !== '') {
      payload.fecha_cierre = fechaCierre;
    }

    try {
      const baseAdminUrl = import.meta.env.VITE_EMPLEOS_URL;
      const response = await fetch(
        `${baseAdminUrl}/index.php?action=crear`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Empleo creado correctamente (ID: ' + data.id + ')');
        setTitulo('');
        setDescripcion('');
        setEmpresa('');
        setUbicacion('');
        setFechaPublicacion('');
        setFechaCierre('');
        onClose();
      } else {
        alert('Error al crear empleo: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Crear Nuevo Puesto</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Título<span className={styles.required}>*</span>:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={styles.input}
              required
              autoComplete="off"
            />
          </label>

          <label>
            Descripción<span className={styles.required}>*</span>:
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={styles.textarea}
              rows="4"
              required
            />
          </label>

          <label>
            Empresa<span className={styles.required}>*</span>:
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className={styles.input}
              required
              autoComplete="off"
            />
          </label>

          <label>
            Ubicación<span className={styles.required}>*</span>:
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className={styles.input}
              required
              autoComplete="off"
            />
          </label>

          <label>
            Fecha de Publicación<span className={styles.required}>*</span>:
            <input
              type="date"
              value={fechaPublicacion}
              onChange={(e) => setFechaPublicacion(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label>
            Fecha de Cierre:
            <input
              type="date"
              value={fechaCierre}
              onChange={(e) => setFechaCierre(e.target.value)}
              className={styles.input}
            />
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancel}`}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submit}`}
              disabled={cargando}
            >
              {cargando ? 'Guardando...' : 'Crear Puesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
