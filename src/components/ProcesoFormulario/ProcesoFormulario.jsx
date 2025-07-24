// Archivo: src/components/ProcesoFormulario/ProcesoFormulario.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProcesoFormulario.module.scss';
import useCrearPostulacion from '../../hooks/useCrearPostulacion';
import Modal from '../ProcesoModal/ProcesoModal';

const ProcesoFormulario = ({ postulanteId, procesoId }) => {
  const navigate = useNavigate();
  
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

  // Estados para el modal
  const [modalState, setModalState] = React.useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    isSuccess: false
  });

  const openModal = (type, title, message, isSuccess = false) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      isSuccess
    });
  };

  const closeModal = () => {
    const wasSuccess = modalState.isSuccess;
    setModalState({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      isSuccess: false
    });

    // Si el modal se cerró después de un envío exitoso, navegar al home
    if (wasSuccess) {
      navigate('/');
    }
  };

  const resetForm = () => {
    setNombre('');
    setApellidos('');
    setDni('');
    setTelefono('');
    setCorreo('');
    setMensaje('');
    setCurriculum(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!curriculum) {
      openModal('warning', 'Campo requerido', 'Por favor, selecciona un archivo de currículum.');
      return;
    }

    try {
      const data = await crearPostulacion({
        postulanteId,
        procesoId,
        nombre,
        apellidos,
        dni,
        telefono,
        correo,
        mensaje,
        archivo: curriculum
      });

      // Limpiar formulario en caso de éxito
      resetForm();

      // Mostrar modal de éxito
      openModal(
        'success', 
        'Postulación Enviada', 
        data.message || 'Tu postulación ha sido registrada correctamente. Nos pondremos en contacto contigo pronto.',
        true // isSuccess = true
      );

    } catch (err) {
      console.error('Error al enviar postulación:', err);
      
      // Mostrar modal de error
      openModal(
        'error', 
        'Error al Enviar', 
        error?.message || 'Hubo un problema al enviar tu postulación. Por favor, inténtalo de nuevo.'
      );
    }
  };

  return (
    <>
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
      </form>

      {/* Modal para mensajes de éxito/error */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        showCloseButton={true}
      />
    </>
  );
};

export default ProcesoFormulario;