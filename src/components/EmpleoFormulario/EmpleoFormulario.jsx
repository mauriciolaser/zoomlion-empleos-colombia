// Archivo: src/components/EmpleoFormulario/EmpleoFormulario.jsx
import React, { useState } from 'react';
import styles from './EmpleoFormulario.module.scss';

const EmpleoFormulario = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [curriculum, setCurriculum] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Creamos un FormData listo para enviar a una API
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellidos', apellidos);
    formData.append('dni', dni);
    formData.append('telefono', telefono);
    formData.append('correo', correo);
    if (curriculum) {
      formData.append('curriculum', curriculum);
    }

    // TODO: Conectar con la API para enviar el formulario
    // Ejemplo:
    // fetch('/api/postular', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(res => res.json())
    //   .then(respuesta => console.log(respuesta));

    console.log('Formulario listo para enviar', {
      nombre,
      apellidos,
      dni,
      telefono,
      correo,
      curriculum,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
      <div className={styles.field}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="apellidos">Apellidos:</label>
        <input
          type="text"
          id="apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="dni">DNI:</label>
        <input
          type="text"
          id="dni"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="tel"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="correo">Correo electrónico:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="curriculum">Currículum:</label>
        <input
          type="file"
          id="curriculum"
          accept=".pdf, .doc, .docx"
          onChange={(e) => setCurriculum(e.target.files[0])}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Enviar
      </button>
    </form>
  );
};

export default EmpleoFormulario;
