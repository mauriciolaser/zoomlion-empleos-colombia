import React, { useState } from 'react';
import styles from './Seguimiento.module.scss';

const Seguimiento = () => {
  const [code, setCode] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // lógica futura: consultar API de seguimiento
    alert(`Buscando seguimiento para código: ${code}`);
  };

  return (
    <div className={styles.container}>
      <h2>Seguimiento de Postulación</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Ingrese su código de seguimiento"
          value={code}
          onChange={e => setCode(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Buscar</button>
      </form>
    </div>
  );
};

export default Seguimiento;
