import React, { useCallback } from 'react';
import useProcesos from '../../hooks/useProcesos';
import HomeHero from '../../components/HomeHero/HomeHero';
import GeneralContacto from '../../components/GeneralContacto/GeneralContacto';
import HomeTestimonials from '../../components/HomeTestimonials/HomeTestimonials';
import HomeListings from '../../components/HomeListings/HomeListings';
import HomePorQue from '../../components/HomePorQue/HomePorQue';
import styles from './Home.module.scss';

const Home = () => {
  const { procesos, loading, error } = useProcesos();

  const scrollToListings = useCallback(() => {
    const target = document.getElementById('home-listings');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (loading) {
    return <p className={styles.loadingText}>Cargando ofertas...</p>;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <>
      <HomeHero scrollToListings={scrollToListings} />
      <div className={styles.container}>
        <HomeListings procesos={procesos} />
        <HomePorQue />
        <HomeTestimonials />
        <GeneralContacto />
      </div>
    </>
  );
};

export default Home;
