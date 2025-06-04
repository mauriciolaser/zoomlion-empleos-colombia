-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 04, 2025 at 09:38 PM
-- Server version: 10.4.32-MariaDB-log
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zlcpanel_empleos_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `email`) VALUES
(1, 'root', '', 'webmaster@desarrollo.mirageconsultores.com');

-- --------------------------------------------------------

--
-- Table structure for table `empleos`
--

CREATE TABLE `empleos` (
  `id` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `empresa` varchar(100) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `fecha_cierre` date DEFAULT NULL,
  `archivado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `empleos`
--

INSERT INTO `empleos` (`id`, `titulo`, `descripcion`, `empresa`, `ubicacion`, `fecha_publicacion`, `fecha_cierre`, `archivado`) VALUES
(1, 'Desarrollador Frontend', 'Responsable de desarrollar interfaces web modernas usando React y Sass. Se valorará experiencia con Vite y buenas prácticas de accesibilidad.', 'Tech Solutions', 'Asia', '2025-05-10', '2025-06-10', 0),
(2, 'Analista de Datos Junior', 'Búsqueda de talento con conocimientos en SQL, Python y herramientas de visualización (Power BI o Tableau). Tareas: extraer, limpiar y analizar datos de distintas fuentes.', 'Data Insights S.L.', 'Barcelona', '2025-04-25', '2025-05-25', 0),
(3, 'Gato indio.', 'Administración y mantenimiento de servidores AlmaLinux 9, configuración de backups, monitorización y resolución de incidencias en entornos productivos.', 'Infraestructuras Globales', 'Caca', '2025-05-20', '2025-06-20', 1),
(4, 'afasfas', 'fasfasf', 'asfasf', 'asfasfaf', '2025-06-24', '2025-07-11', 0);

-- --------------------------------------------------------

--
-- Table structure for table `postulaciones`
--

CREATE TABLE `postulaciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `empleo_id` int(10) UNSIGNED NOT NULL,
  `archivo` varchar(255) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_postulacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `postulaciones`
--

INSERT INTO `postulaciones` (`id`, `usuario_id`, `empleo_id`, `archivo`, `mensaje`, `fecha_postulacion`) VALUES
(1, 1, 1, 'cv_ana_perez.pdf', 'Hola, adjunto mi CV. Tengo 2 años de experiencia en React y Sass.', '2025-06-04 13:06:11'),
(2, 2, 1, 'cv_luis_garcia.pdf', 'Buenas, me interesa la posición de Frontend. Trabajo con Vite desde hace 1 año.', '2025-06-04 13:06:11'),
(3, 3, 1, 'cv_maria_rodriguez.pdf', 'Adjunto CV. Experiencia en accesibilidad y testing de interfaces.', '2025-06-04 13:06:11'),
(4, 4, 2, 'cv_javier_lopez.pdf', 'Saludos, me postulo para Analista de Datos. Manejo SQL y Python.', '2025-06-04 13:06:11'),
(5, 5, 2, 'cv_sofia_martinez.pdf', 'Adjunto documento con mis certificaciones en Power BI.', '2025-06-04 13:06:11'),
(6, 6, 2, 'cv_david_fernandez.pdf', 'Tengo 1 año de experiencia haciendo dashboard en Tableau. Adjunto CV.', '2025-06-04 13:06:11'),
(7, 7, 3, 'cv_lucia_gomez.pdf', 'Buenas tardes, he administrado servidores AlmaLinux en proyectos anteriores.', '2025-06-04 13:06:11'),
(8, 8, 3, 'cv_carlos_sanchez.pdf', 'Adjunto CV. Experiencia en backups y monitorización con Nagios.', '2025-06-04 13:06:11'),
(9, 9, 3, 'cv_elena_torres.pdf', 'Me interesa el puesto de SysAdmin. He trabajado con Ansible y AlmaLinux.', '2025-06-04 13:06:11');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `fecha_registro`) VALUES
(1, 'Ana Pérez', 'ana.perez@example.com', 'password123', '2025-06-04 13:06:11'),
(2, 'Luis García', 'luis.garcia@example.com', 'password123', '2025-06-04 13:06:11'),
(3, 'María Rodríguez', 'maria.rodriguez@example.com', 'password123', '2025-06-04 13:06:11'),
(4, 'Javier López', 'javier.lopez@example.com', 'password123', '2025-06-04 13:06:11'),
(5, 'Sofía Martínez', 'sofia.martinez@example.com', 'password123', '2025-06-04 13:06:11'),
(6, 'David Fernández', 'david.fernandez@example.com', 'password123', '2025-06-04 13:06:11'),
(7, 'Lucía Gómez', 'lucia.gomez@example.com', 'password123', '2025-06-04 13:06:11'),
(8, 'Carlos Sánchez', 'carlos.sanchez@example.com', 'password123', '2025-06-04 13:06:11'),
(9, 'Elena Torres', 'elena.torres@example.com', 'password123', '2025-06-04 13:06:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `empleos`
--
ALTER TABLE `empleos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `postulaciones`
--
ALTER TABLE `postulaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_postulaciones_usuario` (`usuario_id`),
  ADD KEY `fk_postulaciones_empleo` (`empleo_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unico` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `empleos`
--
ALTER TABLE `empleos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `postulaciones`
--
ALTER TABLE `postulaciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `postulaciones`
--
ALTER TABLE `postulaciones`
  ADD CONSTRAINT `fk_postulaciones_empleo` FOREIGN KEY (`empleo_id`) REFERENCES `empleos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_postulaciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
