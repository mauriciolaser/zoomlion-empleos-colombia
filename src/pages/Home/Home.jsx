// Archivo: src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useEmpleos from '../../hooks/useEmpleos';
import HomeHero from '../../components/HomeHero/HomeHero'
import GeneralContacto from '../../components/GeneralContacto/GeneralContacto'
import HomeTestimonials from '../../components/HomeTestimonials/HomeTestimonials'
import HomeListings from '../../components/HomeListings/HomeListings'


import styles from './Home.module.scss';

const Home = () => {
  const { empleos, loading, error } = useEmpleos();

  if (loading) {
    return <p className={styles.loadingText}>Cargando ofertas...</p>;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <>
      <HomeHero />
      <div className={styles.container}>

<HomeListings empleos={empleos} />
        <HomeTestimonials />


        <GeneralContacto />
      </div>
    </>
  );
};


export default Home;
