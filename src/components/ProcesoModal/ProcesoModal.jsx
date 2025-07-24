// Archivo: src/components/ProcesoModal/ProcesoModal.jsx
import React from 'react';
import styles from './ProcesoModal.module.scss';

const ProcesoModal = ({ isOpen, onClose, title, message, type = 'info', showCloseButton = true }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}>{getIcon()}</span>
          {title && <h3 className={styles.modalTitle}>{title}</h3>}
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{message}</p>
        </div>
        
        {showCloseButton && (
          <div className={styles.modalFooter}>
            <button 
              className={`${styles.modalButton} ${styles[type]}`}
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcesoModal;