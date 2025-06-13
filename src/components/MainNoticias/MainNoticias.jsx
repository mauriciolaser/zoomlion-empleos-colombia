// src/components/MainNoticias/MainNoticias.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import styles from './MainNoticias.module.scss';
import useNoticias from '../../hooks/useNoticias';

// Hook interno para detectar mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const MotionImg = motion.img;
const MotionLink = motion.a;

const principalVariant = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

const restoVariant = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

const imgHover = { scale: 1.05 };
const imgTransition = { type: 'spring', stiffness: 200, damping: 20 };

// Para los iconos sociales
const iconHover = { scale: 1.2 };
const iconTransition = { type: 'spring', stiffness: 200, damping: 20 };

const MainNoticias = () => {
  const noticias = useNoticias(5);
  const isMobile = useIsMobile();

  const isLoading = noticias.length === 0;

  return (
    <div className={styles.section}>
      <div className={styles.inner}>

        {/* Título siempre renderizado */}
        <div className={styles.sectionTitleWrapper}>
          <div className={styles.lineLeft} />
          <h2 className={styles.title}>NOTICIAS</h2>
          <div className={styles.lineRight} />
        </div>

        {isLoading ? (
          // ====== ESTADO DE CARGA ======
          <div className={styles.loading}>
            Cargando noticias...
          </div>
        ) : isMobile ? (
          // ==== LAYOUT MOBILE: 3 cards iguales + sección sociales ====
          <div className={styles.desktopLayout}>
            {noticias.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                className={styles.mainPreview}
                variants={restoVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={`/noticias/${item.slug}`}
                  className={styles.mainTitle}
                >
                  {item.titulo}
                </Link>
                <MotionImg
                  src={item.previsualizacion}
                  alt={item.titulo}
                  className={styles.mainImage}
                  whileHover={imgHover}
                  transition={imgTransition}
                />
              </motion.div>
            ))}

            {/* Sección Sociales */}
            <div className={styles.info}>
              <div className={styles.follow}>Síguenos en las redes</div>
              <div className={styles.social}>
                <MotionLink
                  href="https://facebook.com/ZoomlionPeruRegion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconWrapper}
                  whileHover={iconHover}
                  transition={iconTransition}
                >
                  <FaFacebookF className={styles.icon} />
                </MotionLink>
                <MotionLink
                  href="https://instagram.com/zoomlion.peru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconWrapper}
                  whileHover={iconHover}
                  transition={iconTransition}
                >
                  <FaInstagram className={styles.icon} />
                </MotionLink>
                <MotionLink
                  href="https://www.linkedin.com/company/zoomlion-peru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconWrapper}
                  whileHover={iconHover}
                  transition={iconTransition}
                >
                  <FaLinkedinIn className={styles.icon} />
                </MotionLink>
                <MotionLink
                  href="https://www.youtube.com/@ZoomlionLatam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconWrapper}
                  whileHover={iconHover}
                  transition={iconTransition}
                >
                  <FaYoutube className={styles.icon} />
                </MotionLink>
              </div>
            </div>
          </div>
        ) : (
          // ==== LAYOUT DESKTOP: 2 principales + 2 secundarios + sección sociales en el sidebar ====
          <div className={styles.desktopLayout}>
            <div className={styles.mainContainer}>
              {noticias.slice(0, 2).map((item) => (
                <motion.div
                  key={item.id}
                  className={styles.mainPreview}
                  variants={principalVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/noticias/${item.slug}`}
                    className={styles.mainTitle}
                  >
                    {item.titulo}
                  </Link>
                  <MotionImg
                    src={item.previsualizacion}
                    alt={item.titulo}
                    className={styles.mainImage}
                    whileHover={imgHover}
                    transition={imgTransition}
                  />
                </motion.div>
              ))}
            </div>
            <div className={styles.sidebar}>
              {noticias.slice(2, 4).map((item) => (
                <motion.div
                  key={item.id}
                  className={styles.entry}
                  variants={restoVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <img
                    src={item.previsualizacion}
                    alt={item.titulo}
                    className={styles.entryImage}
                  />
                  <Link
                    to={`/noticias/${item.slug}`}
                    className={styles.entryTitle}
                  >
                    {item.titulo}
                  </Link>
                </motion.div>
              ))}

              {/* Sección Sociales dentro del sidebar */}
              <div className={styles.info}>
                <div className={styles.follow}>Síguenos en las redes</div>
                <div className={styles.social}>
                  <MotionLink
                    href="https://facebook.com/ZoomlionPeruRegion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconWrapper}
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <FaFacebookF className={styles.icon} />
                  </MotionLink>
                  <MotionLink
                    href="https://instagram.com/zoomlion.peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconWrapper}
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <FaInstagram className={styles.icon} />
                  </MotionLink>
                  <MotionLink
                    href="https://www.linkedin.com/company/zoomlion-peru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconWrapper}
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <FaLinkedinIn className={styles.icon} />
                  </MotionLink>
                  <MotionLink
                    href="https://www.youtube.com/@ZoomlionLatam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconWrapper}
                    whileHover={iconHover}
                    transition={iconTransition}
                  >
                    <FaYoutube className={styles.icon} />
                  </MotionLink>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNoticias;
