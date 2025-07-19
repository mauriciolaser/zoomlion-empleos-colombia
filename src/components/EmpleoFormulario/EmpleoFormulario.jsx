// Archivo: src/components/EmpleoFormulario/EmpleoFormulario.jsx
import React from 'react';
import styles from './EmpleoFormulario.module.scss';
import useCrearPostulacion from '../../hooks/useCrearPostulacion';

const EmpleoFormulario = ({ usuarioId, empleoId }) => {
  // Hook al inicio
  const { crearPostulacion, loading, error } = useCrearPostulacion();

  // Estados del formulario
  const [nombre, setNombre]         = React.useState('');
  const [apellidos, setApellidos]   = React.useState('');
  const [dni, setDni]               = React.useState('');
  const [telefono, setTelefono]     = React.useState('');
  const [correo, setCorreo]         = React.useState('');
  const [mensaje, setMensaje]       = React.useState('');
  const [curriculum, setCurriculum] = React.useState(null);

  // Estado para mostrar el mensaje de éxito
  const [success, setSuccess]       = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!curriculum) return;

    // Limpiar cualquier mensaje previo
    setSuccess('');

    try {
      const data = await crearPostulacion({
        usuarioId,
        empleoId,
        nombre,
        apellidos,
        dni,
        telefono,
        correo,
        mensaje,
        archivo: curriculum
      });

      // Mostrar mensaje de éxito
      setSuccess(data.message || 'Postulación registrada correctamente');

      // Limpiar formulario
      setCurriculum(null);
      // Opcional: resetear los otros campos si quieres
      // setNombre(''); setApellidos(''); etc.

    } catch (err) {
      // El hook ya actualiza `error`, no hace falta más aquí
      console.error('Error al enviar postulación:', err);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className={styles.field}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="apellidos">Apellidos:</label>
        <input
          type="text"
          id="apellidos"
          value={apellidos}
          onChange={e => setApellidos(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="dni">DNI:</label>
        <input
          type="text"
          id="dni"
          value={dni}
          onChange={e => setDni(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="tel"
          id="telefono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="correo">Correo electrónico:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="mensaje">Mensaje (opcional):</label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          rows={3}
        />
      </div>

     <div className={styles.field}>
        <label htmlFor="curriculum">Currículum:</label>
        <div className={styles.customFileInput}>
          <label htmlFor="curriculum" className={styles.fileButton}>Elegir archivo</label>
          <span className={styles.fileName}>
            {curriculum ? curriculum.name : 'Ningún archivo elegido'}
          </span>
          {curriculum && (
            <button type="button" className={styles.clearButton} onClick={() => setCurriculum(null)}>
              ✕
            </button>
          )}
          <input
            type="file"
            id="curriculum"
            accept=".pdf,.doc,.docx"
            onChange={e => setCurriculum(e.target.files[0])}
            required
          />
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Enviando…' : 'ENVIAR'}
      </button>

      {error   && <p className={styles.error}>❌ {error.message}</p>}
      {success && <p className={styles.success}>✅ {success}</p>}
    </form>
  );
};

export default EmpleoFormulario;