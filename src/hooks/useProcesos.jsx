import { useState, useEffect } from 'react';

const useProcesos = () => {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = `${import.meta.env.VITE_API_URL}/?action=listar-procesos`;

    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setProcesos(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { procesos, loading, error };
};

export default useProcesos;
