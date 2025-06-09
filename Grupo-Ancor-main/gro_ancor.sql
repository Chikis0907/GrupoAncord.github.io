-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:8889
-- Tiempo de generación: 29-04-2025 a las 06:56:26
-- Versión del servidor: 8.0.40
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gro_ancor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resumen_costos`
--
CREATE DATABASE CALCULAR_COSTOS_METAL;
USE CALCULAR_COSTOS_METAL;

CREATE TABLE resumen_costos (
  id int NOT NULL AUTO_INCREMENT,
  tipos_maquinado VARCHAR(255) DEFAULT NULL,
  tipo_material VARCHAR(255) DEFAULT NULL,
  precio_total_material VARCHAR(255) DEFAULT NULL,
  tiempo_maquinado VARCHAR(255) DEFAULT NULL,
  costo_total_operacion VARCHAR(255) DEFAULT NULL,
  volumen_maquinar VARCHAR(255) DEFAULT NULL,
  avance VARCHAR(255) DEFAULT NULL,
  costo_herramienta VARCHAR(255) DEFAULT NULL,
  logistica VARCHAR(255) DEFAULT NULL,
  administracion VARCHAR(255) DEFAULT NULL,
  costos_extras VARCHAR(255) DEFAULT NULL,
  costo_total_general VARCHAR(255) DEFAULT NULL,
  fecha_creacion date DEFAULT NULL,
  PRIMARY KEY (id)
) ;
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  usuario VARCHAR(25) NOT NULL,
  contrasena number NOT NULL

);
INSERT INTO usuarios ( Iid,usuario, contrasena)
VALUES (1,'usuario', 123456);

CREATE TABLE precios(
  id int PRIMARY KEY,
   precioMax DECIMAL(10,2) NOT NULL,
  precioMin DECIMAL(10,2) NOT NULL
);

INSERT INTO precios (id, precioMax, precioMin)
VALUES (1, 51.00, 12.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `resumen_costos`
--
ALTER TABLE `resumen_costos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `resumen_costos`
--
ALTER TABLE `resumen_costos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
