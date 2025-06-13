// src/components/TagManagerPageView/TagManagerPageView.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TagManager from 'react-gtm-module';

const TagManagerPageView = () => {
  const location = useLocation();

  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) {
      console.warn(
        '⚠️ TagManagerPageView: VITE_GTM_ID no está definida en el entorno'
      );
      return;
    }

    const pagePath = location.pathname + location.search;
    TagManager.dataLayer({
      dataLayer: {
        event: 'pageview',
        page: pagePath,
      },
    });

    // Debug solo en desarrollo
    if (!import.meta.env.PROD) {
      console.log('✅ GTM PageView enviado:', pagePath);
    }
  }, [location]);

  return null;
};

export default TagManagerPageView;
