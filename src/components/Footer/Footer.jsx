// src/components/Footer/Footer.jsx
import React from 'react';
import styles from './Footer.module.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/images/Footer/logo-footer.webp';
import logoMirage from '../../assets/images/Footer/logo-mirage.webp';

// Hover animation settings
const iconHover = {
  scale: 1.2,
  transition: { type: 'spring', bounce: 0.4 },
};

const Footer = () => {
  const handleMirageClick = () => {
    const page = window.location.pathname.substring(1) || 'home';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'ux_event',
      event_name: `${page}_mirage_link`,
      event_category: '',
      event_label: '',
      value: null,
      slug: null,
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* Columna 1: Logo y redes sociales */}
        <div className={styles.column}>
          <img src={logo} alt="ZoomLion Logo" className={styles.logo} />
          <div className={styles.social}>
            <motion.a
              href="https://facebook.com/ZoomlionPeruRegion"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconWrapper}
              whileHover={iconHover}
            >
              <FaFacebookF className={styles.icon} />
            </motion.a>
            <motion.a
              href="https://instagram.com/zoomlion.peru"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconWrapper}
              whileHover={iconHover}
            >
              <FaInstagram className={styles.icon} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/company/zoomlion-peru/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconWrapper}
              whileHover={iconHover}
            >
              <FaLinkedinIn className={styles.icon} />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@ZoomlionLatam"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconWrapper}
              whileHover={iconHover}
            >
              <FaYoutube className={styles.icon} />
            </motion.a>
          </div>
        </div>

        {/* Columna 2: Contacto (teléfono, correo, dirección) */}
        <div className={styles.column}>
          <p className={styles.text}>+5112131330</p>
          <p className={styles.text}>empleos@zoomlion.com.pe</p>
          <p className={styles.text}>
            Calle las Orquídeas 675, Oficina 1202. Lima, 15046 - San Isidro
          </p>
        </div>

        {/* Columna 3: Copyright, Política de Privacidad y Autoría */}
        <div className={styles.column}>
          <a
            href="https://en.zoomlion.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            © 2025 ZoomLion Heavy Industry SAC
          </a>
          <a
            href="https://www.zoomlion.com.pe/privacidad/privacidad_peru.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Política de Privacidad de Zoomlion
          </a>
          <a
            href="https://www.mirageconsultores.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mirageLink}
            onClick={handleMirageClick}
          >
            <img
              src={logoMirage}
              alt="Mirage Logo"
              className={styles.mirageLogo}
            />
            Desarrollada por Mirage | Agencia &amp; Consultora
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
