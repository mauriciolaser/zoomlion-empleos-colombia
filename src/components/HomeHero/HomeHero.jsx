import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import styles from './HomeHero.module.scss';
import animationData from '../../assets/animations/HomeHero/HomeHero.json';

const HomeHero = ({ scrollToContact, onOpenCotizador }) => {
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);

  const fullSublabel =
    'Trae tu talento al mejor equipo de profesionales en Perú y el mundo.';

  // Variants para Framer Motion
  const titleVariant = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 10 },
    },
  };

  // Reducimos staggerChildren para que las letras aparezcan más rápido
  const sublabelContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.005 } },
  };

  const sublabelLetter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const buttonVariant = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20, delay: 1.2 },
    },
    whileHover: { scale: 1.1 },
  };

  // Variant para la animación fade up de Lottie
  const lottieVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 10 },
    },
    exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.content}>
        {/* Texto a la izquierda */}
        <div className={styles.textContainer}>
          <motion.h2
            className={styles.visionLabel}
            variants={titleVariant}
            initial="initial"
            animate="animate"
            onAnimationComplete={() => setTitleDone(true)}
          >
            TE ESTAMOS BUSCANDO
          </motion.h2>

          <motion.p
            className={styles.visionSublabel}
            variants={sublabelContainer}
            initial="hidden"
            animate={titleDone ? 'visible' : 'hidden'}
            onAnimationComplete={() => setSubtitleDone(true)}
          >
            {fullSublabel.split('').map((char, i) => (
              <motion.span key={i} variants={sublabelLetter}>
                {char}
              </motion.span>
            ))}
            <motion.span
              className={styles.cursor}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
            >
              |
            </motion.span>
          </motion.p>

          <div className={styles.actionContainer}>
            <motion.div
              variants={buttonVariant}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
            >
              <button onClick={onOpenCotizador} className={styles.ctaButton}>
                VER OFERTAS
              </button>
            </motion.div>
            <motion.div
              variants={buttonVariant}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
            >
              <button onClick={scrollToContact} className={styles.ctaButtonOutline}>
                Contáctanos
              </button>
            </motion.div>
          </div>
        </div>

        {/* Animación Lottie a la derecha con fade up */}
        <div className={styles.animationContainer}>
          <AnimatePresence>
            {subtitleDone && (
              <motion.div
                key="lottie"
                variants={lottieVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.lottieWrapper}
              >
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  className={styles.lottie}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
