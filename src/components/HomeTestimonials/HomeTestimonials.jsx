// src/components/HomeTestimonials/HomeTestimonials.jsx
import React from 'react';
import styles from './HomeTestimonials.module.scss';
import data from '../../data/HomeTestimonials/testimonialsData.json';

// Imágenes de fondo
import img1 from '../../assets/images/HomeTestimonials/testimonial1.webp';
import img2 from '../../assets/images/HomeTestimonials/testimonial1.webp';

// Imágenes de personas (avatar)
import p1 from '../../assets/images/HomeTestimonials/person1.webp';
import p2 from '../../assets/images/HomeTestimonials/person2.webp';


const imagesMap = {
  'testimonial1.webp': img1,
  'testimonial2.webp': img2
};

const personImagesMap = {
  'person1.webp': p1,
  'person2.webp': p2
};

const HomeTestimonials = () => {
  const testimonials = data.map(item => ({
    ...item,
    image: imagesMap[item.image],
    person: personImagesMap[item.person],
  }));

  // Solo mostrar los dos primeros
  const visibles = testimonials.slice(0, 2);

  return (
    <section className={styles.homeTestimonials}>
      <div className={styles.container}>
        {/* Título con líneas */}
        <div className={styles.sectionTitleWrapper}>
          <div className={styles.lineLeft}></div>
          <h2 className={styles.title}>TESTIMONIOS</h2>
          <div className={styles.lineRight}></div>
        </div>

        {/* Dos cards 50/50 con texto y avatar */}
        <div className={styles.itemsWrapper}>
          {visibles.map(item => (
            <div
              key={item.id}
              className={styles.item}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className={styles.textContainer}>
                <div className={styles.avatarWrapper}>
                  <img
                    src={item.person}
                    alt={item.title}
                    className={styles.avatarImage}
                  />
                </div>
                <div className={styles.textOverlay}>
                  <h3 className={styles.textTitle}>{item.title}</h3>
                  <p className={styles.textBody}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
