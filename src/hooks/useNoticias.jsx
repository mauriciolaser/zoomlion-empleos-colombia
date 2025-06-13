// src/hooks/useNoticias.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useNoticias = (perPage = 4) => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NOTICIAS_URL}/noticias`,
          {
            params: {
              populate: 'previsualizacion',
              sort: 'publishedAt:desc',
              'pagination[limit]': perPage,
            },
          }
        );

        const items = res.data.data || [];
        const arr = items.map((item) => {
          // Strapi te devuelve cada noticia con sus campos al mismo nivel,
          // y previsualizacion es un array de objetos con un campo `url`
          const mediaArr = item.previsualizacion || [];
          const src = mediaArr.length > 0 ? mediaArr[0].url : '';

          // Si por algún caso te devolviera ruta relativa:
          const previsualizacion = src.startsWith('http')
            ? src
            : `${import.meta.env.VITE_API_URL}${src}`;

          return {
            id: item.id,
            titulo: item.titulo || 'Sin título',
            previsualizacion,
            descripcion: item.descripcion || '',
            slug: item.slug || '',
          };
        });

        setNoticias(arr);
      } catch (err) {
        console.error('Error fetching noticias:', err);
      }
    };

    fetchNoticias();
  }, [perPage]);

  return noticias;
};

export default useNoticias;
