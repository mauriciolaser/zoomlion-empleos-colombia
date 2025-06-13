import React from 'react'
import styles from './HomeHero.module.scss'

const HomeHero = ({ scrollToContact, onOpenCotizador }) => {
  return (
    <section className={styles.heroContainer}>
      {/* Columna izquierda: texto y botones */}
      <div className={styles.left}>
        <h2 className={styles.title}>TE ESTAMOS<br></br>BUSCANDO</h2>
        <p className={styles.subtitle}>
          Trae tu talento al mejor equipo<br></br>de profesionales en Perú y el mundo.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.ctaPrimary}
            onClick={onOpenCotizador}
          >
            VER OFERTAS
          </button>
          <button
            className={styles.ctaOutline}
            onClick={scrollToContact}
          >
            Contáctanos
          </button>
        </div>
      </div>

      {/* Columna derecha: imagen de fondo */}
      <div className={styles.right} />
    </section>
  )
}

export default HomeHero
