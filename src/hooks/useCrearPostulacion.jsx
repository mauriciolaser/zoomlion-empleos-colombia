// src/hooks/useCrearPostulacion.jsx
import { useState } from 'react';

export default function useCrearPostulacion() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const crearPostulacion = async ({
    procesoId, nombre, apellidos, dni, telefono, correo, mensaje, archivo
  }) => {
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append('proceso_id', procesoId);
    fd.append('nombre',       nombre);
    fd.append('apellidos',    apellidos);
    fd.append('dni',          dni);
    fd.append('telefono',     telefono);
    fd.append('correo',       correo);
    if (mensaje) fd.append('mensaje', mensaje);
    fd.append('archivo',      archivo);

    console.log('▶️ formData', [...fd.entries()]);

    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/?action=crear-postulacion`;
      const r = await fetch(endpoint, {
        method: 'POST',
        body: fd
      });

      console.log('⬅️ status', r.status);
      const data = await r.json(); 
      console.log('⬅️ json', data);

      if (!r.ok || !data.ok) {
        throw new Error(data.error || 'Error al enviar la postulación');
      }
      return data;
    } catch (e) {
      console.error('❌ crearPostulacion', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { crearPostulacion, loading, error };
}
