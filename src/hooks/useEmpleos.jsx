// src/hooks/useEmpleos.jsx
import { useState, useEffect } from 'react';

const useEmpleos = () => {
  const [empleos, setEmpleos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /* ───────── configuración ───────── */
    const controller = new AbortController();
    const baseUrl    = import.meta.env.VITE_API_URL;      // p. ej. http://localhost/empleos/api
    const url        = `${baseUrl}/listar.php`;           // ajusta si tu ruta es distinta

    console.log('[useEmpleos] GET ➜', url);

    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
      // ← Sin credentials: 'include' porque no necesitamos cookies aquí
    })
      .then(res => {
        if (!res.ok)
          throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('[useEmpleos] data  ➜', data);
        setEmpleos(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[useEmpleos] error ➜', err);
          setError(err.message);
          setLoading(false);
        }
      });

    /* ───────── limpieza ───────── */
    return () => controller.abort();
  }, []);

  return { empleos, loading, error };
};

export default useEmpleos;
