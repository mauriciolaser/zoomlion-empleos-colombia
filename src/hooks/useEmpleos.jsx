import { useState, useEffect } from 'react';

const useEmpleos = () => {
  const [empleos, setEmpleos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL; //
    fetch(`${baseUrl}/listar`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setEmpleos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { empleos, loading, error };
};

export default useEmpleos;
