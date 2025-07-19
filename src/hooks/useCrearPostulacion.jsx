import { useState } from 'react';

export default function useCrearPostulacion() {
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState(null);

  const crearPostulacion = async ({
    empleoId,nombre,apellidos,dni,telefono,correo,mensaje,archivo
  }) => {
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append('empleo_id',empleoId);
    fd.append('nombre',nombre);
    fd.append('apellidos',apellidos);
    fd.append('dni',dni);
    fd.append('telefono',telefono);
    fd.append('correo',correo);
    if (mensaje) fd.append('mensaje',mensaje);
    fd.append('archivo',archivo);

    console.log('▶️ formData', [...fd.entries()]);

    try {
      const r  = await fetch(`${import.meta.env.VITE_API_URL}/crear_postulacion.php`,
        {method:'POST',body:fd});
      console.log('⬅️ status', r.status);
      const txt = await r.text();
      console.log('⬅️ raw', txt);
      const data = txt ? JSON.parse(txt) : {};
      if (!r.ok || !data.ok) throw new Error(data.error || 'error');
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
