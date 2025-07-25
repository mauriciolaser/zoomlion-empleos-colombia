// src/hooks/useCrearPostulacion.jsx
import { useState } from 'react';

export default function useCrearPostulacion() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const crearPostulacion = async ({
    procesoId,
    nombre,
    apellidos,
    dni,
    telefono,
    correo,
    mensaje,
    archivo
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

    console.log('[useCrearPostulacion] ▶️ formData', [...fd.entries()]);

    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/?action=crear-postulacion`;
      console.log('[useCrearPostulacion] POST', endpoint);

      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        // Si necesitas enviar cookies/sesión:
        // credentials: 'include',
      });

      console.log('[useCrearPostulacion] ⬅️ status', res.status, res.statusText);

      const data = await res.json();
      console.log('[useCrearPostulacion] ⬅️ json', data);

      if (!res.ok) {
        // 400, 404, 500, etc.
        throw new Error(data.error || `Error en la API: ${res.status}`);
      }
      if (!data.ok) {
        // respuesta JSON con ok: false
        throw new Error(data.error || 'Error al crear la postulación');
      }

      return data;
    } catch (e) {
      console.error('[useCrearPostulacion] ❌', e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { crearPostulacion, loading, error };
}
