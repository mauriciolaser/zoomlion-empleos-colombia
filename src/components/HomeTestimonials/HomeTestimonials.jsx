import React from 'react';
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
  const testimonials = data.map(item => ({
    ...item,
    image: imagesMap[item.image],
  }));

  // Solo los dos primeros testimonios
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

        {/* Dos cards 50/50 con texto dentro */}
        <div className={styles.itemsWrapper}>
          {visibles.map(item => (
            <div
              key={item.id}
              className={styles.item}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className={styles.textOverlay}>
                <h3 className={styles.textTitle}>{item.title}</h3>
                <p className={styles.textBody}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
