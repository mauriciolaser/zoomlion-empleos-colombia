// src/components/GeneralContacto/GeneralContacto.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GeneralContactoCard from './GeneralContactoCard';
import contactoData from '../../data/GeneralContacto/contactoData.json';
import styles from './GeneralContacto.module.scss';

const cardVariants = {
  hidden: { x: 150, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 60, damping: 15 },
  },
};

const GeneralContacto = () => {
  return (
    <motion.div
      className={styles.container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={styles.wrapper}>
        <motion.div
          className={styles.cardContainer}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
        >
          {contactoData.map((item, index) => (
            <GeneralContactoCard
              key={index}
              data={item}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GeneralContacto;
