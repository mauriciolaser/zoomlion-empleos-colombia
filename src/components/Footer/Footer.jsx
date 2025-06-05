// src/components/Footer/Footer.jsx
import React from 'react';
import styles from './Footer.module.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/images/Footer/logo-footer.webp';
import logoMirage from '../../assets/images/Footer/logo-mirage.webp'; // <-- Nueva importación

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

  const lines = [
    { name: 'Agricultura', slug: 'agricultura' },
    { name: 'Grúas torre', slug: 'gruas-torre' },
    { name: 'Concreto', slug: 'concreto' },
    { name: 'Minería', slug: 'mineria' },
    { name: 'Grúas móviles', slug: 'gruas-moviles' },
    { name: 'Montacargas', slug: 'montacargas' },
    { name: 'Elevación', slug: 'elevacion' },
    { name: 'Excavadoras', slug: 'movimiento-de-tierras' },
  ];

  const pages = [
    { name: 'Productos', slug: 'productos' },
    { name: 'Servicios', slug: 'servicios' },
    { name: 'Noticias', slug: 'noticias' },
    { name: 'Contacto', slug: 'contacto' },
  ];

  return (
    <footer className={styles.footer}>
      {/* Sección superior: logo + contacto, líneas y páginas (solo en desktop) */}
      <div className={styles.top}>
        <div className={styles.left}>
          <img src={logo} alt="ZoomLion Logo" className={styles.logo} />
          <div className={styles.info}>
            <p className={styles.text}>+5112131330</p>
            <p className={styles.text}>empleos@zoomlion.com.pe</p>
            <p className={styles.text}>
              Calle las Orquídeas 675, Oficina 1202. Lima, 15046 - San Isidro
            </p>
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
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copy}>
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
        </div>
        <div className={styles.mirage}>
          <a
            href="https://www.mirageconsultores.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mirageLink}
            onClick={handleMirageClick}
          >
            <img
              src={logoMirage} // <-- Uso de la imagen importada
              alt="Mirage Logo"
              className={styles.mirageLogo}
            />
            Desarrollada por Mirage | Agencia & Consultora
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
