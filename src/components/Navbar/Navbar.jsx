import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar = () => (
  <nav className={styles.navbar}>
    <Link to="/">Home</Link>
    <Link to="/admin">Admin</Link>
  </nav>
);

export default Navbar;
