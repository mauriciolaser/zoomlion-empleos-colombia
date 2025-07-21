// src/hooks/useProceso.jsx
import { useState, useEffect } from 'react';

/**
 * Devuelve el proceso completo identificado por su slug,
 * usando el endpoint centralizado (?action=ver-proceso).
 * Logea y distingue el error 404 de otros errores.
 */
const useProceso = (slug) => {
  const [proceso,  setProceso]  = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    const url = `${import.meta.env.VITE_API_URL}/?action=ver-proceso&slug=${encodeURIComponent(slug)}`;

    console.log('[useProceso] GET', url);

    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    })
      .then(res => {
        console.log('[useProceso] respuesta HTTP ➜', res.status, res.statusText);
        if (!res.ok) {
          if (res.status === 404) {
            console.error('[useProceso] Ruta o recurso no encontrado (404)');
            throw new Error('Recurso no encontrado (404)');
          } else {
            console.error('[useProceso] Error en la API ➜', res.status, res.statusText);
            throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
          }
        }
        return res.json();
      })
      .then(data => {
        console.log('[useProceso] datos crudos ➜', data);
        // Normaliza responsabilidades y requisitos
        ['responsabilidades', 'requisitos'].forEach(k => {
          if (typeof data[k] === 'string') {
            try {
              data[k] = JSON.parse(data[k]);
            } catch {
              data[k] = data[k].split('\n').filter(Boolean);
            }
          }
        });

        setProceso(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error('[useProceso] error ➜', err);
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  return { proceso, loading, error };
};

export default useProceso;
