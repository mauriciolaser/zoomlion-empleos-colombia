// src/components/ConsentBanner/ConsentBanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import TagManager from 'react-gtm-module';
import styles from './ConsentBanner.module.scss';

const STORAGE_KEY = 'user_cookie_consent';

export default function ConsentBanner({
  message = 'Usamos cookies para mejorar tu experiencia.',
  buttonText = 'Aceptar',
  policyLink = '/cookies/cookies.pdf',
  onAccept,
}) {
  const [visible, setVisible] = useState(false);
  const inMemory = useRef(false);

  useEffect(() => {
    let consent = null;
    try {
      consent = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn('localStorage inaccesible:', e);
    }
    if (consent !== 'true') {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    let saved = false;
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      saved = true;
    } catch (e) {
      console.warn('Error guardando consentimiento:', e);
    }
    if (!saved) {
      inMemory.current = true;
    }
    setVisible(false);
    if (onAccept) onAccept();

    try {
      TagManager.dataLayer({ dataLayer: { event: 'cookieConsentAccepted' } });
    } catch (e) {
      console.warn('Error empujando evento GTM:', e);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.message}>
        {message}
        <a
          href={policyLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Política de cookies
        </a>
      </span>
      <button className={styles.btn} onClick={handleAccept}>
        {buttonText}
      </button>
    </div>
  );
}
