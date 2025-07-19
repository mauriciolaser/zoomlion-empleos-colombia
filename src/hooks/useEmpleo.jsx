// src/hooks/useEmpleo.jsx
import { useState, useEffect } from 'react';

/**
 * Devuelve el empleo completo identificado por su slug.
 * Siempre hace fetch al backend (sin atajos de initialData).
 */
const useEmpleo = (slug) => {
  const [empleo,  setEmpleo]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;                 // caso imposible, pero safety-net

    const controller = new AbortController();
    const baseUrl    = import.meta.env.VITE_API_URL;
const url = `${baseUrl}/ver_empleo.php?slug=${encodeURIComponent(slug)}`;


    console.log('[useEmpleo] GET', url);

    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    })
      .then(res => {
        console.log('[useEmpleo] respuesta HTTP ➜', res.status, res.statusText);
        if (!res.ok) throw new Error(`Error ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('[useEmpleo] datos crudos ➜', data);
        ['responsabilidades', 'requisitos'].forEach(k => {
          if (typeof data[k] === 'string') {
            try { data[k] = JSON.parse(data[k]); }
            catch { data[k] = data[k].split('\n').filter(Boolean); }
          }
        });

        setEmpleo(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[useEmpleo] error ➜', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug]);

  return { empleo, loading, error };
};

export default useEmpleo;
