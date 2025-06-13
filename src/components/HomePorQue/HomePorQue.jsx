import React from 'react'
import styles from './HomePorQue.module.scss'

import porque1 from '../../assets/images/HomePorQue/icon1.webp'
import porque2 from '../../assets/images/HomePorQue/icon2.webp'
import porque3 from '../../assets/images/HomePorQue/icon3.webp'

const items = [
  {
    img: porque1,
    title: 'PRESENCIA GLOBAL, IMPACTO LOCAL',
    desc: 'Únete a una marca global que mueve el desarrollo del Perú.',
  },
  {
    img: porque2,
    title: 'CRECIMIENTO PROFESIONAL',
    desc: 'Capacitación constante y oportunidades reales de desarrollo.',
  },
  {
    img: porque3,
    title: 'CULTURA DE EQUIPO',
    desc: 'Un ambiente colaborativo donde tu talento marca la diferencia.',
  },
]

const HomePorQue = () => (
  <section className={styles.homePorQue}>
    <div className={styles.container}>
      <div className={styles.sectionTitleWrapper}>
        <div className={styles.lineLeft} />
        <span className={styles.title}>
          ¿POR QUÉ TRABAJAR<br /> EN ZOOMLION?
        </span>
        <div className={styles.lineRight} />
      </div>

      <div className={styles.itemsWrapper}>
        {items.map((item, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.imageContainer}>
              <img src={item.img} alt={item.title} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HomePorQue
