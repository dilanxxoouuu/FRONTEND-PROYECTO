-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-09-2024 a las 18:19:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `phphone`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_compras`
--

CREATE TABLE `carrito_compras` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito_compras`
--

INSERT INTO `carrito_compras` (`id_carrito`, `id_usuario`, `fecha_creacion`) VALUES
(1, 7, '2020-09-23 16:49:04'),
(2, 4, '2024-06-11 16:49:55'),
(3, 6, '2024-06-11 16:49:55'),
(4, 3, '2024-09-03 15:26:06'),
(5, 6, '2024-09-18 09:38:54'),
(6, 5, '2024-03-08 02:23:18'),
(7, 4, '2024-05-09 21:38:25'),
(8, 7, '2016-09-01 13:06:59'),
(9, 5, '2016-12-14 08:42:37'),
(10, 8, '2023-12-13 12:29:45'),
(11, 8, '2023-04-13 12:25:39'),
(12, 9, '2021-09-16 16:56:39'),
(13, 6, '2022-12-21 23:33:36'),
(14, 7, '2020-09-09 16:58:00'),
(15, 5, '2024-09-17 16:58:32'),
(16, 7, '2024-04-11 11:30:30'),
(17, 2, '2021-09-23 01:38:10'),
(18, 9, '2022-12-23 14:30:10'),
(19, 3, '2024-09-17 16:59:44'),
(20, 11, '2024-09-21 16:59:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `categoria_id` int(11) NOT NULL,
  `categoria_nombre` varchar(50) NOT NULL,
  `categoria_ubicacion` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`categoria_id`, `categoria_nombre`, `categoria_ubicacion`) VALUES
(1, 'Celulares', 'Teléfonos móviles y smartphones'),
(2, 'Accesorios', 'Accesorios para celulares'),
(3, 'Tablets', 'Tabletas electrónicas'),
(4, 'Smartwatches', 'Relojes inteligentes'),
(5, 'Auriculares', 'Auriculares y headphones'),
(6, 'Fundas y carcasas', 'Accesorios que protegen el dispositivo móvil de golpes y arañazos.'),
(7, 'Protectores de pantalla', ' Láminas protectoras que evitan daños en la pantalla del móvil o tablet.'),
(8, 'Cargadores y cables', ' Dispositivos para cargar móviles y otros accesorios, incluyendo cables USB y adaptadores.'),
(9, 'Altavoces Bluetooth', 'Dispositivos inalámbricos para reproducir música desde el móvil u otros dispositivos.'),
(10, 'Baterías externas (Power Banks)', 'Baterías portátiles para cargar dispositivos móviles cuando no hay acceso a una toma de corriente.'),
(11, 'Soportes para móviles', ' Accesorios para sostener o montar el móvil en superficies, como en coches o escritorios.'),
(12, 'Tarjetas de memoria (MicroSD)', 'Almacenamiento externo para ampliar la capacidad de móviles y tablets.'),
(13, 'Estaciones de carga inalámbrica', 'Dispositivos que permiten cargar el móvil sin cables mediante tecnología de carga por inducción.'),
(14, 'Smartbands (pulseras inteligentes)', 'Pulseras que monitorean la actividad física y conectan con el móvil.'),
(15, 'Adaptadores y conectores', 'Accesorios que permiten conectar dispositivos a otros puertos o interfaces.'),
(16, 'Accesorios para vehículos', 'Soportes, cargadores y otros accesorios diseñados para usar con móviles en el coche.'),
(17, 'Lentes y accesorios de fotografía móvil', 'Lentes y herramientas adicionales para mejorar la fotografía móvil.'),
(18, 'Drones controlados por smartphone', 'Drones que pueden ser operados y controlados a través de aplicaciones móviles.'),
(19, 'Teclados y ratones Bluetooth', ' Periféricos inalámbricos para controlar smartphones, tablets o computadoras.'),
(20, 'Dispositivos de realidad virtual (VR)', 'Gafas y equipos para experimentar la realidad virtual desde un smartphone.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `fecha_compra` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `id_usuario`, `id_proveedor`, `fecha_compra`, `total`) VALUES
(1, 1, 12, '2024-01-15 05:00:00', 150750.00),
(2, 1, 7, '2024-01-16 05:00:00', 220500.00),
(3, 1, 15, '2024-01-17 05:00:00', 320000.00),
(4, 1, 12, '2024-01-18 05:00:00', 180250.00),
(5, 1, 4, '2024-01-19 05:00:00', 199900.00),
(6, 1, 8, '2024-01-20 05:00:00', 245000.00),
(7, 1, 10, '2024-01-21 05:00:00', 305750.00),
(8, 1, 5, '2024-01-22 05:00:00', 455800.00),
(9, 1, 17, '2024-01-23 05:00:00', 500000.00),
(10, 1, 2, '2024-01-24 05:00:00', 275000.00),
(11, 1, 6, '2024-01-25 05:00:00', 375200.00),
(12, 1, 11, '2024-01-26 05:00:00', 600000.00),
(13, 1, 19, '2024-01-27 05:00:00', 450000.00),
(14, 1, 1, '2024-01-28 05:00:00', 310750.00),
(15, 1, 9, '2024-01-29 05:00:00', 150500.00),
(16, 1, 13, '2024-01-30 05:00:00', 425000.00),
(17, 1, 16, '2024-01-31 05:00:00', 380900.00),
(18, 1, 14, '2024-02-01 05:00:00', 550000.00),
(19, 1, 18, '2024-02-02 05:00:00', 298500.00),
(20, 1, 12, '2024-02-03 05:00:00', 410750.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_carrito`
--

CREATE TABLE `detalle_carrito` (
  `id_detalle` int(11) NOT NULL,
  `id_carrito` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_carrito`
--

INSERT INTO `detalle_carrito` (`id_detalle`, `id_carrito`, `id_producto`, `cantidad`) VALUES
(1, 1, 10, 13),
(2, 1, 11, 11),
(3, 2, 12, 9),
(4, 2, 13, 5),
(5, 3, 14, 7),
(6, 3, 15, 9),
(7, 4, 16, 3),
(8, 4, 17, 4),
(9, 5, 18, 5),
(10, 5, 19, 1),
(11, 6, 20, 2),
(12, 7, 10, 1),
(13, 7, 12, 2),
(14, 8, 13, 1),
(15, 8, 14, 3),
(16, 9, 15, 2),
(17, 9, 16, 2),
(18, 10, 17, 1),
(19, 10, 18, 2),
(20, 11, 19, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detalle` int(11) NOT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detalle`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 15, 15000.00),
(2, 2, 2, 20, 25000.00),
(3, 3, 3, 12, 12000.00),
(4, 4, 4, 25, 8000.00),
(5, 5, 5, 18, 45000.00),
(6, 6, 6, 30, 10000.00),
(7, 7, 7, 28, 16000.00),
(8, 8, 8, 14, 13000.00),
(9, 9, 9, 19, 20000.00),
(10, 10, 10, 22, 11000.00),
(11, 11, 11, 29, 30000.00),
(12, 12, 12, 26, 9000.00),
(13, 13, 13, 30, 25000.00),
(14, 14, 14, 24, 14000.00),
(15, 15, 15, 27, 6000.00),
(16, 16, 16, 13, 20000.00),
(17, 17, 17, 21, 18000.00),
(18, 18, 18, 23, 12000.00),
(19, 19, 19, 17, 10000.00),
(20, 20, 20, 10, 30000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL,
  `id_orden` int(11) DEFAULT NULL,
  `factura_fecha` date NOT NULL,
  `monto_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id_factura`, `id_orden`, `factura_fecha`, `monto_total`) VALUES
(1, 1, '2022-01-25', 2299500.00),
(2, 2, '2022-01-28', 3460000.00),
(3, 3, '2022-02-01', 1320000.00),
(4, 4, '2022-02-05', 390000.00),
(5, 5, '2022-02-10', 780000.00),
(6, 1, '2021-01-15', 12000000.00),
(7, 5, '2021-03-20', 5600000.00),
(8, 3, '2021-06-10', 180000.00),
(9, 10, '2021-09-05', 800000.00),
(10, 7, '2022-02-25', 8800000.00),
(11, 9, '2022-04-18', 3000000.00),
(12, 2, '2022-08-10', 1348500.00),
(13, 4, '2022-10-30', 35000000.00),
(14, 8, '2023-01-07', 900000.00),
(15, 11, '2023-03-21', 180000.00),
(16, 6, '2023-07-10', 239200.00),
(17, 13, '2023-09-18', 1300000.00),
(18, 15, '2023-11-02', 1200000.00),
(19, 12, '2024-01-15', 375000.00),
(20, 14, '2024-03-05', 4550000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_items`
--

CREATE TABLE `factura_items` (
  `id_factura_item` int(11) NOT NULL,
  `id_factura` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura_items`
--

INSERT INTO `factura_items` (`id_factura_item`, `id_factura`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 2000000.00),
(2, 2, 2, 1, 2500000.00),
(3, 3, 3, 1, 120000.00),
(4, 1, 10, 5, 59900.00),
(5, 2, 3, 8, 120000.00),
(6, 3, 15, 10, 120000.00),
(7, 4, 7, 3, 130000.00),
(8, 5, 19, 12, 65000.00),
(9, 6, 1, 6, 2000000.00),
(10, 7, 5, 7, 800000.00),
(11, 8, 13, 9, 20000.00),
(12, 9, 8, 4, 200000.00),
(13, 10, 16, 11, 800000.00),
(14, 11, 11, 2, 1500000.00),
(15, 12, 20, 15, 89900.00),
(16, 13, 2, 14, 2500000.00),
(17, 14, 6, 9, 100000.00),
(18, 15, 14, 4, 45000.00),
(19, 16, 9, 8, 29900.00),
(20, 17, 17, 10, 130000.00),
(21, 18, 4, 6, 200000.00),
(22, 19, 12, 5, 75000.00),
(23, 20, 18, 13, 350000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `id_orden` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_orden` date NOT NULL,
  `monto_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden`
--

INSERT INTO `orden` (`id_orden`, `id_usuario`, `fecha_orden`, `monto_total`) VALUES
(1, 4, '2022-01-25', 2299500.00),
(2, 5, '2022-01-28', 3460000.00),
(3, 6, '2022-02-01', 1320000.00),
(4, 7, '2022-02-05', 390000.00),
(5, 8, '2022-02-10', 780000.00),
(6, 4, '2024-09-01', 12000000.00),
(7, 5, '2024-09-02', 5600000.00),
(8, 3, '2024-09-03', 180000.00),
(9, 11, '2024-09-04', 800000.00),
(10, 2, '2024-09-05', 8800000.00),
(11, 8, '2024-09-06', 3000000.00),
(12, 7, '2024-09-07', 1348500.00),
(13, 4, '2024-09-08', 35000000.00),
(14, 11, '2024-09-09', 900000.00),
(15, 9, '2024-09-10', 180000.00),
(16, 6, '2024-09-11', 239200.00),
(17, 11, '2024-09-12', 1300000.00),
(18, 2, '2024-09-13', 87000.00),
(19, 5, '2024-09-14', 245000.00),
(20, 3, '2024-09-15', 175000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_detalle`
--

CREATE TABLE `orden_detalle` (
  `id_orden_detalle` int(11) NOT NULL,
  `id_orden` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden_detalle`
--

INSERT INTO `orden_detalle` (`id_orden_detalle`, `id_orden`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 12, 2000000.00),
(2, 2, 2, 10, 2500000.00),
(3, 3, 3, 2, 120000.00),
(4, 4, 6, 13, 100000.00),
(5, 5, 5, 21, 800000.00),
(6, 6, 6, 15, 100000.00),
(7, 7, 7, 22, 130000.00),
(8, 8, 9, 18, 29900.00),
(9, 9, 8, 27, 200000.00),
(10, 10, 10, 20, 59900.00),
(11, 11, 13, 13, 20000.00),
(12, 12, 12, 30, 75000.00),
(13, 13, 11, 12, 1500000.00),
(14, 14, 18, 25, 350000.00),
(15, 15, 17, 10, 130000.00),
(16, 16, 16, 14, 800000.00),
(17, 17, 20, 19, 89900.00),
(18, 18, 19, 23, 65000.00),
(19, 19, 14, 11, 45000.00),
(20, 20, 15, 16, 120000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `producto_id` int(11) NOT NULL,
  `producto_codigo` varchar(70) NOT NULL,
  `producto_nombre` varchar(70) NOT NULL,
  `producto_precio` bigint(20) NOT NULL,
  `producto_stock` int(11) NOT NULL,
  `producto_foto` varchar(500) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`producto_id`, `producto_codigo`, `producto_nombre`, `producto_precio`, `producto_stock`, `producto_foto`, `categoria_id`, `usuario_id`) VALUES
(1, '1', 'Samsung Galaxy S22', 2000000, 20, '', 1, 1),
(2, '2', 'iPhone 13', 2500000, 20, '', 1, 1),
(3, '3', 'Fundas para Samsung', 120000, 50, '', 6, 1),
(4, '4', 'Cargador rápido', 200000, 60, '', 8, 1),
(5, '5', 'Tablet Apple iPad', 800000, 80, '', 3, 1),
(6, '6', 'Smartwatch Fossil', 100000, 80, '', 4, 1),
(7, '7', 'Auriculares Sony', 130000, 80, '', 5, 1),
(8, '8', 'Batería externa', 200000, 50, '', 10, 1),
(9, '10', 'Anker Wireless Charger', 29900, 85, '', 13, 1),
(10, '11', 'SanDisk Ultra 64GB MicroSD', 59900, 100, '', 12, 1),
(11, '12', 'Xiaomi Redmi Note 13 Pro', 1500000, 10, '', 1, 1),
(12, '13', 'Xiaomi Mi Band 7', 75000, 55, '', 14, 1),
(13, '14', 'Cable Matters USB-C to HDMI Adapter', 20000, 70, '', 8, 1),
(14, '15', 'iOttie Easy One Touch Car Mount', 45000, 90, '', 16, 1),
(15, '16', 'Moment Wide Lens for Smartphone', 120000, 25, '', 17, 1),
(16, '17', 'DJI Mini 2 Drone', 800000, 15, '', 18, 1),
(17, '18', 'Logitech K380 Bluetooth Keyboard', 130000, 40, '', 19, 1),
(18, '19', 'Oculus Quest 2 VR Headset', 350000, 30, '', 20, 1),
(19, '20', 'Samsung Wireless Charger Pad', 65000, 45, '', 13, 1),
(20, '21', 'HyperCharge Portable Power Bank 20000mAh', 89900, 40, '', 10, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `direccion`, `telefono`, `email`) VALUES
(1, 'Tecnología Global', 'Calle 123, Bogotá', '3001234567', 'contacto@tecnologiaglobal.com'),
(2, 'Distribuidores Móviles', 'Carrera 45, Medellín', '3109876543', 'ventas@distribuidoresmoviles.com'),
(3, 'Accesorios y Más', 'Avenida Central 89, Cali', '3201239876', 'info@accesoriosymas.com'),
(4, 'Soluciones Digitales', 'Calle 56, Barranquilla', '3157654321', 'ventas@solucionesdigitales.com'),
(5, 'Mundo Tech', 'Carrera 12, Cartagena', '3005556666', 'mundo@tech.com'),
(6, 'SmartPro', 'Avenida 10, Bogotá', '3211234567', 'contacto@smartpro.com'),
(7, 'Conectando', 'Calle 34, Bucaramanga', '3149871234', 'soporte@conectando.com'),
(8, 'Futuro Digital', 'Carrera 21, Manizales', '3221112233', 'ventas@futurodigital.com'),
(9, 'Soluciones Móviles', 'Calle 78, Pereira', '3002223344', 'info@solucionesmoviles.com'),
(10, 'TechStore', 'Carrera 9, Bogotá', '3131239876', 'contacto@techstore.com'),
(11, 'Distribuciones Unicas', 'Avenida Siempreviva 123, Cartagena', '3129876543', 'contacto@distribucionesunicas.com'),
(12, 'Proveeduría 24/7', 'Carrera 15, Medellín', '3203456789', 'soporte@proveeduria247.com'),
(13, 'Innovación Móvil', 'Calle 45, Cali', '3149876543', 'ventas@innovacionmovil.com'),
(14, 'Accesorios Avanzados', 'Carrera 28, Barranquilla', '3153334444', 'info@accesoriosavanzados.com'),
(15, 'Tecnología y Futuro', 'Avenida Principal 10, Cartagena', '3217654321', 'soporte@tecnologiayfuturo.com'),
(16, 'Smart Solutions', 'Carrera 19, Medellín', '3201112233', 'ventas@smartsolutions.com'),
(17, 'Móvil Express', 'Calle 98, Bogotá', '3125556666', 'info@movilexpress.com'),
(18, 'Distribuciones Elite', 'Carrera 11, Bucaramanga', '3104445555', 'contacto@distribucioneselite.com'),
(19, 'Tech Innovators', 'Avenida Innovación 88, Manizales', '3113334444', 'ventas@techinnovators.com'),
(20, 'Proveedores Globales', 'Calle Internacional 99, Cali', '3135556666', 'global@proveedores.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `usuario_id` int(11) NOT NULL,
  `usuario_nombre` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `usuario_apellido` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `usuario_usuario` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `usuario_clave` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL,
  `usuario_email` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`usuario_id`, `usuario_nombre`, `usuario_apellido`, `usuario_usuario`, `usuario_clave`, `usuario_email`) VALUES
(1, 'Administrador', 'Principal', 'Administrador', '$2y$10$EPY9LSLOFLDDBriuJICmFOqmZdnDXxLJG8YFbog5LcExp77DBQvgC', 'administrador25@gmail.com'),
(2, 'Johan', 'benavides', 'Johan', '$2y$10$VqQZiPUKbDzwFl5iw6/wlufiA6Ms6mty/sqsY.Nfn8WqPkuTBQWc6', 'johancho123@hotmail.com'),
(3, 'Dilan', 'Garcia', 'Dilan', '$2y$10$9BUQE.HQ.mx71PGAE4njTO8XX9rCrp2HaTj.FC/QZV9rcSLuV0VHq', 'dilanxx15@outlook.com'),
(4, 'Juan', 'Pérez', 'JuanPerez', '$2y$10$56f5hIP7/o8LvuPOIc6kSexor/61xVNDT3mig1G2PbAePU4YVOk3.', 'juanitoperez15@soysena.com'),
(5, 'María', 'Gómez', 'Maria1', '$2y$10$kV16OfwKu7aCKS4blkCxS.ie8WKKmtv3tyP9tOV3K4R7Ska6f0e1u', 'Mariapaquita@gmail.com'),
(6, 'Pedro', 'Rodríguez', 'Pedro2', '$2y$10$.f5vtWdGNIM8/wqLjS6W1.LvN72ZU2/.KlDffDP./X2EL1QUSqdby', 'PedroRodri@gmail.com'),
(7, 'Ana', 'Sánchez', 'Ana123', '$2y$10$szwNHK78jGHUB0wzBWg7zOcjuAwM2YkaLDyfcPG9882g8FsETr.bq', 'anasanchez@hotmail.com'),
(8, 'Luis', 'Martínez', 'Luisnosecomoponerme', '$2y$10$HTyCQaJtmDDBbD29SsycPOFHL4TbRTUqTGP29cVX6TLdwcfh/RUOy', 'luisitomarti@gmail.com'),
(9, 'Juanita', 'Gonzalez', 'juanitalapilla', 'ү-y:??	?W?D=?1????j$liX?%?g', 'juanitabanana@gmail.com'),
(10, 'Carlos', 'Sánchez', 'carlossanchez', '??Ʃ?s??v??\"?EW', 'carlos.sanchez@example.com'),
(11, 'Andrea', 'Benavides', 'aandreis7898', 'D]?+-n?Y6???u\'?O', 'andreeee14@hotmail.com'),
(12, 'Juan', 'Pérez', 'juanperez', 'LZǪ??5k?????K', 'juan.perez@example.com'),
(13, 'Ana', 'García', 'anagarcia', 'd3cd4084295712159eb0c2278e6b6ff7fa2e3c6bfe2d585fc9f7eb00953b03cc', 'ana.garcia@example.com'),
(14, 'Luis', 'Martínez', 'luismartinez', '20cb61a35db1bcab0540404d065754f05ad470745f52b4f8fcc388770fc3f329', 'luis.martinez@example.com'),
(15, 'Carla', 'López', 'carlalopez', 'ccf826b5c24a839b66e0e3fc5db057dbb2825552860d7521c99f58e738d4aad9', 'carla.lopez@example.com'),
(16, 'José', 'Rodríguez', 'joserodriguez', 'c3615d8389f5d5bad91c51f5b9bdd8da0a2ec0190688e046acbd050d60026b13', 'jose.rodriguez@example.com'),
(17, 'María', 'Hernández', 'mariahernandez', 'aa8baedba7e00c71a2f8d389985293566d6dcc2c10390b77374c78ef2309dc44', 'maria.hernandez@example.com'),
(18, 'Sofía', 'Jiménez', 'sofiajimenez', '44d57ee5f7979f7351201ea7c6b9d6f3a9e8808cf9e285391e3059c18776dff4', 'sofia.jimenez@example.com'),
(19, 'Diego', 'Torres', 'diegotorres', '8c7bfad7ee3a0b1fdf8ac2e9e4111a76f5ade68519e478c0ef80028cb82c60f5', 'diego.torres@example.com'),
(20, 'Laura', 'Mora', 'lauramora', '732db97ae43f4d75ad568abd0d6563fd4910c3bd67609ef6229ccd2d984c27cd', 'laura.mora@example.com'),
(22, '19', 'Antonio', 'Casallas', '㥻 ?>??]Bu??ؘ', 'antonycasas@gmail.com'),
(23, '18', 'Karen', 'Tonguino', '?-?&]??r???Fg}', 'karennn2315@gmail.com'),
(24, '17', 'Edgar', 'Otalora', 'b$8??\"3/ۡ?tm??K', 'otoedgar@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_carrito` (`id_carrito`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `id_orden` (`id_orden`);

--
-- Indices de la tabla `factura_items`
--
ALTER TABLE `factura_items`
  ADD PRIMARY KEY (`id_factura_item`),
  ADD KEY `id_factura` (`id_factura`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `orden_detalle`
--
ALTER TABLE `orden_detalle`
  ADD PRIMARY KEY (`id_orden_detalle`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`producto_id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `factura_items`
--
ALTER TABLE `factura_items`
  MODIFY `id_factura_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `orden_detalle`
--
ALTER TABLE `orden_detalle`
  MODIFY `id_orden_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `producto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito_compras`
--
ALTER TABLE `carrito_compras`
  ADD CONSTRAINT `carrito_compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`usuario_id`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`usuario_id`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `detalle_carrito`
--
ALTER TABLE `detalle_carrito`
  ADD CONSTRAINT `detalle_carrito_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito_compras` (`id_carrito`),
  ADD CONSTRAINT `detalle_carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`producto_id`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`producto_id`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `orden` (`id_orden`);

--
-- Filtros para la tabla `factura_items`
--
ALTER TABLE `factura_items`
  ADD CONSTRAINT `factura_items_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_factura`),
  ADD CONSTRAINT `factura_items_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`producto_id`);

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`usuario_id`);

--
-- Filtros para la tabla `orden_detalle`
--
ALTER TABLE `orden_detalle`
  ADD CONSTRAINT `orden_detalle_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `orden` (`id_orden`),
  ADD CONSTRAINT `orden_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`producto_id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
