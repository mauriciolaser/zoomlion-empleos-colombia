// src/components/TagManagerComponent/TagManagerComponent.jsx
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const TagManagerComponent = () => {
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) {
      console.warn('VITE_GTM_ID no está definida en el entorno');
      return;
    }
    TagManager.initialize({ gtmId });
  }, []);

  return null;
};

export default TagManagerComponent;
