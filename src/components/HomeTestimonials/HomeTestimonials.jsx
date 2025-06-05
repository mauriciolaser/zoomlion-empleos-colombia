import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import styles from './HomeTestimonials.module.scss';
import data from '../../data/HomeTestimonials/testimonialsData.json';

// Importar todas las imágenes desde assets/images
import img1 from '../../assets/images/HomeTestimonials/testimonial1.webp';
import img2 from '../../assets/images/HomeTestimonials/testimonial2.webp';
import img3 from '../../assets/images/HomeTestimonials/testimonial3.webp';
import img4 from '../../assets/images/HomeTestimonials/testimonial4.webp';
import img5 from '../../assets/images/HomeTestimonials/testimonial5.webp';
import img6 from '../../assets/images/HomeTestimonials/testimonial6.webp';
import img7 from '../../assets/images/HomeTestimonials/testimonial7.webp';
import img8 from '../../assets/images/HomeTestimonials/testimonial8.webp';

const imagesMap = {
  'testimonial1.webp': img1,
  'testimonial2.webp': img2,
  'testimonial3.webp': img3,
  'testimonial4.webp': img4,
  'testimonial5.webp': img5,
  'testimonial6.webp': img6,
  'testimonial7.webp': img7,
  'testimonial8.webp': img8,
};

const HomeTestimonials = () => {
  // Resolver rutas de imagen
  const testimonials = data.map((item) => ({
    ...item,
    image: imagesMap[item.image],
  }));

  const total = testimonials.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000); // 5 segundos de intervalo

    return () => clearInterval(interval);
  }, [total]);

  // Índices de los dos siguientes testimonios “pendientes”
  const nextIndex1 = (activeIndex + 1) % total;
  const nextIndex2 = (activeIndex + 2) % total;

  return (
    <LayoutGroup>
      <section className={styles.container}>
        {/* Main card animada con AnimatePresence */}
        <div className={styles.mainWrapper}>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={testimonials[activeIndex].id}
              className={styles.mainCard}
              layoutId={`card-${testimonials[activeIndex].id}`}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ backgroundImage: `url(${testimonials[activeIndex].image})` }}
            >
              <div className={styles.overlay}>
                <h2 className={styles.title}>{testimonials[activeIndex].title}</h2>
                <p className={styles.body}>{testimonials[activeIndex].body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side cards: dos en fila, animadas con Framer Motion */}
        <div className={styles.sideCards}>
          {[nextIndex1, nextIndex2].map((idx) => {
            const item = testimonials[idx];
            return (
              <motion.div
                key={item.id}
                className={styles.sideCard}
                layoutId={`card-${item.id}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className={styles.sideOverlay}>
                  <h3 className={styles.sideTitle}>{item.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </LayoutGroup>
  );
};

export default HomeTestimonials;
