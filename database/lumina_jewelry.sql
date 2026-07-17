-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 17, 2026 at 02:06 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `lumina_jewelry`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(40) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `city` varchar(80) NOT NULL,
  `district` varchar(80) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `country` char(2) NOT NULL DEFAULT 'BD',
  `is_default` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `label`, `name`, `phone`, `line1`, `line2`, `city`, `district`, `postcode`, `country`, `is_default`) VALUES
(2, 47, 'Ipsam non culpa et e', 'Maryam Dunn', '01777775538', 'Nihil iusto rerum ir', 'Aspernatur laborum i', 'Omnis et consequatur', 'Quam asperiores volu', 'Laboris eu fugit et', 'BD', 1),
(7, 53, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'R9CV+W8R', 'মাটিকাটা রোড', 'ঢাকা', NULL, '1207', 'BD', 1),
(8, 56, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh', NULL, 'Dhaka', NULL, '1207', 'BD', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` smallint(5) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `analytics_events`
--

CREATE TABLE `analytics_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `event` enum('page_view','product_view','add_to_cart','search','select_item','remove_from_cart','view_cart','begin_checkout','add_shipping_info','add_payment_info','purchase','refund','web_vital','book_appointment','submit_bespoke_request') NOT NULL DEFAULT 'page_view',
  `path` varchar(255) NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `value` decimal(12,2) DEFAULT NULL,
  `currency` char(3) DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `label` varchar(120) DEFAULT NULL,
  `referrer_source` enum('direct','organic','social','referral','email') NOT NULL DEFAULT 'direct',
  `referrer_host` varchar(190) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `analytics_events`
--

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(9, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 11:54:52'),
(10, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/riviere-eternelle', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 11:55:57'),
(11, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 11:56:05'),
(12, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 11:56:12'),
(13, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 11:56:36'),
(14, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:00:13'),
(15, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:00:17'),
(16, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:34'),
(17, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:37'),
(18, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:45'),
(19, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:51'),
(20, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:51'),
(21, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:53'),
(22, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:06:58'),
(23, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:07:03'),
(24, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:08:15'),
(25, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:08:17'),
(26, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:08:22'),
(27, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:09:43'),
(28, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:09:51'),
(29, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 12:10:12'),
(30, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:35:26'),
(31, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:35:36'),
(32, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:36:23'),
(33, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:36:43'),
(34, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:36:55'),
(35, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:37:04'),
(36, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:52:21'),
(37, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:58:12'),
(38, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:58:42'),
(39, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 15:59:22'),
(40, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:02:09'),
(41, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:02:32'),
(42, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:03:17'),
(43, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:03:53'),
(44, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:20:29'),
(45, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:21:16'),
(46, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:22:11'),
(47, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:23:36'),
(48, 'a58074a4-e3fd-49f9-a490-8fcece13c0cb', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:25:19'),
(49, 'a58074a4-e3fd-49f9-a490-8fcece13c0cb', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:26:29'),
(50, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:27:22'),
(51, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:27:24'),
(52, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:28:05'),
(53, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:28:06'),
(54, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:33:43'),
(55, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:33:47'),
(56, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:17'),
(57, 'a58074a4-e3fd-49f9-a490-8fcece13c0cb', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:17'),
(58, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:18'),
(59, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:20'),
(60, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:21'),
(61, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:22'),
(62, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:23'),
(63, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:35:24'),
(64, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:39:06'),
(65, 'a58074a4-e3fd-49f9-a490-8fcece13c0cb', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:39:20'),
(66, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:40:13'),
(67, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:40:24'),
(68, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/heritage-rani-haar', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:40:25'),
(69, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:42:06'),
(70, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/l-eclat-solitaire', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:42:11'),
(71, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:42:33'),
(72, 'a58074a4-e3fd-49f9-a490-8fcece13c0cb', NULL, 'page_view', '/products/aurelle-wedding-band', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:42:37'),
(73, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:43:17'),
(74, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:45:07'),
(75, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-11 16:46:29'),
(76, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account/register', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:20:47'),
(77, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:22:14'),
(78, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:23:56'),
(79, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:25:06'),
(80, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:25:26'),
(81, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:26:02'),
(82, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:58:28'),
(83, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:58:35'),
(84, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:58:48'),
(85, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:58:59'),
(86, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:59:03'),
(87, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 13:59:13'),
(88, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:01:36'),
(89, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/register', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:01:45'),
(90, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:01:59'),
(91, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/jhumka-royale', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:06'),
(92, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:10'),
(93, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:23'),
(94, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:29'),
(95, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:31'),
(96, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:35'),
(97, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:02:39'),
(98, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/goutte-hoops', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:13'),
(99, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:25'),
(100, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/jhumka-royale', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:27'),
(101, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:29'),
(102, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:30'),
(103, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:34'),
(104, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lueur-studs', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:36'),
(105, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:39'),
(106, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:46'),
(107, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/noor-bangle-pair', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:47'),
(108, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:53'),
(109, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:03:59'),
(110, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/scintille-nose-pin', 31, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:04:00'),
(111, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:04:12'),
(112, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:04:15'),
(113, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:04:24'),
(114, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:05:18'),
(115, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/l-eclat-solitaire', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:05:22'),
(116, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:07:04'),
(117, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:07:28'),
(118, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:08:56'),
(119, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:09:05'),
(120, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:09:11'),
(121, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:09:14'),
(122, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:09:45'),
(123, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:10:30'),
(124, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:20:06'),
(125, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/products/lien-bracelet-homme', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:21:00'),
(126, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/lien-bracelet-homme', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:21:01'),
(127, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:21:07'),
(128, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:23:40'),
(129, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:23:57'),
(130, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:24:03'),
(131, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:24:29'),
(132, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:25:19'),
(133, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:25:24'),
(134, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:25:29'),
(135, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:26:28'),
(136, '5243c9ca-90d3-4ea7-9aa7-56b9f532da1e', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:28:29'),
(137, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:28:57'),
(138, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:29:15'),
(139, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:33:20'),
(140, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:35:04'),
(141, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 14:45:50'),
(142, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:00:10'),
(143, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:08:19'),
(144, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:08:33'),
(145, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:08:47'),
(146, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:11:49'),
(147, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:13:23'),
(148, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:31:27'),
(149, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:38:12'),
(150, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:39:02'),
(151, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:39:09'),
(152, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:39:25'),
(153, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 15:39:40'),
(154, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:02:52'),
(155, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:03:20'),
(156, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:05:28'),
(157, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:07:12'),
(158, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:09:02'),
(159, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:09:16'),
(160, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:10:42'),
(161, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:13:40'),
(162, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:13:52'),
(163, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:19:44'),
(164, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:19:48'),
(165, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:22:44'),
(166, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:22:44'),
(167, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:29:50'),
(168, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'product_view', '/products/test-diamond-ring-e2e', 49, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:41:34'),
(169, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:49:02'),
(170, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:50:01'),
(171, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:50:47'),
(172, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 16:51:17'),
(173, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'product_view', '/products/test-variant-ring-e2e', 51, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:19:49'),
(174, 'c95a9e0d-b5b9-4dae-b5c8-4774a690040e', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:20:51'),
(175, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:23:54'),
(176, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:24:12'),
(177, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:24:31'),
(178, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:24:36'),
(179, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:29:15'),
(180, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:29:15'),
(181, '6eb523c3-6780-422e-858e-d2c13eb4c4e9', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:42:59'),
(182, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:42:59'),
(183, '15e8bc29-44a7-4b72-a6d7-9ef70c607f48', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:44:05'),
(184, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 17:58:16'),
(185, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:01:23'),
(186, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:02:18'),
(187, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:03:38'),
(188, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:04:32'),
(189, '15e8bc29-44a7-4b72-a6d7-9ef70c607f48', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:04:57'),
(190, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:16:02'),
(191, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:16:06'),
(192, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:16:10'),
(193, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:16:33'),
(194, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:21:40'),
(195, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:21:44'),
(196, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:14'),
(197, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:19'),
(198, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:20'),
(199, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:24'),
(200, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:26'),
(201, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:40:37'),
(202, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:41:49'),
(203, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:41:54'),
(204, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:42:03'),
(205, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:42:09'),
(206, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:01'),
(207, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:03'),
(208, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:13'),
(209, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:22'),
(210, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:24'),
(211, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:27'),
(212, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:28'),
(213, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:28'),
(214, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:47:28'),
(215, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:48:31'),
(216, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:48:33'),
(217, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:48:48'),
(218, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:49:03'),
(219, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:49:12'),
(220, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-ring', 53, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:49:17'),
(221, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:49:23'),
(222, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:50:55'),
(223, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:53:38'),
(224, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:57:34'),
(225, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:57:37'),
(226, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:57:40'),
(227, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:57:46'),
(228, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 18:57:48'),
(229, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:13:12'),
(230, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:28:35'),
(231, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:34:07'),
(232, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:35:16'),
(233, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:35:23'),
(234, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:35:33'),
(235, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:39:13'),
(236, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:42:17'),
(237, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:46:37'),
(238, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:46:46'),
(239, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:47:37'),
(240, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:47:42'),
(241, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 19:47:56'),
(242, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:06:47'),
(243, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:06:53'),
(244, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:06:57'),
(245, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:07:04'),
(246, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:07:42'),
(247, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:17:09'),
(248, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:17:12'),
(249, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:17:34'),
(250, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:17:36'),
(251, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:18:00'),
(252, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:18:14'),
(253, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:18:49'),
(254, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:18:51'),
(255, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:24:44'),
(256, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:26:40'),
(257, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:27:16'),
(258, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:27:28'),
(259, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:27:41'),
(260, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:27:50'),
(261, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:28:23'),
(262, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:28:38'),
(263, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:28:41'),
(264, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:28:48'),
(265, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:29:22'),
(266, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:29:24'),
(267, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:29:41'),
(268, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:31:09'),
(269, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:31:48'),
(270, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:31:51'),
(271, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:32:33'),
(272, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:33:03'),
(273, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:33:04'),
(274, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:33:07'),
(275, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:35:07'),
(276, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:35:17'),
(277, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:35:55'),
(278, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:39:54'),
(279, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:46:13'),
(280, 'b45a40ad-5cce-415e-8b1b-38be062f0cb3', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:46:13'),
(281, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:47:15'),
(282, 'b45a40ad-5cce-415e-8b1b-38be062f0cb3', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:47:15'),
(283, 'b45a40ad-5cce-415e-8b1b-38be062f0cb3', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:50:53'),
(284, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:50:53'),
(285, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:53:23'),
(286, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 20:53:49'),
(287, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 21:50:42'),
(288, 'b45a40ad-5cce-415e-8b1b-38be062f0cb3', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 21:50:42'),
(289, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 21:57:48'),
(290, 'b45a40ad-5cce-415e-8b1b-38be062f0cb3', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 21:57:48'),
(291, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/cdp-verify-1783888886925', 58, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-12 22:50:51'),
(292, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:26:23'),
(293, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:27:05'),
(294, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:31:04'),
(295, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:31:27'),
(296, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:31:40'),
(297, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:31:48'),
(298, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:41:15'),
(299, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:41:18'),
(300, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:41:26'),
(301, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:41:28'),
(302, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:42:04'),
(303, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:42:32'),
(304, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:43:35'),
(305, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:43:44'),
(306, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:43:49'),
(307, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:43:54'),
(308, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:43:56'),
(309, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:06'),
(310, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:07'),
(311, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:10'),
(312, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:11'),
(313, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:17'),
(314, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:44:54'),
(315, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:45:04'),
(316, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:51:27'),
(317, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:09'),
(318, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:10'),
(319, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:19'),
(320, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:28'),
(321, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/churi', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:49'),
(322, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:53:53'),
(323, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:54:12'),
(324, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:56:12'),
(325, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:57:50'),
(326, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 07:57:59');

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(327, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:01:01'),
(328, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:01:01'),
(329, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:03:11'),
(330, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:03:29'),
(331, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:03:47'),
(332, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:05:47'),
(333, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:14:52'),
(334, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:17:43'),
(335, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:17:45'),
(336, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:18:24'),
(337, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:18:41'),
(338, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:19:35'),
(339, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:20:16'),
(340, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:20:22'),
(341, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:21:44'),
(342, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:21:50'),
(343, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:22:25'),
(344, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:22:25'),
(345, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:22:44'),
(346, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:23:14'),
(347, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:24:23'),
(348, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:24:31'),
(349, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:24:42'),
(350, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:24:48'),
(351, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:24:57'),
(352, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:27:33'),
(353, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:30:51'),
(354, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:30:57'),
(355, '3f0c5c36-edbe-478b-99c0-029b0d0b080b', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:33:08'),
(356, '7e54afb6-1835-4323-b98d-d4e6c776352f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:33:55'),
(357, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:34:40'),
(358, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:52:45'),
(359, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:52:47'),
(360, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:52:52'),
(361, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 08:52:56'),
(362, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:12:22'),
(363, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:22:34'),
(364, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:23:16'),
(365, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:31:26'),
(366, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:31:39'),
(367, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:36:42'),
(368, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:48:04'),
(369, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:52:31'),
(370, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 09:52:53'),
(371, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:07:11'),
(372, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:08:17'),
(373, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:08:20'),
(374, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:14:44'),
(375, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:14:53'),
(376, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:15:00'),
(377, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:15:05'),
(378, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:15:33'),
(379, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:15:38'),
(380, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:15:55'),
(381, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:16:00'),
(382, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:16:05'),
(383, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:16:14'),
(384, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:16:20'),
(385, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:16:26'),
(386, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:17:35'),
(387, 'e33577a8-6ca7-4e9a-b495-46faa5b82d53', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:18:05'),
(388, 'e33577a8-6ca7-4e9a-b495-46faa5b82d53', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:18:14'),
(389, 'c1e822c5-2d4c-4007-97da-45599104061e', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:22:19'),
(390, 'c1e822c5-2d4c-4007-97da-45599104061e', NULL, 'add_to_cart', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:22:28'),
(391, '80fb9483-d88e-4496-8cf4-66387919a9bb', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:22:32'),
(392, 'a074adbb-72b6-45d1-b02e-ea9a5842cba8', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:22:44'),
(393, '45fa0242-e72a-4fd4-931e-352e7753c7c4', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:22:57'),
(394, '45fa0242-e72a-4fd4-931e-352e7753c7c4', NULL, 'add_to_cart', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:06'),
(395, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:09'),
(396, 'ed7306a4-7f59-4e2b-8b28-d6dc27beaf80', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:10'),
(397, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/pendant-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:11'),
(398, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/neckset-earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:14'),
(399, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:16'),
(400, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:18'),
(401, 'ed7306a4-7f59-4e2b-8b28-d6dc27beaf80', NULL, 'add_to_cart', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:19'),
(402, '2b02b5a1-1de8-4f8d-b505-2a3eae640ad3', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:23'),
(403, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:26'),
(404, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:28'),
(405, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/pendants', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:32'),
(406, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/bracelets', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:35'),
(407, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:23:39'),
(408, '2ad17258-e6bb-4dd3-89c8-bfa384be8796', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:24:51'),
(409, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:24:58'),
(410, '2ad17258-e6bb-4dd3-89c8-bfa384be8796', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:01'),
(411, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:04'),
(412, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/neckset-earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:08'),
(413, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/others', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:11'),
(414, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:13'),
(415, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/pendants', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:14'),
(416, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:17'),
(417, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:37'),
(418, 'd690f945-a06c-41c8-bf4c-5788f27b0abf', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:25:59'),
(419, 'd690f945-a06c-41c8-bf4c-5788f27b0abf', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:26:11'),
(420, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:28:48'),
(421, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:28:51'),
(422, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:29:35'),
(423, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:29:40'),
(424, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:29:42'),
(425, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:30:36'),
(426, '2b087cb0-d5b8-440c-bd41-4bca5f8bdb18', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:40:02'),
(427, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:31'),
(428, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:39'),
(429, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:43'),
(430, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:48'),
(431, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:52'),
(432, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:43:55'),
(433, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:47:10'),
(434, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 10:55:33'),
(435, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/neckset-earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:05:17'),
(436, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:05:28'),
(437, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:09:58'),
(438, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:11:57'),
(439, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:12:22'),
(440, '4631d6b7-87a2-4742-8e02-2afe99e1c033', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:12:51'),
(441, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:13:03'),
(442, '10c35d74-5ed0-4ada-b821-6f19568ffcdc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:13:33'),
(443, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:14:54'),
(444, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:03'),
(445, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:05'),
(446, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:22'),
(447, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:39'),
(448, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:48'),
(449, 'edfbf801-304f-4812-8f15-57fe809e1a34', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:51'),
(450, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:15:56'),
(451, '7d5e4073-e00c-417c-bf37-59dba351d72d', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:18:23'),
(452, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:19:49'),
(453, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:20:36'),
(454, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:35:11'),
(455, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:39:25'),
(456, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:40:22'),
(457, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:44:36'),
(458, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:45:32'),
(459, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:46:38'),
(460, 'cbf09df1-eaa7-4a5f-8691-e01c7c4a3d05', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:46:39'),
(461, '63bb3c49-5c53-4f96-969e-9cc5ca749c05', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:47:13'),
(462, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:47:50'),
(463, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:48:58'),
(464, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:49:02'),
(465, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 11:56:25'),
(466, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:03:52'),
(467, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:06:18'),
(468, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:06:26'),
(469, '4195d2e5-1dd2-44be-8e46-c6eb0f4c6e33', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:06:39'),
(470, '4195d2e5-1dd2-44be-8e46-c6eb0f4c6e33', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:06:49'),
(471, '23f555b5-9fd1-41f0-8767-68e9f026b8d2', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:07:30'),
(472, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 12:07:31'),
(473, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 14:17:54'),
(474, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 14:18:05'),
(475, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 14:28:30'),
(476, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:16:10'),
(477, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:16:18'),
(478, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:16:22'),
(479, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:16:55'),
(480, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:17:11'),
(481, '1a019d2f-a2a4-4fea-a11c-88cef7617a27', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:17:20'),
(482, '417935bc-0a9b-4b91-a6fa-b77ccebe58a8', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:17:44'),
(483, '417935bc-0a9b-4b91-a6fa-b77ccebe58a8', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:17:53'),
(484, '417935bc-0a9b-4b91-a6fa-b77ccebe58a8', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:17:56'),
(485, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:19:13'),
(486, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:19:21'),
(487, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:19:24'),
(488, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:19:56'),
(489, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:20:10'),
(490, 'c7dde31d-303e-466e-98c0-0ca9eeca2fd1', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:20:18'),
(491, '2d1bcc45-9781-4846-aa9c-11a608b57775', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:20:48'),
(492, '2d1bcc45-9781-4846-aa9c-11a608b57775', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:20:51'),
(493, 'd1bdbc40-4262-49d6-a99c-36a73bf32236', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:21:23'),
(494, 'd1bdbc40-4262-49d6-a99c-36a73bf32236', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:21:28'),
(495, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:06'),
(496, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:14'),
(497, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:17'),
(498, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'page_view', '/checkout/success/LUM-2026-960314', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:42'),
(499, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:50'),
(500, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:22:58'),
(501, '3366dbfe-6511-48dd-bdfe-87c5ab449557', NULL, 'page_view', '/account/orders/LUM-2026-960314', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:23:03'),
(502, 'fafb8a2a-765a-4b2b-a329-0d9c8b9f5d55', NULL, 'page_view', '/account/orders/LUM-2026-960314/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:25:43'),
(503, 'dab6e6d3-04b5-4a97-b892-4f49057c1e34', NULL, 'page_view', '/account/orders/LUM-2026-960314', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:26:34'),
(504, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:29:41'),
(505, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:29:51'),
(506, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:29:54'),
(507, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:30:00'),
(508, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:30:05'),
(509, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:31:54'),
(510, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:32:00'),
(511, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:33:44'),
(512, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:03'),
(513, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:18'),
(514, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:21'),
(515, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:34'),
(516, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:35'),
(517, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:36'),
(518, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:34:50'),
(519, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:35:00'),
(520, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:17'),
(521, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:26'),
(522, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:31'),
(523, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:36'),
(524, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:41'),
(525, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:46'),
(526, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:52'),
(527, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:48:57'),
(528, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:49:03'),
(529, 'b28a908c-b3f4-482f-8ce7-7b1c4f857c1e', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:49:48'),
(530, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:50:17'),
(531, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-514280', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:51:23'),
(532, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:52:28'),
(533, '4f60f6c9-9717-4f54-ac39-768bee62ebf5', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:57:59'),
(534, '4f60f6c9-9717-4f54-ac39-768bee62ebf5', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:58:08'),
(535, '4f60f6c9-9717-4f54-ac39-768bee62ebf5', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 18:58:10'),
(536, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:04:55'),
(537, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:08:42'),
(538, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:10:02'),
(539, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:10:06'),
(540, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:08'),
(541, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:17'),
(542, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:19'),
(543, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'page_view', '/checkout/success/LUM-2026-951673', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:32'),
(544, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'page_view', '/account/orders/LUM-2026-951673', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:41'),
(545, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'page_view', '/account/orders/LUM-2026-951673/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:50'),
(546, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:12:57'),
(547, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:13:22'),
(548, '89273394-913a-4530-a30b-ffa5521987b0', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:13:53'),
(549, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:14:00'),
(550, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:14:07'),
(551, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:14:13'),
(552, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:14:13'),
(553, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/register', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:14:21'),
(554, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/register', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:18:15'),
(555, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:22:24'),
(556, '1c14968a-ac04-4a93-a22a-a3312b9ff8b9', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:28:27'),
(557, '1c14968a-ac04-4a93-a22a-a3312b9ff8b9', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:28:43'),
(558, '1c14968a-ac04-4a93-a22a-a3312b9ff8b9', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:28:51'),
(559, '1c14968a-ac04-4a93-a22a-a3312b9ff8b9', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:28:54'),
(560, '1c14968a-ac04-4a93-a22a-a3312b9ff8b9', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:28:59'),
(561, 'b0d65324-57e6-44b1-ac25-631c697c6459', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:30:24'),
(562, 'b0d65324-57e6-44b1-ac25-631c697c6459', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:30:39'),
(563, 'b0d65324-57e6-44b1-ac25-631c697c6459', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:30:47'),
(564, 'b0d65324-57e6-44b1-ac25-631c697c6459', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:30:51'),
(565, 'b0d65324-57e6-44b1-ac25-631c697c6459', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:30:55'),
(566, '73ec73a3-75aa-41ce-aa2c-d0c830ac2254', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:31:42'),
(567, '73ec73a3-75aa-41ce-aa2c-d0c830ac2254', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:32:18'),
(568, '73ec73a3-75aa-41ce-aa2c-d0c830ac2254', NULL, 'page_view', '/account/orders/TEST-REPRO-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:32:26'),
(569, '73ec73a3-75aa-41ce-aa2c-d0c830ac2254', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:32:30'),
(570, '73ec73a3-75aa-41ce-aa2c-d0c830ac2254', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:32:36'),
(571, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:36:05'),
(572, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:36:20'),
(573, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:36:25'),
(574, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:36:32'),
(575, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 19:36:37'),
(576, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:16:22'),
(577, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:16:31'),
(578, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:16:41'),
(579, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:17:09'),
(580, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:18:07'),
(581, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:18:12'),
(582, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:18:12'),
(583, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/account/admin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:18:23'),
(584, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:18:45'),
(585, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:19:02'),
(586, 'c2dc22bb-77bd-41b2-88a6-88d0584cfa95', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:08'),
(587, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:08'),
(588, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:09'),
(589, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:09'),
(590, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:09'),
(591, '6438b226-9bb5-401f-8c47-f885a6c41628', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:23:58'),
(592, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:24:02'),
(593, '6438b226-9bb5-401f-8c47-f885a6c41628', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:24:05'),
(594, '6438b226-9bb5-401f-8c47-f885a6c41628', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:24:08'),
(595, 'ff95cd69-4e74-495c-b804-ed2c9f7c7058', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:28:08'),
(596, 'ff95cd69-4e74-495c-b804-ed2c9f7c7058', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:28:16'),
(597, 'ff95cd69-4e74-495c-b804-ed2c9f7c7058', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:28:19'),
(598, '22a05eba-badd-454a-83d6-ed64695fe5b5', NULL, 'product_view', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:31:00'),
(599, '22a05eba-badd-454a-83d6-ed64695fe5b5', NULL, 'add_to_cart', '/products/white-gold-rings', 52, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:31:07'),
(600, '22a05eba-badd-454a-83d6-ed64695fe5b5', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:31:10'),
(601, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:34:15'),
(602, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:36:27'),
(603, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:39:10'),
(604, '8aae4aa8-4edd-48a1-8a02-63b279b847c1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:39:25'),
(605, '8aae4aa8-4edd-48a1-8a02-63b279b847c1', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:39:35'),
(606, '8aae4aa8-4edd-48a1-8a02-63b279b847c1', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:39:44'),
(607, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:40:41'),
(608, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:32'),
(609, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:36'),
(610, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:43'),
(611, 'a1970d3f-9801-4126-8e58-365772a2433c', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:43'),
(612, 'a1970d3f-9801-4126-8e58-365772a2433c', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:49'),
(613, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:52'),
(614, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:41:57'),
(615, 'a1970d3f-9801-4126-8e58-365772a2433c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:42:02'),
(616, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:42:06'),
(617, 'a1970d3f-9801-4126-8e58-365772a2433c', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:42:15'),
(618, 'ae24889b-10be-423d-b788-b92b9ed0bb25', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:44:10'),
(619, 'ae24889b-10be-423d-b788-b92b9ed0bb25', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:44:19'),
(620, 'ae24889b-10be-423d-b788-b92b9ed0bb25', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:44:28'),
(621, 'ae24889b-10be-423d-b788-b92b9ed0bb25', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:44:37'),
(622, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:48:35'),
(623, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:48:47'),
(624, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:48:53'),
(625, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:49:27'),
(626, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:49:32'),
(627, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:50:22'),
(628, '561db69a-97bb-4490-855c-ba41b9fdc51e', NULL, 'page_view', '/account/orders/TEST-TICK-1', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:52:14'),
(629, '8e7d3782-b57f-4f86-a213-cecffdb44f48', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:56:40'),
(630, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:57:29'),
(631, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:57:52'),
(632, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:57:56'),
(633, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:57:58'),
(634, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:02'),
(635, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:04'),
(636, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:06'),
(637, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:07'),
(638, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:13'),
(639, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:16'),
(640, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:19'),
(641, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:24');

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(642, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:27'),
(643, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:45'),
(644, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:58:53'),
(645, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:59:07'),
(646, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/pendant-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:59:21'),
(647, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:59:28'),
(648, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:59:40'),
(649, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 20:59:46'),
(650, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:00:05'),
(651, '7acf0776-c749-47dc-bf91-b890fe48b0eb', NULL, 'page_view', '/account/orders/LUM-2026-767017/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:00:20'),
(652, '44f1099b-18c9-421d-870a-fd5644c99edb', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:03:46'),
(653, 'a70fabcb-3726-44ba-b6aa-3fa4e4de15d1', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:08:41'),
(654, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:12:53'),
(655, '9e945219-27fb-40b2-90c8-8a858da31470', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:14:17'),
(656, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:14:41'),
(657, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:15:18'),
(658, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:27:08'),
(659, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:27:10'),
(660, '812aeb87-d4f0-4627-a6aa-b32de1d90178', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:31:39'),
(661, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:31:40'),
(662, '812aeb87-d4f0-4627-a6aa-b32de1d90178', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:31:49'),
(663, '2db3c963-f30a-4916-9c1d-5c512f365ece', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:32:14'),
(664, '2db3c963-f30a-4916-9c1d-5c512f365ece', NULL, 'add_to_cart', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:32:24'),
(665, '2db3c963-f30a-4916-9c1d-5c512f365ece', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:32:27'),
(666, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:33:49'),
(667, '0ee3549a-20e6-480e-8d97-b33339fe6cc6', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:36:07'),
(668, '0ee3549a-20e6-480e-8d97-b33339fe6cc6', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:36:17'),
(669, '0ee3549a-20e6-480e-8d97-b33339fe6cc6', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:36:22'),
(670, '0ee3549a-20e6-480e-8d97-b33339fe6cc6', NULL, 'page_view', '/campaigns/eid-flash-sale-mrhr4b3r', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:36:51'),
(671, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:38:34'),
(672, '058d9124-45b8-4d9a-9fa5-c5297644b66f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:38:54'),
(673, '058d9124-45b8-4d9a-9fa5-c5297644b66f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:39:03'),
(674, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:39:13'),
(675, '058d9124-45b8-4d9a-9fa5-c5297644b66f', NULL, 'page_view', '/campaigns/eid-flash-sale-mrhr4b3r', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:39:17'),
(676, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:39:40'),
(677, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:41:30'),
(678, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:41:50'),
(679, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:41:53'),
(680, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:42:08'),
(681, '27deea86-5a02-417c-9184-ef16c65f79a5', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:43:59'),
(682, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/campaigns/eid-flash-sale-mrhr4b3r', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:44:19'),
(683, 'aa8b9b42-4d87-4578-a6a5-5b5ef6bca3b4', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:44:27'),
(684, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:44:50'),
(685, '2e23ada3-72f6-4b12-9d04-fd430a77a52f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:46:19'),
(686, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:47:12'),
(687, '1322e4d2-f261-4453-b98e-ce03e03ea53f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:47:48'),
(688, '7f9b7a49-4d70-44b0-b356-630c83dd9f3c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:48:22'),
(689, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:48:57'),
(690, '49932109-4a51-4639-946b-de23144456c2', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:49:43'),
(691, 'ab726e0b-3409-4a6f-aa5a-8113ae159b3a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:50:41'),
(692, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:51:21'),
(693, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:51:35'),
(694, '7883d28f-9491-4ddb-b6ae-850d759c4380', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:51:41'),
(695, '963a5362-68b9-4ffe-86b3-42150a05f5cd', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:52:03'),
(696, '4d6a0374-dcdb-4ad8-9d9e-802f75020145', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:52:39'),
(697, '08efdbbd-c167-48d2-921d-b8ef9f27800d', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:53:36'),
(698, '033c330b-83f1-40ed-9651-607a378b7e9d', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:54:39'),
(699, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:55:27'),
(700, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:55:36'),
(701, 'e2b3ecf3-4d01-4fa9-b196-00aef40e0cd0', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:01'),
(702, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:15'),
(703, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:31'),
(704, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:37'),
(705, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:41'),
(706, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:43'),
(707, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:48'),
(708, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 21:59:57'),
(709, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:00:01'),
(710, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:00:04'),
(711, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:02:02'),
(712, '68e32251-4154-45be-800d-367dfb2c39be', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:02:06'),
(713, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:02:13'),
(714, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:03:30'),
(715, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:04:33'),
(716, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/necklace', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:04:54'),
(717, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:04:58'),
(718, '58ce2f52-ab54-4764-85f3-28f740c17843', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:05:57'),
(719, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:06:34'),
(720, 'a3e55fa8-c540-482f-9fa9-d012d693db18', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:07:49'),
(721, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:07:58'),
(722, 'e0bb14ff-45b1-4433-8a6d-ee218f986159', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:09:19'),
(723, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:13:54'),
(724, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:13:55'),
(725, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:21:32'),
(726, '3b9acd59-f1a2-4c59-aead-ddb62996226d', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:22:25'),
(727, '3b9acd59-f1a2-4c59-aead-ddb62996226d', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:22:39'),
(728, 'd6a635e5-3cc7-4615-8259-8f66ff9144a2', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:23:31'),
(729, '7b677a77-687f-4961-a880-02414e9f8e2b', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:28:59'),
(730, '7b677a77-687f-4961-a880-02414e9f8e2b', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:29:12'),
(731, '7e2dad43-8c5c-42ae-9976-b679271b8c8e', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:29:44'),
(732, '7e2dad43-8c5c-42ae-9976-b679271b8c8e', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:29:57'),
(733, '13fc5efd-1ee9-4893-8d21-e114ded662ea', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:30:21'),
(734, '13fc5efd-1ee9-4893-8d21-e114ded662ea', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:30:34'),
(735, 'ccd34a11-4d88-4eda-9058-144e43a5c7de', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:31:35'),
(736, 'ccd34a11-4d88-4eda-9058-144e43a5c7de', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:31:50'),
(737, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:34:14'),
(738, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:37:47'),
(739, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:38:01'),
(740, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bangles', 65, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:38:11'),
(741, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:38:19'),
(742, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:38:25'),
(743, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:39:41'),
(744, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:39:46'),
(745, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:40:27'),
(746, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:40:35'),
(747, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:40:51'),
(748, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/nose-pins', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:41:04'),
(749, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:41:35'),
(750, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:41:44'),
(751, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:49:16'),
(752, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:50:29'),
(753, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:50:47'),
(754, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:53:53'),
(755, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:54:41'),
(756, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:54:45'),
(757, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 22:55:00'),
(758, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:00:19'),
(759, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:00:24'),
(760, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:00:30'),
(761, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:00:50'),
(762, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:00:59'),
(763, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:02:41'),
(764, '0d9a1529-65a2-49e9-848b-c8b55cdaf0be', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:04:45'),
(765, '0d9a1529-65a2-49e9-848b-c8b55cdaf0be', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:04:54'),
(766, '0d9a1529-65a2-49e9-848b-c8b55cdaf0be', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:05:05'),
(767, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:05:53'),
(768, 'c9bde06d-50fd-4947-9a4e-da85921f0732', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:06:58'),
(769, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:02'),
(770, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:14'),
(771, 'c9bde06d-50fd-4947-9a4e-da85921f0732', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:22'),
(772, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:22'),
(773, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:38'),
(774, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:07:42'),
(775, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/a-bangle-begins-as-a-rod-of-22k-gold-thicker-than-a-pencil', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:08:16'),
(776, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:08:34'),
(777, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:09:31'),
(778, 'ba8642cc-2d49-4056-93f0-eb502a982333', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:27'),
(779, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:32'),
(780, 'ba8642cc-2d49-4056-93f0-eb502a982333', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:36'),
(781, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:41'),
(782, 'ba8642cc-2d49-4056-93f0-eb502a982333', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:41'),
(783, 'ba8642cc-2d49-4056-93f0-eb502a982333', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:45'),
(784, 'ba8642cc-2d49-4056-93f0-eb502a982333', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:10:52'),
(785, '8052c3c6-3232-4bea-b840-8a69377879a6', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:12:21'),
(786, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:12:25'),
(787, '8052c3c6-3232-4bea-b840-8a69377879a6', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:12:29'),
(788, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:13:01'),
(789, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:13:15'),
(790, '8e7e2d81-3da9-4a05-bddf-dc7cbce5dd9f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:13:34'),
(791, '8e7e2d81-3da9-4a05-bddf-dc7cbce5dd9f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:13:42'),
(792, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:13:50'),
(793, '75c35486-acaa-4ada-a896-7ed491ebd3f5', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:14:21'),
(794, '75c35486-acaa-4ada-a896-7ed491ebd3f5', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:14:30'),
(795, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:15:37'),
(796, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:16:08'),
(797, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:16:41'),
(798, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:16:49'),
(799, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:16:51'),
(800, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:17:42'),
(801, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:18:57'),
(802, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:19:17'),
(803, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:20:11'),
(804, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:20:26'),
(805, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:20:45'),
(806, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:16'),
(807, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:26'),
(808, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:32'),
(809, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:35'),
(810, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:38'),
(811, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:46'),
(812, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:54'),
(813, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:55'),
(814, '9c02dde4-ec98-4d5e-b4ca-e3908abecffc', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:21:58'),
(815, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:06'),
(816, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:11'),
(817, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:16'),
(818, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:18'),
(819, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:19'),
(820, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:23'),
(821, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:25'),
(822, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:30'),
(823, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:42'),
(824, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:23:54'),
(825, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:24:03'),
(826, '622a3d1f-b573-4950-bcba-787413e83d88', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:24:14'),
(827, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:24:28'),
(828, '0e53acd3-f196-4a3d-864c-a961d64d306e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:24:49'),
(829, '0e53acd3-f196-4a3d-864c-a961d64d306e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:24:59'),
(830, '99abfade-bb6a-41c3-93cb-46a60b6190f9', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:25:04'),
(831, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:25:57'),
(832, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:26:31'),
(833, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:26:47'),
(834, 'cf44dc57-df26-4ebe-93c8-7da64cea4d3b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:27:50'),
(835, 'cf44dc57-df26-4ebe-93c8-7da64cea4d3b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:28:01'),
(836, '097984e8-0d2b-4c35-97a1-17bd4c079459', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:29:45'),
(837, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:29:58'),
(838, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:30:15'),
(839, 'b252525e-7e61-43ec-95c7-c1800db23bdd', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:30:45'),
(840, 'b252525e-7e61-43ec-95c7-c1800db23bdd', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:31:00'),
(841, 'b252525e-7e61-43ec-95c7-c1800db23bdd', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:31:15'),
(842, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:31:48'),
(843, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:32:27'),
(844, 'e918cc3f-bdba-4ade-80d5-874afe8c1e3e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:32:45'),
(845, 'e918cc3f-bdba-4ade-80d5-874afe8c1e3e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:32:59'),
(846, 'e918cc3f-bdba-4ade-80d5-874afe8c1e3e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:33:14'),
(847, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:33:46'),
(848, '324d2403-5ffb-4586-b30b-b2dc16f6b64b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:33:59'),
(849, '324d2403-5ffb-4586-b30b-b2dc16f6b64b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:34:14'),
(850, '324d2403-5ffb-4586-b30b-b2dc16f6b64b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:34:29'),
(851, '324d2403-5ffb-4586-b30b-b2dc16f6b64b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:34:45'),
(852, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:35:13'),
(853, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:35:31'),
(854, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:35:38'),
(855, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:37:37'),
(856, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:37:52'),
(857, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:37:53'),
(858, '79ff85e2-198d-414b-b1fd-e029e3a718ed', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:37:56'),
(859, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:05'),
(860, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:08'),
(861, '79ff85e2-198d-414b-b1fd-e029e3a718ed', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:10'),
(862, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:19'),
(863, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:20'),
(864, '79ff85e2-198d-414b-b1fd-e029e3a718ed', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:22'),
(865, '79ff85e2-198d-414b-b1fd-e029e3a718ed', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:38:32'),
(866, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:04'),
(867, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:16'),
(868, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:27'),
(869, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:37'),
(870, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:37'),
(871, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:46'),
(872, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:48'),
(873, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:39:58'),
(874, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:08'),
(875, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:18'),
(876, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/boutiques', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:28'),
(877, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:38'),
(878, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/client-services', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:38'),
(879, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:47'),
(880, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:40:59'),
(881, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:03'),
(882, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:09'),
(883, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:19'),
(884, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:29'),
(885, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:39'),
(886, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:48'),
(887, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/boutiques', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:41:58'),
(888, '1391a7db-f35c-4293-a311-cb955b7ffcf5', NULL, 'page_view', '/client-services', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:42:08'),
(889, 'a33d9590-2ef4-44f1-b43b-0c05677081f1', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:44:04'),
(890, 'a33d9590-2ef4-44f1-b43b-0c05677081f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:44:16'),
(891, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:49:49'),
(892, 'c02fcc59-9f02-4725-a4ef-2b2de52877b2', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:50:31'),
(893, 'c02fcc59-9f02-4725-a4ef-2b2de52877b2', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:50:43'),
(894, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:50:49'),
(895, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:50:58'),
(896, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:51:11'),
(897, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:51:14'),
(898, 'ceb04b35-3765-4956-9a36-dace2caf99ae', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:52:38'),
(899, 'ceb04b35-3765-4956-9a36-dace2caf99ae', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-13 23:52:50'),
(900, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:01:56'),
(901, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:02:09'),
(902, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:03:38'),
(903, 'ec757f0d-b3ca-4fb0-b8ca-9520a5beb2a0', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:04:48'),
(904, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:05:29'),
(905, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:05:30'),
(906, '042bdbf9-35ba-45c3-acc4-ec56ec2cb1bc', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:06:45'),
(907, '814205f9-a0e6-40d6-9823-70fa464ad5e7', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:07:18'),
(908, '814205f9-a0e6-40d6-9823-70fa464ad5e7', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:07:29'),
(909, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:09:53'),
(910, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:09:59'),
(911, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:10:04'),
(912, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:10:11'),
(913, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:10:16'),
(914, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:10:20'),
(915, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:40'),
(916, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:43'),
(917, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:44'),
(918, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:45'),
(919, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:45'),
(920, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:45'),
(921, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:46'),
(922, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:46'),
(923, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:46'),
(924, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:47'),
(925, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:47'),
(926, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:11:48'),
(927, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:14:23'),
(928, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:14:44'),
(929, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:14:54'),
(930, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:15:04'),
(931, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:15:14'),
(932, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:15:24'),
(933, 'fd60a49f-cc63-4cc5-8da0-0debbf031d30', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:15:24'),
(934, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:15:55'),
(935, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:14'),
(936, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:24'),
(937, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:34'),
(938, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:40'),
(939, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:45'),
(940, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:54'),
(941, '7dd13438-a90d-4c4e-9149-7863903e43d7', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:16:55'),
(942, 'b29f0f2b-bce5-46a1-bfb3-aabd68d3c757', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:17:42'),
(943, 'b29f0f2b-bce5-46a1-bfb3-aabd68d3c757', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:17:55'),
(944, 'b29f0f2b-bce5-46a1-bfb3-aabd68d3c757', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:18:06'),
(945, 'b29f0f2b-bce5-46a1-bfb3-aabd68d3c757', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:18:06'),
(946, '90fc27cc-9345-4f86-b766-f975b3137d1f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:19:00'),
(947, '90fc27cc-9345-4f86-b766-f975b3137d1f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:19:13'),
(948, '90fc27cc-9345-4f86-b766-f975b3137d1f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:19:25'),
(949, '90fc27cc-9345-4f86-b766-f975b3137d1f', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:19:25'),
(950, 'ec0ec1e0-54f5-4714-b149-62c21c78c4b6', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:20:00'),
(951, 'ec0ec1e0-54f5-4714-b149-62c21c78c4b6', NULL, 'add_to_cart', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:20:11'),
(952, 'ec0ec1e0-54f5-4714-b149-62c21c78c4b6', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:20:12'),
(953, 'ec0ec1e0-54f5-4714-b149-62c21c78c4b6', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:20:24'),
(954, 'b0a92109-fe86-43f0-8ddf-4243149ca854', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:21:36'),
(955, 'b0a92109-fe86-43f0-8ddf-4243149ca854', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:21:44'),
(956, 'b0a92109-fe86-43f0-8ddf-4243149ca854', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:21:57'),
(957, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:22:44'),
(958, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:22:56'),
(959, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:06'),
(960, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:16'),
(961, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:26'),
(962, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:36'),
(963, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:46'),
(964, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/boutiques', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:23:56'),
(965, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/client-services', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:05');

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(966, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:15'),
(967, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:27'),
(968, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:37'),
(969, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:47'),
(970, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:24:57'),
(971, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:25:07'),
(972, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:25:16'),
(973, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/boutiques', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:25:27'),
(974, '574222d6-901c-41df-9b7e-a2b46b00e500', NULL, 'page_view', '/client-services', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:25:36'),
(975, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:27:34'),
(976, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:29:57'),
(977, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:11'),
(978, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:17'),
(979, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:24'),
(980, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:31'),
(981, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:37'),
(982, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:43'),
(983, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:50'),
(984, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:30:55'),
(985, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:31:03'),
(986, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:31:08'),
(987, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:44:56'),
(988, 'cb0ffb69-7834-4037-ab43-d1da04e8b56b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:46:30'),
(989, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:47:02'),
(990, '2e710c50-2bc7-4520-a316-12a8fb1bf717', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:47:52'),
(991, '447b47f1-ae27-4e9a-9e95-8c3af2fea095', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:53:08'),
(992, '447b47f1-ae27-4e9a-9e95-8c3af2fea095', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:53:17'),
(993, '447b47f1-ae27-4e9a-9e95-8c3af2fea095', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:53:27'),
(994, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:53:31'),
(995, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 00:58:54'),
(996, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:00:18'),
(997, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:00:43'),
(998, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:00:55'),
(999, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:02:35'),
(1000, '9d89721f-237e-4841-9526-fc06da38f4b2', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:02:45'),
(1001, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:05:28'),
(1002, 'cab34715-e8ba-4941-a31f-5b930ab0017c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:06:32'),
(1003, 'cab34715-e8ba-4941-a31f-5b930ab0017c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:06:43'),
(1004, 'cab34715-e8ba-4941-a31f-5b930ab0017c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:06:54'),
(1005, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:07:17'),
(1006, '09ae3fa5-dbb2-4c9b-89ac-f2cbdaa0f395', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:10'),
(1007, '09ae3fa5-dbb2-4c9b-89ac-f2cbdaa0f395', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:22'),
(1008, '09ae3fa5-dbb2-4c9b-89ac-f2cbdaa0f395', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:33'),
(1009, '09ae3fa5-dbb2-4c9b-89ac-f2cbdaa0f395', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:44'),
(1010, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:46'),
(1011, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:47'),
(1012, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:50'),
(1013, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:08:52'),
(1014, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:09:03'),
(1015, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:09:09'),
(1016, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-343078/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:09:36'),
(1017, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:11:06'),
(1018, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:11:08'),
(1019, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:11:16'),
(1020, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:14:08'),
(1021, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:24'),
(1022, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:35'),
(1023, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:38'),
(1024, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:39'),
(1025, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:43'),
(1026, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-343078', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:45'),
(1027, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:47'),
(1028, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:50'),
(1029, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:54'),
(1030, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:16:59'),
(1031, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:00'),
(1032, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-767017', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:02'),
(1033, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:13'),
(1034, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:26'),
(1035, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:38'),
(1036, '308fc68f-0125-4f72-abc8-ad6f4e6404f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:17:50'),
(1037, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:19:52'),
(1038, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:20:09'),
(1039, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:22:31'),
(1040, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:22:58'),
(1041, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:23:12'),
(1042, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:23:14'),
(1043, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-203166', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:23:23'),
(1044, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-203166', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:23:28'),
(1045, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-203166/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:23:38'),
(1046, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-203166', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:25:10'),
(1047, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-203166', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:25:18'),
(1048, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:25:23'),
(1049, 'd70b42fb-8d9d-422f-b732-7e935c1a850c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:26:03'),
(1050, 'd70b42fb-8d9d-422f-b732-7e935c1a850c', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:26:14'),
(1051, 'd70b42fb-8d9d-422f-b732-7e935c1a850c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:26:17'),
(1052, 'd70b42fb-8d9d-422f-b732-7e935c1a850c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:26:20'),
(1053, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:27:06'),
(1054, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:27:15'),
(1055, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:27:22'),
(1056, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bracelets', 54, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:27:41'),
(1057, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:27:58'),
(1058, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:28:12'),
(1059, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:28:14'),
(1060, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-502121', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:28:22'),
(1061, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-502121', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 01:28:26'),
(1062, 'af0acb64-1c72-4f4d-b30f-2f6e8baf0cf4', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:14:07'),
(1063, '9f16f2ac-a641-462c-acb9-805ed2e1b772', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:05'),
(1064, '9f16f2ac-a641-462c-acb9-805ed2e1b772', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:13'),
(1065, 'd167cb5d-93cc-4794-b10a-171091d8ec55', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:20'),
(1066, 'd167cb5d-93cc-4794-b10a-171091d8ec55', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:26'),
(1067, 'e5e7ee7f-fc71-417a-b6e9-f6ab149a86bc', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:33'),
(1068, 'e5e7ee7f-fc71-417a-b6e9-f6ab149a86bc', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:21:38'),
(1069, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:37:31'),
(1070, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:38:56'),
(1071, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:39:17'),
(1072, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:39:44'),
(1073, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:47:09'),
(1074, 'f8b50d6e-2240-4c23-a69a-75cdf7f7a56a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:48:05'),
(1075, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:48:14'),
(1076, 'ff059de3-16d6-46dc-a6f0-4d3b1369013c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:48:40'),
(1077, '3fb9f4aa-23d1-4c20-9da6-6644d7b40620', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:49:30'),
(1078, '70b14f5a-df88-475e-b72f-b2b548d8f901', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:49:44'),
(1079, '31e6f5a7-509c-40c1-8398-011adbfb7c6a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 02:49:58'),
(1080, '09a5085a-e035-445c-9356-5a92a611c101', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:08:43'),
(1081, '09a5085a-e035-445c-9356-5a92a611c101', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:08:52'),
(1082, '09a5085a-e035-445c-9356-5a92a611c101', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:09:02'),
(1083, '09a5085a-e035-445c-9356-5a92a611c101', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:09:11'),
(1084, '97a27387-15c5-42bb-8342-340839c37294', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:14:09'),
(1085, '9790964a-eed2-494d-af5a-cac1b1722107', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:16:51'),
(1086, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:18:57'),
(1087, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:11'),
(1088, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:24'),
(1089, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:33'),
(1090, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:39'),
(1091, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:44'),
(1092, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:54'),
(1093, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:19:59'),
(1094, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:20:16'),
(1095, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:21:24'),
(1096, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:23:03'),
(1097, '6a040bd5-d99f-45ef-961d-46c83c79a960', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:28:37'),
(1098, 'bbe64363-b5bd-40f8-a781-6959afad354e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:31:28'),
(1099, '05bfa4a7-2dbf-4f62-9b26-5123cea86cf4', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:34:01'),
(1100, 'ecbb6d4b-873a-4a6e-8f97-9ccf7698723a', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:34:14'),
(1101, 'ecbb6d4b-873a-4a6e-8f97-9ccf7698723a', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:34:20'),
(1102, '3e740c94-2016-4dc5-9770-d445b228d861', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:34:27'),
(1103, '3e740c94-2016-4dc5-9770-d445b228d861', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:34:33'),
(1104, '621a3546-832b-4e2c-834d-ba2c2a54dabf', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:02'),
(1105, '12f1b7f3-bb41-4226-9617-89aa61ae0e32', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:14'),
(1106, 'fac452df-69a7-4a35-9008-45a04686e20d', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:27'),
(1107, 'fac452df-69a7-4a35-9008-45a04686e20d', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:32'),
(1108, '178eba12-1afd-4fe2-8f43-9f2c3eeeba07', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:39'),
(1109, '178eba12-1afd-4fe2-8f43-9f2c3eeeba07', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:35:44'),
(1110, 'b6609f0b-52e4-478e-b899-a46936e930e4', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:57:08'),
(1111, '7efdf650-8cda-4a9d-86d8-378e78e68aca', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 09:59:37'),
(1112, '7efdf650-8cda-4a9d-86d8-378e78e68aca', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:00:03'),
(1113, '7efdf650-8cda-4a9d-86d8-378e78e68aca', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:00:18'),
(1114, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:14'),
(1115, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:28'),
(1116, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:33'),
(1117, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:40'),
(1118, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:44'),
(1119, '294990b3-b386-4c94-9b34-604dc704c42e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:07:51'),
(1120, '294990b3-b386-4c94-9b34-604dc704c42e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:08:17'),
(1121, '294990b3-b386-4c94-9b34-604dc704c42e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:08:31'),
(1122, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:09:04'),
(1123, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:09:47'),
(1124, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:09:57'),
(1125, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:14:41'),
(1126, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:18:35'),
(1127, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:19:16'),
(1128, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:19:32'),
(1129, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:20:58'),
(1130, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:22:11'),
(1131, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:22:23'),
(1132, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:23:25'),
(1133, '8fe8f993-8af1-4fe8-8ec9-b3655ca512fc', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:32:13'),
(1134, '8fe8f993-8af1-4fe8-8ec9-b3655ca512fc', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:32:49'),
(1135, '8fe8f993-8af1-4fe8-8ec9-b3655ca512fc', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:33:08'),
(1136, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:44:59'),
(1137, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:45:16'),
(1138, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:45:20'),
(1139, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:45:25'),
(1140, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:45:29'),
(1141, '4509a988-6ccb-47bd-8b19-cf453869b882', NULL, 'page_view', '/jewelry/diamond/diamond-ring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:45:34'),
(1142, 'b2847441-f3a7-4132-b18c-4f77574d266d', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:59:15'),
(1143, 'b2847441-f3a7-4132-b18c-4f77574d266d', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:59:42'),
(1144, 'b2847441-f3a7-4132-b18c-4f77574d266d', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 10:59:57'),
(1145, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:04:28'),
(1146, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:04:41'),
(1147, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:04:49'),
(1148, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:07:10'),
(1149, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:07:14'),
(1150, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:07:17'),
(1151, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:07:25'),
(1152, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:08:03'),
(1153, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:08:15'),
(1154, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:08:20'),
(1155, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:08:32'),
(1156, 'a7235cbc-201a-4adb-b4e9-b74c012d251f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:20'),
(1157, 'a7235cbc-201a-4adb-b4e9-b74c012d251f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:29'),
(1158, 'a7235cbc-201a-4adb-b4e9-b74c012d251f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:37'),
(1159, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:38'),
(1160, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:42'),
(1161, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:45'),
(1162, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:49'),
(1163, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:09:53'),
(1164, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:10'),
(1165, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:19'),
(1166, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:29'),
(1167, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:38'),
(1168, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:47'),
(1169, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:12:57'),
(1170, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:06'),
(1171, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:15'),
(1172, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:25'),
(1173, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:34'),
(1174, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:45'),
(1175, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:13:54'),
(1176, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:14:03'),
(1177, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:14:12'),
(1178, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:14:22'),
(1179, '74329839-0667-4d86-97c2-4c87a3c97def', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:14:31'),
(1180, '97bab360-88e4-47c7-ab7f-803515ae2ec1', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:16:20'),
(1181, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:21:18'),
(1182, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:22:33'),
(1183, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:22:36'),
(1184, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:22:46'),
(1185, 'c34db61d-32db-4746-b2c1-da5c733a59b4', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:24:10'),
(1186, 'c34db61d-32db-4746-b2c1-da5c733a59b4', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:24:20'),
(1187, 'c34db61d-32db-4746-b2c1-da5c733a59b4', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:24:30'),
(1188, 'c34db61d-32db-4746-b2c1-da5c733a59b4', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:24:37'),
(1189, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:07'),
(1190, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:17'),
(1191, 'e69ced44-db36-4179-83c9-cc2ec3207ed7', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:21'),
(1192, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/necklace', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:29'),
(1193, 'e69ced44-db36-4179-83c9-cc2ec3207ed7', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:32'),
(1194, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:33'),
(1195, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/locket', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:36'),
(1196, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/bracelet', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:41'),
(1197, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:46'),
(1198, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:55'),
(1199, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/nosepin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:25:58'),
(1200, '1f627069-5acb-4f69-84bc-49477126024d', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:27:51'),
(1201, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:14'),
(1202, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:26'),
(1203, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:32'),
(1204, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:37'),
(1205, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:41'),
(1206, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:28:56'),
(1207, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:01'),
(1208, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:06'),
(1209, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:11'),
(1210, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:17'),
(1211, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:31'),
(1212, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:35'),
(1213, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:40'),
(1214, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:29:47'),
(1215, 'd98bdf7a-f15c-48cd-a92d-d4e1124b3aa2', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:31:33'),
(1216, 'd98bdf7a-f15c-48cd-a92d-d4e1124b3aa2', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:31:49'),
(1217, 'd98bdf7a-f15c-48cd-a92d-d4e1124b3aa2', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:32:07'),
(1218, 'bfe6545c-5bc1-4762-ad51-c426afd18905', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:36:32'),
(1219, 'bfe6545c-5bc1-4762-ad51-c426afd18905', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:36:48'),
(1220, 'bfe6545c-5bc1-4762-ad51-c426afd18905', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:37:13'),
(1221, 'a4ed85f9-28c8-4a67-bb0f-8f19335611cd', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:37:50'),
(1222, 'a4ed85f9-28c8-4a67-bb0f-8f19335611cd', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:01'),
(1223, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:13'),
(1224, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:27'),
(1225, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:37'),
(1226, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:42'),
(1227, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:56'),
(1228, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:38:59'),
(1229, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:39:04'),
(1230, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:39:08'),
(1231, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:39:13'),
(1232, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:39:16'),
(1233, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:40:36'),
(1234, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:40:49'),
(1235, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:41:03'),
(1236, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:41:15'),
(1237, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:41:29'),
(1238, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:41:47'),
(1239, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:41:57'),
(1240, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:42:16'),
(1241, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:42:26'),
(1242, '78d7c551-3e6e-4a28-9181-fdac59a7489a', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:42:38'),
(1243, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:23'),
(1244, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:27'),
(1245, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:32'),
(1246, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:40'),
(1247, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:44'),
(1248, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:45:49'),
(1249, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:52:41'),
(1250, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:52:47'),
(1251, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:52:53'),
(1252, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:52:56'),
(1253, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:02'),
(1254, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:07'),
(1255, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:10'),
(1256, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:14'),
(1257, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:18'),
(1258, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:22'),
(1259, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:28'),
(1260, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:31'),
(1261, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:36'),
(1262, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:39'),
(1263, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:43'),
(1264, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:49'),
(1265, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:56'),
(1266, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:53:59'),
(1267, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:54:03'),
(1268, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:54:06'),
(1269, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:54:11'),
(1270, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:55:35'),
(1271, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:55:43'),
(1272, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:55:46'),
(1273, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:56:17'),
(1274, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:56:45'),
(1275, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:56:53'),
(1276, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:17'),
(1277, '8bf448b9-69cd-4e3e-aad9-f701b46bb182', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:21'),
(1278, '8bf448b9-69cd-4e3e-aad9-f701b46bb182', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:31'),
(1279, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:32'),
(1280, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:36'),
(1281, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:40'),
(1282, '8bf448b9-69cd-4e3e-aad9-f701b46bb182', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:57:41'),
(1283, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:58:05'),
(1284, 'd75a5165-9df5-41a8-a047-d919aad249cc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:58:30'),
(1285, 'd75a5165-9df5-41a8-a047-d919aad249cc', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:58:33'),
(1286, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:59:29'),
(1287, '56419cd8-835f-4c25-be53-84e5ca8f87ba', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 11:59:56'),
(1288, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:01'),
(1289, '56419cd8-835f-4c25-be53-84e5ca8f87ba', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:06'),
(1290, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:13'),
(1291, '56419cd8-835f-4c25-be53-84e5ca8f87ba', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:16');

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(1292, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:38'),
(1293, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:48'),
(1294, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:00:56'),
(1295, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:01:05'),
(1296, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:01:19'),
(1297, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:01:35'),
(1298, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:01:55'),
(1299, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/neckset-earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:01:59'),
(1300, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:03'),
(1301, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/ring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:06'),
(1302, '812b2732-03e0-49fd-b3fe-5d185e05d32b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:09'),
(1303, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:10'),
(1304, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/nose-pins', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:14'),
(1305, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/chains', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:18'),
(1306, '812b2732-03e0-49fd-b3fe-5d185e05d32b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:19'),
(1307, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/pendants', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:21'),
(1308, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:24'),
(1309, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/necklace', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:28'),
(1310, '812b2732-03e0-49fd-b3fe-5d185e05d32b', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:29'),
(1311, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/churi', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:30'),
(1312, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:32'),
(1313, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:43'),
(1314, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/jewellery-acc', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:02:51'),
(1315, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:07'),
(1316, '7254acda-65e9-478d-b84e-3b880e5d259e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:22'),
(1317, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:30'),
(1318, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:31'),
(1319, '7254acda-65e9-478d-b84e-3b880e5d259e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:32'),
(1320, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/a-bangle-begins-as-a-rod-of-22k-gold-thicker-than-a-pencil', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:34'),
(1321, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/how-a-22k-bangle-is-drawn-by-hand', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:37'),
(1322, '7254acda-65e9-478d-b84e-3b880e5d259e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:43'),
(1323, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:48'),
(1324, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:03:54'),
(1325, 'a1df694d-a69c-4338-a182-e53b98446966', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:04:38'),
(1326, 'a1df694d-a69c-4338-a182-e53b98446966', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:04:48'),
(1327, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:04:54'),
(1328, 'a1df694d-a69c-4338-a182-e53b98446966', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:04:58'),
(1329, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:05:19'),
(1330, 'bf80cccc-49ba-40eb-97f0-48d32de175cb', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:05:40'),
(1331, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:01'),
(1332, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:04'),
(1333, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/pendant-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:06'),
(1334, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/necklace-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:07'),
(1335, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/coin', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:10'),
(1336, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:12'),
(1337, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:15'),
(1338, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:17'),
(1339, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:19'),
(1340, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:06:29'),
(1341, 'dfc55690-17bd-4b9d-b679-71f0596d67f1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:07:03'),
(1342, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:12:24'),
(1343, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:12:37'),
(1344, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:12:55'),
(1345, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:18:03'),
(1346, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:18:15'),
(1347, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:20:58'),
(1348, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:21:49'),
(1349, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:22:12'),
(1350, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:22:18'),
(1351, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:22:23'),
(1352, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:38:35'),
(1353, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:40:54'),
(1354, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:42:04'),
(1355, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:42:08'),
(1356, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:42:10'),
(1357, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:42:45'),
(1358, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:42:57'),
(1359, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:43:24'),
(1360, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:43:29'),
(1361, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:43:53'),
(1362, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:45:48'),
(1363, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:45:59'),
(1364, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:01'),
(1365, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:08'),
(1366, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:12'),
(1367, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:18'),
(1368, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:26'),
(1369, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:27'),
(1370, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:46:37'),
(1371, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 12:51:48'),
(1372, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:11:43'),
(1373, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:11:45'),
(1374, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/chain', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:11:52'),
(1375, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:11:55'),
(1376, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:11:59'),
(1377, 'e8f6220f-1ea6-46cf-89d5-bb8c0459dec1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:26:56'),
(1378, 'e8f6220f-1ea6-46cf-89d5-bb8c0459dec1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:27:03'),
(1379, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:28:10'),
(1380, '0067a3bf-80a0-4bc0-a462-58e16a09a6ab', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:28:27'),
(1381, '0067a3bf-80a0-4bc0-a462-58e16a09a6ab', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:28:36'),
(1382, '0ffeb548-179a-43f4-b2f9-872695307fd7', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 13:29:03'),
(1383, '897b2a91-2456-40d8-8678-e3cfe8b195a2', NULL, 'page_view', '/products/test', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:02:06'),
(1384, 'd074760a-4d33-4497-b6d6-81bfc8411432', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:02:06'),
(1385, 'da40c862-6dcc-4192-8f4c-1f4e12375d77', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:04:25'),
(1386, 'da40c862-6dcc-4192-8f4c-1f4e12375d77', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:04:29'),
(1387, 'da40c862-6dcc-4192-8f4c-1f4e12375d77', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:04:32'),
(1388, 'da40c862-6dcc-4192-8f4c-1f4e12375d77', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:04:36'),
(1389, 'da40c862-6dcc-4192-8f4c-1f4e12375d77', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:04:40'),
(1390, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:31'),
(1391, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:38'),
(1392, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:42'),
(1393, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:44'),
(1394, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:46'),
(1395, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:48'),
(1396, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:50'),
(1397, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:51'),
(1398, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:53'),
(1399, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:54'),
(1400, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:57'),
(1401, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:35:59'),
(1402, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:01'),
(1403, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:03'),
(1404, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:05'),
(1405, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:07'),
(1406, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:08'),
(1407, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:10'),
(1408, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:11'),
(1409, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:13'),
(1410, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:37'),
(1411, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:41'),
(1412, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:42'),
(1413, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:44'),
(1414, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:45'),
(1415, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:51'),
(1416, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:52'),
(1417, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:56'),
(1418, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bangles', 65, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:36:57'),
(1419, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:37:51'),
(1420, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:37:57'),
(1421, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:07'),
(1422, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:11'),
(1423, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:14'),
(1424, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:16'),
(1425, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:23'),
(1426, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:26'),
(1427, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:28'),
(1428, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:33'),
(1429, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:35'),
(1430, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/jewelry-sets', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:38:38'),
(1431, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:39:56'),
(1432, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/bracelets', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:39:58'),
(1433, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/chains', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:40:00'),
(1434, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/jewelry-sets', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:40:02'),
(1435, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:40:05'),
(1436, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:49:30'),
(1437, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:49:34'),
(1438, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/pendants', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:49:37'),
(1439, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:51:17'),
(1440, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:14'),
(1441, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:17'),
(1442, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:21'),
(1443, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/categories', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:25'),
(1444, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/jewelry', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:29'),
(1445, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/cart', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:33'),
(1446, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:36'),
(1447, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:40'),
(1448, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/journal', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:44'),
(1449, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/boutiques', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:48'),
(1450, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:52'),
(1451, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/account/register', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:56'),
(1452, 'a1a04eef-7851-4ffd-85d2-08f804bdfe37', NULL, 'page_view', '/client-services', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:56:59'),
(1453, '8caebb77-e700-4c7f-bd26-0dd8694d72b9', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 14:58:44'),
(1454, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:06:39'),
(1455, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:28:59'),
(1456, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:29:11'),
(1457, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:33:32'),
(1458, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:33:38'),
(1459, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:33:58'),
(1460, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:34:22'),
(1461, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:34:40'),
(1462, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:34:53'),
(1463, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:36:51'),
(1464, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:37:05'),
(1465, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:38:15'),
(1466, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:39:56'),
(1467, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:40:28'),
(1468, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:41:52'),
(1469, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/neckset-earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:42:00'),
(1470, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/silver', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:42:36'),
(1471, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:42:41'),
(1472, 'e242b930-140f-4adb-9193-f37c9f0ce07e', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:43:32'),
(1473, 'e242b930-140f-4adb-9193-f37c9f0ce07e', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:43:36'),
(1474, 'e242b930-140f-4adb-9193-f37c9f0ce07e', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:43:39'),
(1475, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bangles', 65, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:44:21'),
(1476, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:44:38'),
(1477, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:48:18'),
(1478, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:48:29'),
(1479, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:48:34'),
(1480, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:51:08'),
(1481, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:56:12'),
(1482, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:56:12'),
(1483, '1ca2feb9-93b9-45bc-b515-7499e3fcfdb7', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:59:41'),
(1484, '1ca2feb9-93b9-45bc-b515-7499e3fcfdb7', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:59:45'),
(1485, '1ca2feb9-93b9-45bc-b515-7499e3fcfdb7', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:59:49'),
(1486, '1ca2feb9-93b9-45bc-b515-7499e3fcfdb7', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 15:59:53'),
(1487, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:01:07'),
(1488, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:01:10'),
(1489, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:16'),
(1490, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond/earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:20'),
(1491, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamon-earrings', 56, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:22'),
(1492, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:26'),
(1493, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:27'),
(1494, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:02:30'),
(1495, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:24:57'),
(1496, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:00'),
(1497, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:02'),
(1498, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:05'),
(1499, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:08'),
(1500, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:11'),
(1501, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:14'),
(1502, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:16'),
(1503, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:19'),
(1504, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:22'),
(1505, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:25'),
(1506, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:28'),
(1507, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:30'),
(1508, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:33'),
(1509, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:36'),
(1510, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:39'),
(1511, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:42'),
(1512, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:44'),
(1513, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:47'),
(1514, 'd45fe9d3-5c37-41dd-812e-3fac6994bf15', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:25:50'),
(1515, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:16'),
(1516, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:20'),
(1517, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:23'),
(1518, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:26'),
(1519, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:29'),
(1520, '67a75087-7756-43e9-84a3-03092ea5d9e2', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:29:32'),
(1521, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:33'),
(1522, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:35'),
(1523, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:36'),
(1524, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:39'),
(1525, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:40'),
(1526, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:42'),
(1527, '7de917a6-e89b-4c47-a038-d1d7f4a6bc9c', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:30:45'),
(1528, '78661e05-4232-4a06-be9b-0295c0e1673f', NULL, 'product_view', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:33:21'),
(1529, '78661e05-4232-4a06-be9b-0295c0e1673f', NULL, 'add_to_cart', '/products/gold-ring', 45, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:33:24'),
(1530, '30e5d1dc-dccd-4b6f-adac-91f749bfed61', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:34:51'),
(1531, '30e5d1dc-dccd-4b6f-adac-91f749bfed61', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:34:54'),
(1532, '30e5d1dc-dccd-4b6f-adac-91f749bfed61', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:34:57'),
(1533, '850af3df-723a-48dc-8fa4-fa1bc7cef1fe', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:35:28'),
(1534, '850af3df-723a-48dc-8fa4-fa1bc7cef1fe', NULL, 'add_to_cart', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:35:31'),
(1535, '850af3df-723a-48dc-8fa4-fa1bc7cef1fe', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:35:32'),
(1536, '7b56fe24-fd0d-4123-86c6-fd6d4326d8a5', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:39:00'),
(1537, '810e0b39-65ad-4d6c-b0d1-d030234504f4', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:39:37'),
(1538, '1d26d825-32fd-4e66-9131-302dcffaa62c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:47:23'),
(1539, '1d26d825-32fd-4e66-9131-302dcffaa62c', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:47:29'),
(1540, '1d26d825-32fd-4e66-9131-302dcffaa62c', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:47:33'),
(1541, '1d26d825-32fd-4e66-9131-302dcffaa62c', NULL, 'add_to_cart', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:47:36'),
(1542, '1d26d825-32fd-4e66-9131-302dcffaa62c', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:47:38'),
(1543, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:16'),
(1544, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:21'),
(1545, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:23'),
(1546, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:33'),
(1547, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:35'),
(1548, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/necklace', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:44'),
(1549, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-necklace', 67, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:49:46'),
(1550, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:53:19'),
(1551, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:53:54'),
(1552, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:55:09'),
(1553, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:55:19'),
(1554, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:56:30'),
(1555, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:57:43'),
(1556, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:58:53'),
(1557, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:58:55'),
(1558, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:58:59'),
(1559, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:59:27'),
(1560, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/journal/a-bangle-begins-as-a-rod-of-22k-gold-thicker-than-a-pencil', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:59:33'),
(1561, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:59:53'),
(1562, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 16:59:59'),
(1563, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:00:04'),
(1564, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:00:11'),
(1565, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:00:15'),
(1566, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:00:24'),
(1567, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:01:07'),
(1568, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:01:28'),
(1569, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:01:36'),
(1570, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:02:32'),
(1571, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:02:34'),
(1572, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:02:38'),
(1573, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:02:44'),
(1574, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-751325', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:05:51'),
(1575, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-751325', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:05:57'),
(1576, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-751325/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:06:58'),
(1577, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-751325', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:09:03'),
(1578, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:09:54'),
(1579, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:09:55'),
(1580, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:09:58'),
(1581, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:01'),
(1582, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:03'),
(1583, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:06'),
(1584, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:08'),
(1585, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:11'),
(1586, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/sitahar', 47, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:15'),
(1587, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:20'),
(1588, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:23'),
(1589, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:27'),
(1590, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:28'),
(1591, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:33'),
(1592, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/bangles', 48, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:42'),
(1593, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:47'),
(1594, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:10:59'),
(1595, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:04'),
(1596, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:06'),
(1597, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-chain', 68, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:19'),
(1598, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:22'),
(1599, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/diamond', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:27'),
(1600, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-bangles', 65, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:28'),
(1601, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/diamond-bangles', 65, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:32'),
(1602, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:11:58'),
(1603, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/LUM-2026-123435', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:12:03'),
(1604, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-123435', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:12:09'),
(1605, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-123435/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:12:11');

INSERT INTO `analytics_events` (`id`, `session_id`, `user_id`, `event`, `path`, `product_id`, `value`, `currency`, `order_id`, `label`, `referrer_source`, `referrer_host`, `country`, `created_at`) VALUES
(1606, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/LUM-2026-123435', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:16:14'),
(1607, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:23:00'),
(1608, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/full-bridal-set', 69, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:23:18'),
(1609, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:40:58'),
(1610, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:41:07'),
(1611, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 17:41:15'),
(1684, '8e811116-b152-40cb-a231-97c70af84eea', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 20:36:25'),
(1685, '58cb0163-80ee-439d-be05-a2dc470b36a3', NULL, 'web_vital', '/', NULL, 73.70, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-14 20:36:25'),
(1686, '58cb0163-80ee-439d-be05-a2dc470b36a3', NULL, 'web_vital', '/', NULL, 596.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-14 20:36:26'),
(1688, '58cb0163-80ee-439d-be05-a2dc470b36a3', NULL, 'web_vital', '/', NULL, 596.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-14 20:36:42'),
(1689, '58cb0163-80ee-439d-be05-a2dc470b36a3', NULL, 'web_vital', '/', NULL, 0.05, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-14 20:36:42'),
(1690, 'c6d59bdd-ccd0-44ba-9832-78b3a7bab51f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 20:37:19'),
(1691, '3e0bfa65-3415-46f7-9f91-3c87216aa303', NULL, 'web_vital', '/', NULL, 34.30, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-14 20:37:19'),
(1692, '3e0bfa65-3415-46f7-9f91-3c87216aa303', NULL, 'web_vital', '/', NULL, 236.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-14 20:37:19'),
(1693, '3e0bfa65-3415-46f7-9f91-3c87216aa303', NULL, 'web_vital', '/', NULL, 236.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-14 20:37:25'),
(1695, '3e0bfa65-3415-46f7-9f91-3c87216aa303', NULL, 'web_vital', '/', NULL, 0.61, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-14 20:37:32'),
(1696, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 163.10, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-14 21:33:56'),
(1697, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:33:56'),
(1698, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 7415.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-14 21:33:56'),
(1699, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 9292.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-14 21:33:56'),
(1700, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:02'),
(1701, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/necklace', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:07'),
(1702, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/jewelry/platinum/pendant-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:11'),
(1703, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:18'),
(1704, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/diamond-nosepin', 66, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:34'),
(1705, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-14 21:34:46'),
(1706, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 304.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-14 21:35:30'),
(1707, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 08:38:45'),
(1708, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 08:38:45'),
(1709, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 1760.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 08:38:45'),
(1710, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 1424.60, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 08:38:45'),
(1711, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 12.40, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-15 08:38:48'),
(1712, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/categories/necklaces', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 08:38:49'),
(1713, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 08:38:51'),
(1714, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 08:38:56'),
(1715, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 08:39:01'),
(1716, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 64.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 08:40:36'),
(1717, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 08:40:36'),
(1718, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'product_view', '/products/chain', 50, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:25'),
(1719, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'add_to_cart', '/products/chain', 50, NULL, NULL, NULL, 'LUM-0005', 'direct', NULL, NULL, '2026-07-15 09:08:27'),
(1720, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'begin_checkout', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:30'),
(1721, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:30'),
(1722, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'begin_checkout', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:30'),
(1723, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'purchase', '/checkout', NULL, 10650.00, 'BDT', 183, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:31'),
(1724, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/checkout/success/:orderNo', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:32'),
(1725, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/:orderNo', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:34'),
(1726, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/:orderNo/invoice', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:08:42'),
(1727, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/account/orders/:orderNo/invoice', NULL, 80.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 09:13:36'),
(1728, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/account/orders/:orderNo', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:15:17'),
(1729, '682bac8b-050a-4c16-8db0-c7196e2b489c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:23:53'),
(1730, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 0.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:23:53'),
(1731, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 116.70, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:23:54'),
(1732, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 116.70, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-15 09:24:07'),
(1733, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 1.10, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-15 09:24:07'),
(1734, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:24:07'),
(1735, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:24:24'),
(1736, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 64.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 09:24:24'),
(1737, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:25:31'),
(1738, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 133.90, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:25:31'),
(1739, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 388.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:25:31'),
(1740, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:25:36'),
(1741, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:26:00'),
(1742, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 79.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:26:00'),
(1743, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 268.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:26:00'),
(1744, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:26:01'),
(1745, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/gold-ring-2', 63, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:26:01'),
(1746, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 75.10, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:26:01'),
(1747, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 236.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:26:01'),
(1748, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/products/gold-ring-2', 63, 1.00, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-15 09:26:06'),
(1749, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:26:17'),
(1750, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 80.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 09:26:37'),
(1751, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:26:37'),
(1752, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/diamond-ring', 55, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:27:34'),
(1753, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/jewelry/diamond/mens', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:28:56'),
(1754, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/jewelry/platinum/pendant-set', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:16'),
(1755, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/jewelry/diamond/earring', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:25'),
(1756, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:35'),
(1757, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/jewelry/gold', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:44'),
(1758, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/wishlist', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:50'),
(1759, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:29:54'),
(1760, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:30:16'),
(1761, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/account', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:30:16'),
(1762, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account', NULL, 85.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:30:16'),
(1763, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account', NULL, 208.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:30:16'),
(1764, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:30:16'),
(1765, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/account/login', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:30:17'),
(1766, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account/login', NULL, 56.50, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 09:30:17'),
(1767, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account/login', NULL, 476.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 09:30:17'),
(1768, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account/login', NULL, 512.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-15 09:30:21'),
(1769, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account/login', NULL, 13.80, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-15 09:30:21'),
(1770, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:30:21'),
(1771, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/categories/earrings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:30:46'),
(1772, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/earrings', NULL, 64.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 09:30:53'),
(1773, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/earrings', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:30:53'),
(1774, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'select_item', '/categories/earrings', NULL, NULL, NULL, NULL, 'LUM-0002', 'direct', NULL, NULL, '2026-07-15 09:30:59'),
(1775, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'product_view', '/products/earring', 46, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:30:59'),
(1776, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'add_to_cart', '/products/earring', 46, NULL, NULL, NULL, 'LUM-0002', 'direct', NULL, NULL, '2026-07-15 09:31:03'),
(1777, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'begin_checkout', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:06'),
(1778, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:06'),
(1779, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'begin_checkout', '/checkout', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:06'),
(1780, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'purchase', '/checkout', NULL, 21150.00, 'BDT', 184, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:23'),
(1781, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/checkout/success/:orderNo', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:23'),
(1782, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/account/orders/:orderNo', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:31:25'),
(1783, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/account/orders/:orderNo', NULL, 96.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 09:31:28'),
(1784, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 09:32:02'),
(1785, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 09:35:27'),
(1786, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'page_view', '/categories/rings', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 10:30:05'),
(1787, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 769.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 10:30:05'),
(1788, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 1464.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 10:30:05'),
(1789, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 3.60, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-15 10:30:11'),
(1790, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 10:32:50'),
(1791, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 8.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 10:32:50'),
(1792, '96624dc3-efd9-4a71-949d-358741290935', NULL, 'web_vital', '/categories/rings', NULL, 2316.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-15 10:32:50'),
(1793, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-15 10:35:21'),
(1794, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-15 10:35:21'),
(1795, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 133.50, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-15 10:35:21'),
(1796, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 133.50, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-15 10:35:21'),
(1797, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-15 10:35:21'),
(1798, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-15 10:35:25'),
(1799, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 1252.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 08:03:21'),
(1800, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 672.50, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 08:03:21'),
(1801, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 08:03:21'),
(1802, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 1252.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 08:03:31'),
(1803, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.09, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 08:03:31'),
(1804, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 08:14:42'),
(1805, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 2156.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 08:14:43'),
(1806, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 1575.30, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 08:14:43'),
(1807, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 2372.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 08:40:56'),
(1808, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 08:40:56'),
(1809, 'c8791ecc-aabb-486f-b312-dc7289a23862', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 08:59:20'),
(1810, 'bc6eda61-fd5b-48b8-9ae9-c2d176655908', NULL, 'web_vital', '/shop', NULL, 311.50, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 08:59:20'),
(1811, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 564.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 08:59:20'),
(1812, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 844.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:01:37'),
(1813, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 13.20, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-16 09:01:37'),
(1814, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 80.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-16 09:13:55'),
(1815, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 0.32, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:13:55'),
(1816, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:13:55'),
(1817, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 170.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:13:55'),
(1818, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 420.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:13:55'),
(1819, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 652.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:13:59'),
(1820, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 12.30, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-16 09:13:59'),
(1821, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 80.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-16 09:14:11'),
(1822, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:14:11'),
(1823, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:14:11'),
(1824, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 80.40, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:14:11'),
(1825, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 296.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:14:11'),
(1826, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 28928.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:14:52'),
(1827, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 0.02, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:14:52'),
(1828, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:14:52'),
(1829, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 90.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:14:52'),
(1830, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 340.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:14:52'),
(1831, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 2892.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:15:21'),
(1832, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:15:21'),
(1833, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:15:22'),
(1834, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 520.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:15:22'),
(1835, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 171.20, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:15:22'),
(1836, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 0.00, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:15:30'),
(1837, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/shop', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:16:07'),
(1838, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 51.30, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:16:07'),
(1839, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 228.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:16:07'),
(1840, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 512.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:16:34'),
(1841, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/shop', NULL, 12.00, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-16 09:16:34'),
(1842, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:17:26'),
(1843, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:18:57'),
(1844, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 668.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:18:57'),
(1845, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 103.70, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:18:57'),
(1846, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 668.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:19:01'),
(1847, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.01, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:19:01'),
(1848, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:19:02'),
(1849, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 244.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:19:02'),
(1850, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 59.90, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:19:02'),
(1851, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 260.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:19:09'),
(1852, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.02, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:19:09'),
(1853, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:19:10'),
(1854, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 316.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:19:10'),
(1855, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 98.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:19:10'),
(1856, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 400.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:19:21'),
(1857, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 0.64, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:19:21'),
(1858, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 09:19:22'),
(1859, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 244.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 09:19:22'),
(1860, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 88.90, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 09:19:22'),
(1861, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 244.00, NULL, NULL, 'LCP', 'direct', NULL, NULL, '2026-07-16 09:19:27'),
(1862, 'c5a9caad-d79f-42ba-9cf5-f8a4ecb0017f', NULL, 'web_vital', '/', NULL, 12.30, NULL, NULL, 'FID', 'direct', NULL, NULL, '2026-07-16 09:19:27'),
(1863, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/', NULL, 0.05, NULL, NULL, 'CLS', 'direct', NULL, NULL, '2026-07-16 09:34:32'),
(1864, '87af085d-7100-4e99-b2ad-c0ef82282994', NULL, 'web_vital', '/', NULL, 96.00, NULL, NULL, 'INP', 'direct', NULL, NULL, '2026-07-16 09:34:32'),
(1865, '71c83ea7-5994-4702-9a9c-7173dae65b62', NULL, 'web_vital', '/', NULL, 68.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:46:31'),
(1866, 'a9d10be2-c548-473a-a8bb-8882218b3428', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:46:31'),
(1867, 'a9d10be2-c548-473a-a8bb-8882218b3428', NULL, 'web_vital', '/', NULL, 1168.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:46:32'),
(1868, 'd577642f-f4f0-494c-99f8-c1da0d2c7c84', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:46:48'),
(1869, 'dbd1973e-c2f6-4a5e-85bc-99aebd28b2a9', NULL, 'web_vital', '/', NULL, 38.10, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:46:48'),
(1870, 'd577642f-f4f0-494c-99f8-c1da0d2c7c84', NULL, 'web_vital', '/', NULL, 232.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:46:48'),
(1871, '7b37ba4b-ff2b-467a-b96e-9e43dfcfe325', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:47:42'),
(1872, '6228971f-4603-44ce-8c0b-6a14d12e9304', NULL, 'web_vital', '/', NULL, 52.10, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:47:42'),
(1873, 'bd82e307-f9b1-4979-85ec-d4cb3bb82fd7', NULL, 'web_vital', '/', NULL, 276.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:47:42'),
(1874, '8fc73940-f65e-42a5-8530-6233fad5433d', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:47:51'),
(1875, '4b5871c0-d441-4f21-a9c7-bbaf09e0580d', NULL, 'web_vital', '/', NULL, 208.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:47:52'),
(1876, 'acfd1870-a855-42b4-80f4-f26bf1c2a9c5', NULL, 'web_vital', '/', NULL, 47.00, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:47:52'),
(1877, '8a05bd6c-269b-4dfc-ac6d-4abdc2a6be17', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:48:38'),
(1878, '3a97c809-cdb7-4841-949e-35dd6e3e415e', NULL, 'web_vital', '/', NULL, 248.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:48:38'),
(1879, '0d3b3118-8bf9-4d33-a6ff-07c3dac4e837', NULL, 'web_vital', '/', NULL, 56.50, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:48:38'),
(1880, 'd2f0658a-545d-43c4-a74a-e44544278149', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:48:47'),
(1881, '69d50c2f-0afb-40a1-9ccd-20b9bcb23b27', NULL, 'web_vital', '/', NULL, 200.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:48:47'),
(1882, '149c54de-d838-44d6-b8b3-d577ed6f99bc', NULL, 'web_vital', '/', NULL, 45.10, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:48:47'),
(1883, 'f4781b53-232c-4c1f-afb6-30199bd417b9', NULL, 'web_vital', '/', NULL, 3181.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:51:27'),
(1884, '5e7eb73a-4fb6-4568-9fd9-f4608e4dcc4c', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:51:27'),
(1885, '6b2cb57c-c449-4866-814d-88a0db4d8cba', NULL, 'web_vital', '/', NULL, 3844.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:51:27'),
(1886, 'd6cfb077-26bc-4f30-a680-ef29a571d4a1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:51:37'),
(1887, '8f0dd342-50da-4400-acaa-2ff3dd66d7eb', NULL, 'web_vital', '/', NULL, 288.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:51:37'),
(1888, '26c5bb81-d2dc-44d3-8ae5-e39f13361159', NULL, 'web_vital', '/', NULL, 66.40, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:51:37'),
(1889, '3a4ffb91-24ad-4ae4-99c0-c0d30fa8de0a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:52:26'),
(1890, 'e334df86-fe27-4783-83a7-7ba4ddd3c94f', NULL, 'web_vital', '/', NULL, 48.10, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:52:26'),
(1891, '343e05b5-f88c-4f2d-9459-8b72a0b27a17', NULL, 'web_vital', '/', NULL, 292.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:52:26'),
(1892, '90def985-5be4-4410-a002-e327609d01b1', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:52:36'),
(1893, '0c3c97ec-6fde-424d-b71f-87682ab9b080', NULL, 'web_vital', '/', NULL, 43.30, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:52:36'),
(1894, '90def985-5be4-4410-a002-e327609d01b1', NULL, 'web_vital', '/', NULL, 212.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:52:36'),
(1895, '5a88f26b-9890-478b-bab3-94b78c3395b8', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:52:45'),
(1896, '0fee71d9-2388-44e9-a0aa-de37b74a4c54', NULL, 'web_vital', '/', NULL, 61.20, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:52:45'),
(1897, '0fee71d9-2388-44e9-a0aa-de37b74a4c54', NULL, 'web_vital', '/', NULL, 260.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:52:45'),
(1898, '62c52521-9d84-4030-ad65-22a3066fd99f', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:52:55'),
(1899, '99dfafe7-9225-4278-8a43-e5c308fb5b5b', NULL, 'web_vital', '/', NULL, 40.40, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:52:55'),
(1900, '99dfafe7-9225-4278-8a43-e5c308fb5b5b', NULL, 'web_vital', '/', NULL, 236.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:52:55'),
(1901, '5b7c51f7-7999-4dc3-8ff9-91a96992f6da', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:53:05'),
(1902, 'd2553a53-948c-417e-ad91-c6f9b4227d7b', NULL, 'web_vital', '/', NULL, 45.70, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:53:05'),
(1903, 'd2553a53-948c-417e-ad91-c6f9b4227d7b', NULL, 'web_vital', '/', NULL, 240.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:53:05'),
(1904, 'e91ee636-c4c4-4468-a709-a220d2410de7', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:53:22'),
(1905, '7e2e5a3b-edab-4211-9ea4-43663afec036', NULL, 'web_vital', '/', NULL, 40.90, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:53:22'),
(1906, 'e91ee636-c4c4-4468-a709-a220d2410de7', NULL, 'web_vital', '/', NULL, 224.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:53:22'),
(1907, '95bebb14-4f75-49da-aecd-37bce644f206', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:53:32'),
(1908, '88cd63b2-b848-45a3-b3df-e7044519ccfb', NULL, 'web_vital', '/', NULL, 51.40, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:53:32'),
(1909, '3008eb87-db7b-485c-8d03-ed6a7009cbd0', NULL, 'web_vital', '/', NULL, 244.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:53:32'),
(1910, '98a2ec3b-cf19-45ff-a069-63c838260211', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:53:42'),
(1911, '38b0ce70-c7e8-474b-b00f-94c0119e448d', NULL, 'web_vital', '/', NULL, 72.30, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:53:42'),
(1912, 'b5c4dd9f-f4c7-452b-95c8-d09bfb54f575', NULL, 'web_vital', '/', NULL, 344.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:53:42'),
(1913, '9e190942-31e7-42e4-a606-5e83122b807a', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:53:52'),
(1914, 'c8bc75a1-477a-4b20-bf6f-9fbfe653f5b4', NULL, 'web_vital', '/', NULL, 56.80, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:53:52'),
(1915, 'c8bc75a1-477a-4b20-bf6f-9fbfe653f5b4', NULL, 'web_vital', '/', NULL, 272.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:53:52'),
(1916, 'dbd2409d-0333-4bf0-a59c-1690ac536c47', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:54:01'),
(1917, 'd4dd4f75-0f5b-4e80-9639-0aa59e125a77', NULL, 'web_vital', '/', NULL, 64.60, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:54:01'),
(1918, '9350f7c8-7605-4915-9738-d493579f98f8', NULL, 'web_vital', '/', NULL, 348.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:54:01'),
(1919, 'e5de5547-7020-4960-8321-479a5c9e7c17', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:57:44'),
(1920, 'd4e181cc-b4b8-4405-9165-cea6a3e5f78a', NULL, 'web_vital', '/', NULL, 86.90, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:57:44'),
(1921, 'd4e181cc-b4b8-4405-9165-cea6a3e5f78a', NULL, 'web_vital', '/', NULL, 332.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:57:44'),
(1922, '3066c3c7-4028-4f23-b6ac-65f16f60e0f6', NULL, 'page_view', '/', NULL, NULL, NULL, NULL, NULL, 'direct', NULL, NULL, '2026-07-16 16:58:07'),
(1923, 'a976b86e-0185-4963-a658-96b241052d08', NULL, 'web_vital', '/', NULL, 45.50, NULL, NULL, 'TTFB', 'direct', NULL, NULL, '2026-07-16 16:58:07'),
(1924, '3066c3c7-4028-4f23-b6ac-65f16f60e0f6', NULL, 'web_vital', '/', NULL, 236.00, NULL, NULL, 'FCP', 'direct', NULL, NULL, '2026-07-16 16:58:07');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `kind` enum('appointment','bespoke') NOT NULL DEFAULT 'appointment',
  `name` varchar(120) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `boutique_id` smallint(5) UNSIGNED DEFAULT NULL,
  `preferred_at` datetime DEFAULT NULL,
  `message` varchar(1000) DEFAULT NULL,
  `status` enum('new','contacted','scheduled','completed','cancelled') NOT NULL DEFAULT 'new',
  `internal_note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `code` varchar(80) NOT NULL,
  `input_type` enum('select','text','number') NOT NULL DEFAULT 'select',
  `is_variant_level` tinyint(1) NOT NULL DEFAULT 1,
  `is_filterable` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`id`, `name`, `code`, `input_type`, `is_variant_level`, `is_filterable`, `sort_order`) VALUES
(1, 'Ring Size', 'ring_size', 'select', 1, 1, 1),
(2, 'Length', 'chain_length', 'select', 1, 1, 2),
(3, 'Bangle Size', 'bangle_size', 'select', 1, 1, 3),
(4, 'Stone Count', 'stone_count', 'select', 1, 1, 4),
(5, 'Nose Pin Type', 'nose_pin_type', 'select', 1, 1, 5),
(6, 'Earring Closure', 'earring_closure', 'select', 1, 1, 6),
(7, 'Height', 'height', 'text', 0, 0, 7),
(8, 'Width', 'width', 'text', 0, 0, 8),
(9, 'Thickness', 'thickness', 'text', 0, 0, 9),
(10, 'Pin Length', 'pin_length', 'text', 0, 0, 10),
(11, 'Gauge', 'gauge', 'text', 0, 0, 11);

-- --------------------------------------------------------

--
-- Table structure for table `attribute_values`
--

CREATE TABLE `attribute_values` (
  `id` int(10) UNSIGNED NOT NULL,
  `attribute_id` smallint(5) UNSIGNED NOT NULL,
  `value` varchar(120) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute_values`
--

INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`) VALUES
(1, 1, '5', 1),
(2, 1, '6', 2),
(3, 1, '7', 3),
(4, 1, '8', 4),
(5, 1, '9', 5),
(6, 2, '16 inch', 1),
(7, 2, '18 inch', 2),
(8, 2, '20 inch', 3),
(9, 2, '22 inch', 4),
(10, 3, '2.4', 1),
(11, 3, '2.6', 2),
(12, 3, '2.8', 3),
(13, 4, '1', 1),
(14, 4, '3', 2),
(15, 4, '5', 3),
(16, 4, '7', 4),
(17, 4, '13', 5),
(18, 4, '25', 6),
(19, 5, 'Screw', 1),
(20, 5, 'Wire', 2),
(21, 6, 'Push Back', 1),
(22, 6, 'Screw Back', 2),
(23, 6, 'Hook', 3),
(28, 10, '7 mm', 3),
(29, 10, '8 mm', 4),
(30, 9, '3 mm', 1),
(31, 8, '8 mm', 1),
(32, 7, '12 mm', 1),
(33, 11, '22G', 1);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_user_id` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(60) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_values` text DEFAULT NULL,
  `new_values` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `admin_user_id`, `action`, `entity_type`, `entity_id`, `old_values`, `new_values`, `ip_address`, `created_at`) VALUES
(1, NULL, 'review.moderate', 'review', 1, '{\"status\":\"pending\"}', '{\"status\":\"approved\"}', NULL, '2026-07-13 18:49:37'),
(2, NULL, 'review.moderate', 'review', 2, '{\"status\":\"pending\"}', '{\"status\":\"approved\"}', NULL, '2026-07-13 19:13:30'),
(3, NULL, 'admin.login_failed', 'admin', NULL, NULL, NULL, '::1', '2026-07-14 16:57:58'),
(4, NULL, 'admin.login', 'admin', NULL, NULL, NULL, '::1', '2026-07-14 16:58:05'),
(5, NULL, 'review.moderate', 'review', 3, '{\"status\":\"pending\"}', '{\"status\":\"approved\"}', NULL, '2026-07-14 16:58:40'),
(6, NULL, 'order.status', 'order', 179, '{\"status\":\"pending\"}', '{\"status\":\"crafting\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-14 17:06:42'),
(7, NULL, 'order.status', 'order', 179, '{\"status\":\"crafting\"}', '{\"status\":\"diamond_setting\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-14 17:06:52'),
(8, NULL, 'order.status', 'order', 179, '{\"status\":\"diamond_setting\"}', '{\"status\":\"out_for_delivery\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-14 17:09:16'),
(9, NULL, 'order.status', 'order', 179, '{\"status\":\"out_for_delivery\"}', '{\"status\":\"refunded\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-14 17:09:34'),
(10, NULL, 'order.status', 'order', 180, '{\"status\":\"pending\"}', '{\"status\":\"confirmed\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-14 17:16:09'),
(11, NULL, 'admin.login', 'admin', NULL, NULL, NULL, '::1', '2026-07-15 08:39:22'),
(12, NULL, 'rate.publish', 'metal_rate', 1, NULL, '{\"purityId\":1,\"ratePerGram\":300000}', '::1', '2026-07-15 09:20:20'),
(13, NULL, 'order.status', 'order', 184, '{\"status\":\"pending\"}', '{\"status\":\"confirmed\",\"note\":\"changed from admin panel\"}', '::1', '2026-07-15 09:31:44'),
(14, NULL, 'admin.login', 'admin', NULL, NULL, NULL, '::1', '2026-07-16 08:06:53'),
(15, NULL, 'admin.login', 'admin', NULL, NULL, NULL, '::1', '2026-07-16 08:41:03');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(10) UNSIGNED NOT NULL,
  `position` varchar(60) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `excerpt` varchar(500) DEFAULT NULL,
  `read_minutes` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `tag` varchar(40) DEFAULT NULL,
  `body` mediumtext DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `read_minutes`, `tag`, `body`, `cover_image`, `author_id`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'How a 22K bangle is drawn by hand', 'how-a-22k-bangle-is-drawn-by-hand', 'Gold is drawn, not cast — and the difference is in the wrist.', 1, 'Craft', 'A bangle begins as a rod of 22K gold, thicker than a pencil.\n\nIt is drawn through a die again and again, each pass narrowing it by a fraction, until the wire will take a curve without cracking. A cast bangle can be made in an afternoon. A drawn one takes three days, and it is the drawn one that survives a lifetime of being pushed over a wrist.\n\nOur senior artisan has drawn the same gauge for thirty years. He can hear when the metal is about to tire.', '/uploads/journal/545b0241d7e0.jpg', NULL, 'published', '2026-07-14 03:35:58', '2026-07-13 21:35:58', '2026-07-13 23:05:45'),
(2, 'A bangle begins as a rod of 22K gold, thicker than a pencil.', 'a-bangle-begins-as-a-rod-of-22k-gold-thicker-than-a-pencil', 'A bangle begins as a rod of 22K gold, thicker than a pencil. It is drawn through a die again and again, each pass narrowing it by a fraction, until the wire will take a curve witho…', 1, 'Gold', 'A bangle begins as a rod of 22K gold, thicker than a pencil.\n\nIt is drawn through a die again and again, each pass narrowing it by a fraction, until the wire will take a curve without cracking. A cast bangle can be made in an afternoon. A drawn one takes three days, and it is the drawn one that survives a lifetime of being pushed over a wrist.\n\nOur senior artisan has drawn the same gauge for thirty years. He can hear when the metal is about to tire.', '/uploads/journal/c2ec5b92ebd2.jpg', NULL, 'published', '2026-07-14 05:06:55', '2026-07-13 23:06:55', '2026-07-13 23:06:55');

-- --------------------------------------------------------

--
-- Table structure for table `blog_comments`
--

CREATE TABLE `blog_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `blog_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `body` varchar(2000) NOT NULL,
  `status` enum('visible','hidden') NOT NULL DEFAULT 'visible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `section` enum('home_top','home_middle','home_bottom') NOT NULL DEFAULT 'home_middle',
  `is_home_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `title`, `slug`, `description`, `start_at`, `end_at`, `section`, `is_home_featured`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Eid Flash Sale', 'eid-flash-sale-mrhr4b3r', NULL, '2026-07-13 02:00:00', '2026-07-25 23:59:00', 'home_middle', 1, 1, '2026-07-12 12:10:08', '2026-07-13 21:42:24');

-- --------------------------------------------------------

--
-- Table structure for table `campaign_products`
--

CREATE TABLE `campaign_products` (
  `campaign_id` int(10) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaign_products`
--

INSERT INTO `campaign_products` (`campaign_id`, `product_id`, `sort_order`) VALUES
(1, 50, 0),
(1, 56, 1),
(1, 65, 2),
(1, 68, 3);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `status` enum('active','converted','abandoned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL,
  `engraving` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_active`, `created_at`) VALUES
(1, NULL, 'Rings', 'rings', '/uploads/categories/rings.jpg?v=1783939617127', NULL, 1, 1, '2026-07-09 10:50:33'),
(2, NULL, 'Earrings', 'earrings', '/uploads/categories/earrings.jpg?v=1783939626729', NULL, 2, 1, '2026-07-09 10:50:33'),
(3, NULL, 'Necklaces', 'necklaces', '/uploads/categories/necklaces.jpg?v=1783984334126', NULL, 3, 1, '2026-07-09 10:50:33'),
(4, NULL, 'Pendants', 'pendants', NULL, NULL, 4, 1, '2026-07-09 10:50:33'),
(5, NULL, 'Bracelets', 'bracelets', '/uploads/categories/bracelets.jpg?v=1783941179168', NULL, 5, 1, '2026-07-09 10:50:33'),
(6, NULL, 'Bangles', 'bangles', '/uploads/categories/bangles.jpg?v=1783984373142', NULL, 6, 1, '2026-07-09 10:50:33'),
(7, NULL, 'Chains', 'chains', '/uploads/categories/chains.jpg?v=1783941138723', NULL, 7, 1, '2026-07-09 10:50:33'),
(8, NULL, 'Lockets', 'lockets', NULL, NULL, 8, 1, '2026-07-09 10:50:33'),
(9, NULL, 'Nose Pins', 'nose-pins', '/uploads/categories/nose-pins.jpg?v=1783941089516', NULL, 9, 1, '2026-07-09 10:50:33'),
(10, NULL, 'Bridal Sets', 'bridal-sets', '/uploads/categories/bridal-sets.jpg?v=1783941067015', NULL, 10, 1, '2026-07-09 10:50:33'),
(11, NULL, 'Traditional Jewellery', 'traditional-jewellery', NULL, NULL, 11, 1, '2026-07-09 10:50:33'),
(15, NULL, 'Sitahar', 'sitahar', '/uploads/categories/sitahar.jpg?v=1783939603001', NULL, 0, 1, '2026-07-12 13:32:52');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `certificate_no` varchar(80) NOT NULL,
  `issuer` enum('GIA','IGI','HRD','SGL','AGS','Other') NOT NULL DEFAULT 'Other',
  `pdf_path` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `issued_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` date DEFAULT NULL,
  `ends_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `name`, `slug`, `image`, `description`, `sort_order`, `is_featured`, `is_active`, `starts_at`, `ends_at`, `created_at`) VALUES
(1, 'Royal Heritage', 'royal-heritage', NULL, NULL, 1, 0, 1, NULL, NULL, '2026-07-09 10:50:33'),
(2, 'Classic', 'classic', NULL, NULL, 2, 0, 1, NULL, NULL, '2026-07-09 10:50:33'),
(3, 'Minimal', 'minimal', NULL, NULL, 3, 0, 1, NULL, NULL, '2026-07-09 10:50:33'),
(4, 'Wedding', 'wedding', NULL, NULL, 4, 0, 1, NULL, NULL, '2026-07-09 10:50:33'),
(5, 'Luxury', 'luxury', NULL, NULL, 5, 0, 1, NULL, NULL, '2026-07-09 10:50:33'),
(6, 'Limited Edition', 'limited-edition', NULL, NULL, 6, 0, 1, NULL, NULL, '2026-07-09 10:50:33');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(40) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(12,2) NOT NULL,
  `min_order` decimal(12,2) NOT NULL DEFAULT 0.00,
  `max_discount` decimal(12,2) DEFAULT NULL,
  `usage_limit` int(10) UNSIGNED DEFAULT NULL,
  `used_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `per_user_limit` int(10) UNSIGNED DEFAULT NULL,
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `min_order`, `max_discount`, `usage_limit`, `used_count`, `per_user_limit`, `starts_at`, `expires_at`, `is_active`, `created_at`) VALUES
(1, 'EID40', 'percent', 40.00, 50000.00, NULL, 200, 138, NULL, NULL, '2026-07-30 12:07:42', 1, '2026-07-10 06:07:42'),
(2, 'FLAT1000', 'fixed', 1000.00, 20000.00, NULL, 500, 212, NULL, NULL, '2026-08-24 12:07:42', 1, '2026-07-10 06:07:42'),
(3, 'NEWLUM', 'percent', 15.00, 0.00, NULL, 1000, 64, NULL, NULL, '2026-10-08 12:07:42', 1, '2026-07-10 06:07:42'),
(4, 'FESTIVE25', 'percent', 25.00, 80000.00, NULL, 150, 150, NULL, NULL, '2026-07-07 12:07:42', 1, '2026-07-10 06:07:42');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(300) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(80) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`id`, `name`) VALUES
(3, 'Kids'),
(2, 'Men'),
(4, 'Unisex'),
(1, 'Women');

-- --------------------------------------------------------

--
-- Table structure for table `home_media`
--

CREATE TABLE `home_media` (
  `id` int(10) UNSIGNED NOT NULL,
  `section` varchar(32) NOT NULL COMMENT 'collections | craft | heritage',
  `image` varchar(255) NOT NULL,
  `image_phone` varchar(255) DEFAULT NULL,
  `width` smallint(5) UNSIGNED DEFAULT NULL,
  `height` smallint(5) UNSIGNED DEFAULT NULL,
  `alt` varchar(160) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `home_media`
--

INSERT INTO `home_media` (`id`, `section`, `image`, `image_phone`, `width`, `height`, `alt`, `sort_order`, `created_at`) VALUES
(10, 'craft', '/uploads/home/craft-5fcd6d6c7c.jpg', NULL, 900, 1125, 'Savoir-Faire — ChatGPT Image Jul 13, 2026, 05_39_10 PM', 1, '2026-07-13 11:39:21'),
(11, 'heritage', '/uploads/home/heritage-1a976b05fa.jpg', NULL, 900, 1125, 'Heritage — ChatGPT Image Jul 13, 2026, 05_40_10 PM', 1, '2026-07-13 11:40:19'),
(12, 'craft', '/uploads/home/craft-434ade10d7.jpg', NULL, 1050, 1400, 'Savoir-Faire — ChatGPT Image Jul 13, 2026, 05_45_05 PM', 2, '2026-07-13 11:45:27'),
(15, 'collections', '/uploads/home/collections-3b879d67f1.jpg', NULL, 816, 1450, 'The Collections — ChatGPT Image Jul 14, 2026, 04_30_54 AM', 1, '2026-07-13 22:31:36'),
(16, 'collections', '/uploads/home/collections-b1e1269fa2.jpg', NULL, 816, 1450, 'The Collections — ChatGPT Image Jul 14, 2026, 04_31_49 AM', 2, '2026-07-13 22:31:54'),
(17, 'collections', '/uploads/home/collections-6747a6ed15.jpg', NULL, 816, 1450, 'The Collections — ChatGPT Image Jul 14, 2026, 04_41_20 AM', 3, '2026-07-13 22:41:27'),
(22, 'craft', '/uploads/home/craft-91e729f94b.jpg', NULL, 1050, 1400, 'Savoir-Faire — ChatGPT Image Jul 14, 2026, 06_53_05 AM', 3, '2026-07-14 00:53:14'),
(25, 'hero', '/uploads/home/hero-407c246f6b.jpg', '/uploads/home/hero-407c246f6b-phone.jpg', 1672, 940, 'Landing page — ChatGPT Image Jul 14, 2026, 06_59_54 AM', 1, '2026-07-14 01:00:07'),
(26, 'editorial', '/uploads/home/editorial-591ad58135.jpg', '/uploads/home/editorial-591ad58135-phone.jpg', 1122, 1402, 'The Editorial — ChatGPT Image Jul 8, 2026 at 01_52_40 AM', 1, '2026-07-14 01:05:21');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `warehouse_id` smallint(5) UNSIGNED NOT NULL,
  `quantity_available` int(11) NOT NULL DEFAULT 0,
  `quantity_reserved` int(11) NOT NULL DEFAULT 0,
  `reorder_level` int(11) NOT NULL DEFAULT 0,
  `availability` enum('in_stock','made_to_order','ready_to_ship','out_of_stock') NOT NULL DEFAULT 'in_stock',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`variant_id`, `warehouse_id`, `quantity_available`, `quantity_reserved`, `reorder_level`, `availability`, `updated_at`) VALUES
(43, 1, 10, 0, 0, 'in_stock', '2026-07-12 15:08:08'),
(44, 1, 0, 0, 0, 'in_stock', '2026-07-15 09:31:23'),
(45, 1, 1, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(46, 1, 38, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(48, 1, 4, 0, 0, 'in_stock', '2026-07-15 09:08:31'),
(55, 1, 9, 0, 0, 'in_stock', '2026-07-13 11:17:41'),
(56, 1, 9, 0, 0, 'in_stock', '2026-07-12 18:50:44'),
(57, 1, 10, 0, 0, 'in_stock', '2026-07-13 19:14:26'),
(58, 1, 10, 0, 0, 'in_stock', '2026-07-12 18:50:44'),
(59, 1, 10, 0, 0, 'in_stock', '2026-07-12 18:50:44'),
(60, 1, 0, 0, 0, 'in_stock', '2026-07-12 18:57:18'),
(61, 1, 0, 0, 0, 'in_stock', '2026-07-12 18:57:18'),
(62, 1, 5, 0, 0, 'in_stock', '2026-07-14 14:36:15'),
(63, 1, 11, 0, 0, 'in_stock', '2026-07-12 19:28:18'),
(64, 1, 10, 0, 0, 'in_stock', '2026-07-13 11:15:22'),
(65, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(66, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(67, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(68, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(69, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(70, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(71, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(72, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(73, 1, 10, 0, 0, 'in_stock', '2026-07-12 19:33:59'),
(74, 1, 0, 0, 0, 'in_stock', '2026-07-12 19:46:31'),
(77, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(78, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(79, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(80, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(81, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(82, 1, 0, 0, 0, 'in_stock', '2026-07-13 08:17:39'),
(87, 1, 10, 0, 0, 'in_stock', '2026-07-14 16:40:06'),
(88, 1, 7, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(89, 1, 10, 0, 0, 'in_stock', '2026-07-13 09:31:21'),
(90, 1, 10, 0, 0, 'in_stock', '2026-07-13 09:31:21'),
(92, 1, 9, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(93, 1, 10, 0, 0, 'in_stock', '2026-07-13 11:56:22'),
(94, 1, 0, 0, 0, 'in_stock', '2026-07-13 11:56:22'),
(95, 1, 0, 0, 0, 'in_stock', '2026-07-13 11:56:22'),
(96, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:13:38'),
(97, 1, 11, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(98, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(99, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(100, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(101, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(102, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(103, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(104, 1, 12, 0, 0, 'in_stock', '2026-07-14 01:28:34'),
(105, 1, 12, 0, 0, 'in_stock', '2026-07-13 22:20:26'),
(106, 1, 49, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(107, 1, 50, 0, 0, 'in_stock', '2026-07-14 17:09:34'),
(108, 1, 117, 0, 0, 'in_stock', '2026-07-14 17:12:03'),
(109, 1, 120, 0, 0, 'in_stock', '2026-07-13 22:53:46'),
(110, 1, 120, 0, 0, 'in_stock', '2026-07-13 22:53:46');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_movements`
--

CREATE TABLE `inventory_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `warehouse_id` smallint(5) UNSIGNED NOT NULL,
  `movement_type` enum('purchase','sale','return','damage','transfer_in','transfer_out','reservation','release','adjustment','production') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_type` varchar(40) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory_movements`
--

INSERT INTO `inventory_movements` (`id`, `variant_id`, `warehouse_id`, `movement_type`, `quantity`, `reference_type`, `reference_id`, `note`, `created_by`, `created_at`) VALUES
(4, 88, 1, 'sale', -1, 'order', 162, 'LUM-2026-514280', NULL, '2026-07-13 18:31:54'),
(8, 45, 1, 'sale', -1, 'order', 168, 'LUM-2026-767017', NULL, '2026-07-13 20:49:27'),
(9, 108, 1, 'sale', -1, 'order', 170, 'LUM-2026-343078', NULL, '2026-07-14 01:09:03'),
(10, 88, 1, 'sale', -1, 'order', 171, 'LUM-2026-203166', NULL, '2026-07-14 01:23:23'),
(11, 104, 1, 'sale', -1, 'order', 172, 'LUM-2026-502121', NULL, '2026-07-14 01:28:22'),
(12, 104, 1, 'return', 1, 'order', 172, 'order cancelled', NULL, '2026-07-14 01:28:34'),
(13, 108, 1, 'sale', -1, 'order', 173, 'LUM-2026-393312', NULL, '2026-07-14 11:59:53'),
(14, 62, 1, 'sale', -1, 'order', 176, 'ITEST-B-321109', NULL, '2026-07-14 14:28:41'),
(15, 107, 1, 'sale', -1, 'order', 179, 'LUM-2026-751325', NULL, '2026-07-14 17:05:51'),
(16, 107, 1, 'return', 1, 'order', 179, 'status → refunded', NULL, '2026-07-14 17:09:34'),
(17, 106, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(18, 46, 1, 'sale', -2, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(19, 108, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(20, 45, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(21, 88, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(22, 97, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(23, 92, 1, 'sale', -1, 'order', 180, 'LUM-2026-123435', NULL, '2026-07-14 17:12:03'),
(24, 48, 1, 'sale', -1, 'order', 183, 'LUM-2026-511911', NULL, '2026-07-15 09:08:31'),
(25, 44, 1, 'adjustment', 1, 'admin', NULL, 'manual stock edit', NULL, '2026-07-15 09:25:11'),
(26, 44, 1, 'sale', -1, 'order', 184, 'LUM-2026-883021', NULL, '2026-07-15 09:31:23');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_reservations`
--

CREATE TABLE `inventory_reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `warehouse_id` smallint(5) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cart_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','fulfilled','released','expired') NOT NULL DEFAULT 'active',
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory_reservations`
--

INSERT INTO `inventory_reservations` (`id`, `variant_id`, `warehouse_id`, `quantity`, `order_id`, `cart_id`, `status`, `expires_at`, `created_at`) VALUES
(4, 64, 1, 1, 157, NULL, 'expired', '2026-07-13 16:30:42', '2026-07-13 10:15:42'),
(5, 87, 1, 1, 158, NULL, 'expired', '2026-07-13 16:44:28', '2026-07-13 10:29:28');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `code` varchar(80) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `code`, `is_active`) VALUES
(1, 'Primary Navigation', 'primary', 1),
(2, 'Gold Mega Menu', 'gold_mega', 1),
(3, 'Diamond Mega Menu', 'diamond_mega', 1),
(4, 'Mobile Menu', 'mobile', 1),
(5, 'Footer Menu', 'footer', 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `menu_id` smallint(5) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `label` varchar(120) NOT NULL,
  `url` varchar(500) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `menu_id`, `parent_id`, `label`, `url`, `image`, `sort_order`, `is_active`) VALUES
(1, 1, NULL, 'New Arrivals', '/shop?sort=new', NULL, 1, 1),
(2, 1, NULL, 'Gold', '/shop?material=Gold', NULL, 2, 1),
(3, 1, NULL, 'Diamond', '/shop?material=Diamond', NULL, 3, 1),
(4, 1, NULL, 'Bridal', '/shop?occasion=Wedding,Engagement', NULL, 4, 1),
(5, 1, NULL, 'Collections', '/shop?collection=Luxury', NULL, 5, 1),
(6, 1, NULL, 'Gifts', '/shop?occasion=Anniversary,Festival', NULL, 6, 1),
(7, 1, NULL, 'About', '/#craft', NULL, 7, 1),
(8, 1, NULL, 'Contact', '/#appointment', NULL, 8, 1),
(9, 2, NULL, 'Shop by Category', '#', NULL, 1, 1),
(10, 2, NULL, 'Shop by Purity', '#', NULL, 2, 1),
(11, 2, NULL, 'Shop by Gold Color', '#', NULL, 3, 1),
(12, 2, NULL, 'Shop by Recipient', '#', NULL, 4, 1),
(13, 2, NULL, 'Shop by Occasion', '#', NULL, 5, 1),
(14, 2, NULL, 'Shop by Price', '#', NULL, 6, 1),
(15, 2, 9, 'Rings', '/shop?material=Gold&type=Ring', NULL, 1, 1),
(16, 2, 9, 'Earrings', '/shop?material=Gold&type=Earring', NULL, 2, 1),
(17, 2, 9, 'Necklaces', '/shop?material=Gold&type=Necklace', NULL, 3, 1),
(18, 2, 9, 'Pendants', '/shop?material=Gold&type=Pendant', NULL, 4, 1),
(19, 2, 9, 'Bracelets', '/shop?material=Gold&type=Bracelet', NULL, 5, 1),
(20, 2, 9, 'Bangles', '/shop?material=Gold&type=Bangle', NULL, 6, 1),
(21, 2, 9, 'Chains', '/shop?material=Gold&type=Chain', NULL, 7, 1),
(22, 2, 9, 'Lockets', '/shop?material=Gold&type=Locket', NULL, 8, 1),
(23, 2, 9, 'Nose Pins', '/shop?material=Gold&type=Nose+Pin', NULL, 9, 1),
(24, 2, 9, 'Bridal Sets', '/shop?material=Gold&occasion=Wedding', NULL, 10, 1),
(25, 2, 9, 'Traditional Jewellery', '/shop?material=Gold&style=Polki,Vintage', NULL, 11, 1),
(26, 2, 10, '24K', '/shop?material=Gold&purity=24K', NULL, 1, 1),
(27, 2, 10, '22K', '/shop?material=Gold&purity=22K', NULL, 2, 1),
(28, 2, 10, '21K', '/shop?material=Gold&purity=21K', NULL, 3, 1),
(29, 2, 10, '18K', '/shop?material=Gold&purity=18K', NULL, 4, 1),
(30, 2, 10, '14K', '/shop?material=Gold&purity=14K', NULL, 5, 1),
(31, 2, 11, 'Yellow Gold', '/shop?material=Gold&color=Yellow+Gold', NULL, 1, 1),
(32, 2, 11, 'White Gold', '/shop?material=Gold&color=White+Gold', NULL, 2, 1),
(33, 2, 11, 'Rose Gold', '/shop?material=Gold&color=Rose+Gold', NULL, 3, 1),
(34, 2, 12, 'Women', '/shop?material=Gold&gender=Women', NULL, 1, 1),
(35, 2, 12, 'Men', '/shop?material=Gold&gender=Men', NULL, 2, 1),
(36, 2, 12, 'Kids', '/shop?material=Gold&gender=Kids', NULL, 3, 1),
(37, 2, 13, 'Wedding', '/shop?material=Gold&occasion=Wedding', NULL, 1, 1),
(38, 2, 13, 'Engagement', '/shop?material=Gold&occasion=Engagement', NULL, 2, 1),
(39, 2, 13, 'Anniversary', '/shop?material=Gold&occasion=Anniversary', NULL, 3, 1),
(40, 2, 13, 'Festival', '/shop?material=Gold&occasion=Festival', NULL, 4, 1),
(41, 2, 14, 'Under ৳50,000', '/shop?material=Gold&price=under-50k', NULL, 1, 1),
(42, 2, 14, '৳50K – ৳100K', '/shop?material=Gold&price=50k-100k', NULL, 2, 1),
(43, 2, 14, '৳100K – ৳250K', '/shop?material=Gold&price=100k-250k', NULL, 3, 1),
(44, 2, 14, '৳250K+', '/shop?material=Gold&price=250k-plus', NULL, 4, 1),
(46, 3, NULL, 'Shop by Category', '#', NULL, 1, 1),
(47, 3, NULL, 'Shop by Diamond Style', '#', NULL, 2, 1),
(48, 3, NULL, 'Shop by Recipient', '#', NULL, 3, 1),
(49, 3, NULL, 'Shop by Price', '#', NULL, 4, 1),
(50, 3, NULL, 'Shop by Collection', '#', NULL, 5, 1),
(51, 3, 46, 'Rings', '/shop?material=Diamond&type=Ring', NULL, 1, 1),
(52, 3, 46, 'Necklaces', '/shop?material=Diamond&type=Necklace', NULL, 2, 1),
(53, 3, 46, 'Bracelets', '/shop?material=Diamond&type=Bracelet', NULL, 3, 1),
(54, 3, 46, 'Earrings', '/shop?material=Diamond&type=Earring', NULL, 4, 1),
(55, 3, 46, 'Pendants', '/shop?material=Diamond&type=Pendant', NULL, 5, 1),
(56, 3, 46, 'Bangles', '/shop?material=Diamond&type=Bangle', NULL, 6, 1),
(57, 3, 46, 'Lockets', '/shop?material=Diamond&type=Locket', NULL, 7, 1),
(58, 3, 46, 'Chains', '/shop?material=Diamond&type=Chain', NULL, 8, 1),
(59, 3, 46, 'Nose Pins', '/shop?material=Diamond&type=Nose+Pin', NULL, 9, 1),
(60, 3, 47, 'Solitaire', '/shop?material=Diamond&style=Solitaire', NULL, 1, 1),
(61, 3, 47, 'Halo', '/shop?material=Diamond&style=Halo', NULL, 2, 1),
(62, 3, 47, 'Cocktail', '/shop?material=Diamond&style=Cocktail', NULL, 3, 1),
(63, 3, 47, 'Color Stone', '/shop?material=Diamond&style=Color+Stone', NULL, 4, 1),
(64, 3, 47, 'Designer', '/shop?material=Diamond&style=Designer', NULL, 5, 1),
(65, 3, 47, 'Polki', '/shop?material=Diamond&style=Polki', NULL, 6, 1),
(66, 3, 48, 'Women', '/shop?material=Diamond&gender=Women', NULL, 1, 1),
(67, 3, 48, 'Men', '/shop?material=Diamond&gender=Men', NULL, 2, 1),
(68, 3, 48, 'Kids', '/shop?material=Diamond&gender=Kids', NULL, 3, 1),
(69, 3, 49, 'Under ৳100K', '/shop?material=Diamond&price=under-50k,50k-100k', NULL, 1, 1),
(70, 3, 49, '৳100K – ৳250K', '/shop?material=Diamond&price=100k-250k', NULL, 2, 1),
(71, 3, 49, '৳250K+', '/shop?material=Diamond&price=250k-plus', NULL, 3, 1),
(72, 3, 50, 'Royal Heritage', '/shop?collection=Royal+Heritage', NULL, 1, 1),
(73, 3, 50, 'Luxury', '/shop?collection=Luxury', NULL, 2, 1),
(74, 3, 50, 'Wedding', '/shop?collection=Wedding', NULL, 3, 1),
(75, 3, 50, 'Minimal', '/shop?collection=Minimal', NULL, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `metals`
--

CREATE TABLE `metals` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `metals`
--

INSERT INTO `metals` (`id`, `name`) VALUES
(1, 'Gold'),
(2, 'Platinum'),
(3, 'Silver');

-- --------------------------------------------------------

--
-- Table structure for table `metal_colors`
--

CREATE TABLE `metal_colors` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `metal_colors`
--

INSERT INTO `metal_colors` (`id`, `name`) VALUES
(3, 'Rose Gold'),
(2, 'White Gold'),
(1, 'Yellow Gold');

-- --------------------------------------------------------

--
-- Table structure for table `metal_purities`
--

CREATE TABLE `metal_purities` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `metal_id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `purity_percent` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `metal_purities`
--

INSERT INTO `metal_purities` (`id`, `metal_id`, `name`, `purity_percent`) VALUES
(1, 1, '24K', 99.99),
(2, 1, '22K', 91.60),
(3, 1, '21K', 87.50),
(4, 1, '18K', 75.00),
(5, 1, '14K', 58.30),
(6, 2, 'PT950', 95.00),
(7, 3, 'S925', 92.50);

-- --------------------------------------------------------

--
-- Table structure for table `metal_rates`
--

CREATE TABLE `metal_rates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purity_id` smallint(5) UNSIGNED NOT NULL,
  `rate_per_gram` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `effective_from` datetime NOT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `metal_rates`
--

INSERT INTO `metal_rates` (`id`, `purity_id`, `rate_per_gram`, `currency`, `effective_from`, `created_by`, `created_at`) VALUES
(1, 1, 11500.00, 'BDT', '2026-07-09 16:50:33', NULL, '2026-07-09 10:50:33'),
(2, 2, 10550.00, 'BDT', '2026-07-09 16:50:33', NULL, '2026-07-09 10:50:33'),
(3, 3, 10050.00, 'BDT', '2026-07-09 16:50:33', NULL, '2026-07-09 10:50:33'),
(4, 4, 8650.00, 'BDT', '2026-07-09 16:50:33', NULL, '2026-07-09 10:50:33'),
(5, 5, 6700.00, 'BDT', '2026-07-09 16:50:33', NULL, '2026-07-09 10:50:33'),
(6, 2, 10725.50, 'BDT', '2026-07-09 17:19:37', NULL, '2026-07-09 11:19:37'),
(7, 1, 10000.00, 'BDT', '2026-07-09 21:54:00', NULL, '2026-07-09 15:54:00'),
(8, 1, 12000.00, 'BDT', '2026-07-09 21:54:19', NULL, '2026-07-09 15:54:19'),
(9, 1, 13000.00, 'BDT', '2026-07-09 21:54:54', NULL, '2026-07-09 15:54:54'),
(12, 1, 200000.00, 'BDT', '2026-07-14 05:37:28', NULL, '2026-07-13 23:37:28'),
(15, 1, 300000.00, 'BDT', '2026-07-15 15:20:20', NULL, '2026-07-15 09:20:20');

-- --------------------------------------------------------

--
-- Table structure for table `occasions`
--

CREATE TABLE `occasions` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `occasions`
--

INSERT INTO `occasions` (`id`, `name`, `slug`) VALUES
(1, 'Wedding', 'wedding'),
(2, 'Engagement', 'engagement'),
(3, 'Anniversary', 'anniversary'),
(4, 'Birthday', 'birthday'),
(5, 'Festival', 'festival'),
(6, 'Daily Wear', 'daily-wear');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_no` varchar(30) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('reserved','pending','confirmed','processing','crafting','hallmarking','diamond_setting','polishing','quality_check','packed','ready_to_ship','shipped','out_for_delivery','delivered','cancelled','returned','refunded','expired') NOT NULL DEFAULT 'pending',
  `is_test` tinyint(1) NOT NULL DEFAULT 0,
  `reserved_until` datetime DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `subtotal` decimal(12,2) NOT NULL,
  `making_charge_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stone_charge_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `shipping_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL,
  `payment_method` enum('cod','stripe','bkash','nagad','rocket','card') NOT NULL DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `coupon_id` int(10) UNSIGNED DEFAULT NULL,
  `coupon_code` varchar(40) DEFAULT NULL,
  `shipping_name` varchar(120) DEFAULT NULL,
  `shipping_phone` varchar(30) DEFAULT NULL,
  `shipping_address` varchar(500) DEFAULT NULL,
  `shipping_label` varchar(40) DEFAULT NULL,
  `shipping_city` varchar(80) DEFAULT NULL,
  `shipping_district` varchar(80) DEFAULT NULL,
  `shipping_postcode` varchar(20) DEFAULT NULL,
  `shipping_country` char(2) NOT NULL DEFAULT 'BD',
  `billing_address` varchar(500) DEFAULT NULL,
  `customer_note` varchar(500) DEFAULT NULL,
  `gift_message` varchar(300) DEFAULT NULL,
  `internal_note` varchar(1000) DEFAULT NULL,
  `placed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_no`, `user_id`, `address_id`, `status`, `is_test`, `reserved_until`, `currency`, `subtotal`, `making_charge_total`, `stone_charge_total`, `discount_total`, `tax_total`, `tax_rate`, `shipping_total`, `grand_total`, `payment_method`, `payment_status`, `coupon_id`, `coupon_code`, `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_label`, `shipping_city`, `shipping_district`, `shipping_postcode`, `shipping_country`, `billing_address`, `customer_note`, `gift_message`, `internal_note`, `placed_at`, `created_at`, `updated_at`) VALUES
(1, 'LUM-2026-000001', NULL, NULL, 'confirmed', 0, NULL, 'BDT', 86500.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 90825.00, 'cod', 'pending', NULL, NULL, 'Test Customer', '+8801700000000', 'House 1, Road 2, Gulshan, Dhaka', NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-09 17:15:19', '2026-07-09 11:15:19', '2026-07-09 11:20:01'),
(2, 'LUM-DEMO-590412', 26, NULL, 'processing', 0, NULL, 'BDT', 528000.00, 0.00, 0.00, 52800.00, 23760.00, 0.00, 0.00, 498960.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801481083292', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-12 12:07:42', '2026-05-12 06:07:42', '2026-07-10 06:07:42'),
(3, 'LUM-DEMO-591354', 2, NULL, 'processing', 0, NULL, 'BDT', 372000.00, 0.00, 0.00, 0.00, 18600.00, 0.00, 0.00, 390600.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801540887031', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-12 12:07:42', '2026-05-12 06:07:42', '2026-07-10 06:07:42'),
(4, 'LUM-DEMO-592460', 20, NULL, 'shipped', 0, NULL, 'BDT', 428000.00, 0.00, 0.00, 0.00, 21400.00, 0.00, 0.00, 449400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801823496409', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-12 12:07:42', '2026-05-12 06:07:42', '2026-07-10 06:07:42'),
(5, 'LUM-DEMO-593324', 15, NULL, 'processing', 0, NULL, 'BDT', 997500.00, 0.00, 0.00, 0.00, 49875.00, 0.00, 0.00, 1047375.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801366864300', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-12 12:07:42', '2026-05-12 06:07:42', '2026-07-10 06:07:42'),
(6, 'LUM-DEMO-594447', 12, NULL, 'cancelled', 0, NULL, 'BDT', 892000.00, 0.00, 0.00, 0.00, 44600.00, 0.00, 0.00, 936600.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801591806520', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-12 12:07:42', '2026-05-12 06:07:42', '2026-07-10 06:07:42'),
(7, 'LUM-DEMO-580401', 19, NULL, 'pending', 0, NULL, 'BDT', 1208000.00, 0.00, 0.00, 0.00, 60400.00, 0.00, 0.00, 1268400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801345410849', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-13 12:07:42', '2026-05-13 06:07:42', '2026-07-10 06:07:42'),
(8, 'LUM-DEMO-581357', 20, NULL, 'delivered', 0, NULL, 'BDT', 818000.00, 0.00, 0.00, 0.00, 40900.00, 0.00, 0.00, 858900.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801363797367', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-13 12:07:42', '2026-05-13 06:07:42', '2026-07-10 06:07:42'),
(9, 'LUM-DEMO-570842', 3, NULL, 'shipped', 0, NULL, 'BDT', 537200.00, 0.00, 0.00, 0.00, 26860.00, 0.00, 0.00, 564060.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801601591488', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-14 12:07:42', '2026-05-14 06:07:42', '2026-07-10 06:07:42'),
(10, 'LUM-DEMO-571216', 3, NULL, 'delivered', 0, NULL, 'BDT', 72800.00, 0.00, 0.00, 0.00, 3640.00, 0.00, 500.00, 76940.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801652754793', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-14 12:07:42', '2026-05-14 06:07:42', '2026-07-10 06:07:42'),
(11, 'LUM-DEMO-572556', 27, NULL, 'delivered', 0, NULL, 'BDT', 1717000.00, 0.00, 0.00, 0.00, 85850.00, 0.00, 0.00, 1802850.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801657319310', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-14 12:07:42', '2026-05-14 06:07:42', '2026-07-10 06:07:42'),
(12, 'LUM-DEMO-560270', 22, NULL, 'delivered', 0, NULL, 'BDT', 1931100.00, 0.00, 0.00, 193110.00, 86900.00, 0.00, 0.00, 1824890.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801560649067', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-15 12:07:42', '2026-05-15 06:07:42', '2026-07-10 06:07:42'),
(13, 'LUM-DEMO-561746', 8, NULL, 'shipped', 0, NULL, 'BDT', 2260000.00, 0.00, 0.00, 0.00, 113000.00, 0.00, 0.00, 2373000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801428638930', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-15 12:07:42', '2026-05-15 06:07:42', '2026-07-10 06:07:42'),
(14, 'LUM-DEMO-550119', 42, NULL, 'confirmed', 0, NULL, 'BDT', 1616000.00, 0.00, 0.00, 0.00, 80800.00, 0.00, 0.00, 1696800.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801464819006', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-16 12:07:42', '2026-05-16 06:07:42', '2026-07-10 06:07:42'),
(15, 'LUM-DEMO-551536', 15, NULL, 'delivered', 0, NULL, 'BDT', 1926000.00, 0.00, 0.00, 0.00, 96300.00, 0.00, 0.00, 2022300.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801857137073', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-16 12:07:42', '2026-05-16 06:07:42', '2026-07-10 06:07:42'),
(16, 'LUM-DEMO-540848', 41, NULL, 'shipped', 0, NULL, 'BDT', 179400.00, 0.00, 0.00, 0.00, 8970.00, 0.00, 0.00, 188370.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801973299358', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-17 12:07:42', '2026-05-17 06:07:42', '2026-07-10 06:07:42'),
(17, 'LUM-DEMO-541186', 34, NULL, 'confirmed', 0, NULL, 'BDT', 313600.00, 0.00, 0.00, 31360.00, 14112.00, 0.00, 0.00, 296352.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801589324021', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-17 12:07:42', '2026-05-17 06:07:42', '2026-07-10 06:07:42'),
(18, 'LUM-DEMO-530172', 41, NULL, 'delivered', 0, NULL, 'BDT', 1118600.00, 0.00, 0.00, 111860.00, 50337.00, 0.00, 0.00, 1057077.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801597804588', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-18 12:07:42', '2026-05-18 06:07:42', '2026-07-10 06:07:42'),
(19, 'LUM-DEMO-531812', 15, NULL, 'pending', 0, NULL, 'BDT', 486000.00, 0.00, 0.00, 48600.00, 21870.00, 0.00, 0.00, 459270.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801355365796', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-18 12:07:42', '2026-05-18 06:07:42', '2026-07-10 06:07:42'),
(20, 'LUM-DEMO-520342', 12, NULL, 'delivered', 0, NULL, 'BDT', 58900.00, 0.00, 0.00, 0.00, 2945.00, 0.00, 500.00, 62345.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801775694768', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-19 12:07:42', '2026-05-19 06:07:42', '2026-07-10 06:07:42'),
(21, 'LUM-DEMO-521166', 36, NULL, 'shipped', 0, NULL, 'BDT', 988900.00, 0.00, 0.00, 0.00, 49445.00, 0.00, 0.00, 1038345.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801921033837', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-19 12:07:42', '2026-05-19 06:07:42', '2026-07-10 06:07:42'),
(22, 'LUM-DEMO-510183', 28, NULL, 'processing', 0, NULL, 'BDT', 624000.00, 0.00, 0.00, 0.00, 31200.00, 0.00, 0.00, 655200.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801446357866', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-20 12:07:42', '2026-05-20 06:07:42', '2026-07-10 06:07:42'),
(23, 'LUM-DEMO-511356', 22, NULL, 'processing', 0, NULL, 'BDT', 193400.00, 0.00, 0.00, 0.00, 9670.00, 0.00, 0.00, 203070.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801521536495', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-20 12:07:42', '2026-05-20 06:07:42', '2026-07-10 06:07:42'),
(24, 'LUM-DEMO-500489', 20, NULL, 'delivered', 0, NULL, 'BDT', 784600.00, 0.00, 0.00, 0.00, 39230.00, 0.00, 0.00, 823830.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801506411380', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-21 12:07:42', '2026-05-21 06:07:42', '2026-07-10 06:07:42'),
(25, 'LUM-DEMO-501109', 29, NULL, 'shipped', 0, NULL, 'BDT', 2430400.00, 0.00, 0.00, 243040.00, 109368.00, 0.00, 0.00, 2296728.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801829016148', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-21 12:07:42', '2026-05-21 06:07:42', '2026-07-10 06:07:42'),
(26, 'LUM-DEMO-502435', 32, NULL, 'delivered', 0, NULL, 'BDT', 1472800.00, 0.00, 0.00, 0.00, 73640.00, 0.00, 0.00, 1546440.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801487964385', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-21 12:07:42', '2026-05-21 06:07:42', '2026-07-10 06:07:42'),
(27, 'LUM-DEMO-503287', 28, NULL, 'cancelled', 0, NULL, 'BDT', 1166300.00, 0.00, 0.00, 0.00, 58315.00, 0.00, 0.00, 1224615.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801773961882', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-21 12:07:42', '2026-05-21 06:07:42', '2026-07-10 06:07:42'),
(28, 'LUM-DEMO-504617', 2, NULL, 'processing', 0, NULL, 'BDT', 12800.00, 0.00, 0.00, 1280.00, 576.00, 0.00, 500.00, 12596.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801660675799', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-21 12:07:42', '2026-05-21 06:07:42', '2026-07-10 06:07:42'),
(29, 'LUM-DEMO-490760', 15, NULL, 'delivered', 0, NULL, 'BDT', 218000.00, 0.00, 0.00, 0.00, 10900.00, 0.00, 0.00, 228900.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801412651926', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-22 12:07:42', '2026-05-22 06:07:42', '2026-07-10 06:07:42'),
(30, 'LUM-DEMO-491725', 31, NULL, 'confirmed', 0, NULL, 'BDT', 720000.00, 0.00, 0.00, 72000.00, 32400.00, 0.00, 0.00, 680400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801303414634', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-22 12:07:42', '2026-05-22 06:07:42', '2026-07-10 06:07:42'),
(31, 'LUM-DEMO-480296', 35, NULL, 'shipped', 0, NULL, 'BDT', 370900.00, 0.00, 0.00, 0.00, 18545.00, 0.00, 0.00, 389445.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801437571643', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-23 12:07:42', '2026-05-23 06:07:42', '2026-07-10 06:07:42'),
(32, 'LUM-DEMO-481709', 16, NULL, 'pending', 0, NULL, 'BDT', 5080000.00, 0.00, 0.00, 0.00, 254000.00, 0.00, 0.00, 5334000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801506184184', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-23 12:07:42', '2026-05-23 06:07:42', '2026-07-10 06:07:42'),
(33, 'LUM-DEMO-482835', 24, NULL, 'shipped', 0, NULL, 'BDT', 528000.00, 0.00, 0.00, 52800.00, 23760.00, 0.00, 0.00, 498960.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801341499224', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-23 12:07:42', '2026-05-23 06:07:42', '2026-07-10 06:07:42'),
(34, 'LUM-DEMO-470442', 3, NULL, 'delivered', 0, NULL, 'BDT', 4520000.00, 0.00, 0.00, 0.00, 226000.00, 0.00, 0.00, 4746000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801780881563', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-24 12:07:42', '2026-05-24 06:07:42', '2026-07-10 06:07:42'),
(35, 'LUM-DEMO-471434', 20, NULL, 'confirmed', 0, NULL, 'BDT', 1993000.00, 0.00, 0.00, 0.00, 99650.00, 0.00, 0.00, 2092650.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801937231102', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-24 12:07:42', '2026-05-24 06:07:42', '2026-07-10 06:07:42'),
(36, 'LUM-DEMO-472581', 31, NULL, 'confirmed', 0, NULL, 'BDT', 148000.00, 0.00, 0.00, 14800.00, 6660.00, 0.00, 0.00, 139860.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801831307131', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-24 12:07:42', '2026-05-24 06:07:42', '2026-07-10 06:07:42'),
(37, 'LUM-DEMO-460715', 35, NULL, 'delivered', 0, NULL, 'BDT', 104600.00, 0.00, 0.00, 10460.00, 4707.00, 0.00, 0.00, 98847.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801672304412', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-25 12:07:42', '2026-05-25 06:07:42', '2026-07-10 06:07:42'),
(38, 'LUM-DEMO-450818', 20, NULL, 'processing', 0, NULL, 'BDT', 1960800.00, 0.00, 0.00, 196080.00, 88236.00, 0.00, 0.00, 1852956.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801700231971', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-26 12:07:42', '2026-05-26 06:07:42', '2026-07-10 06:07:42'),
(39, 'LUM-DEMO-451846', 12, NULL, 'shipped', 0, NULL, 'BDT', 466500.00, 0.00, 0.00, 0.00, 23325.00, 0.00, 0.00, 489825.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801771996387', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-26 12:07:42', '2026-05-26 06:07:42', '2026-07-10 06:07:42'),
(40, 'LUM-DEMO-452592', 10, NULL, 'delivered', 0, NULL, 'BDT', 252600.00, 0.00, 0.00, 25260.00, 11367.00, 0.00, 0.00, 238707.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801739206822', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-26 12:07:42', '2026-05-26 06:07:42', '2026-07-10 06:07:42'),
(41, 'LUM-DEMO-453226', 22, NULL, 'processing', 0, NULL, 'BDT', 436000.00, 0.00, 0.00, 0.00, 21800.00, 0.00, 0.00, 457800.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801487319365', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-26 12:07:42', '2026-05-26 06:07:42', '2026-07-10 06:07:42'),
(42, 'LUM-DEMO-440552', 26, NULL, 'confirmed', 0, NULL, 'BDT', 2232800.00, 0.00, 0.00, 223280.00, 100476.00, 0.00, 0.00, 2109996.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801722753877', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-27 12:07:42', '2026-05-27 06:07:42', '2026-07-10 06:07:42'),
(43, 'LUM-DEMO-441625', 38, NULL, 'pending', 0, NULL, 'BDT', 2270000.00, 0.00, 0.00, 0.00, 113500.00, 0.00, 0.00, 2383500.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801818134005', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-27 12:07:42', '2026-05-27 06:07:42', '2026-07-10 06:07:42'),
(44, 'LUM-DEMO-430214', 20, NULL, 'processing', 0, NULL, 'BDT', 569200.00, 0.00, 0.00, 0.00, 28460.00, 0.00, 0.00, 597660.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801442406745', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-28 12:07:42', '2026-05-28 06:07:42', '2026-07-10 06:07:42'),
(45, 'LUM-DEMO-431199', 24, NULL, 'delivered', 0, NULL, 'BDT', 1826000.00, 0.00, 0.00, 0.00, 91300.00, 0.00, 0.00, 1917300.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801780483981', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-28 12:07:42', '2026-05-28 06:07:42', '2026-07-10 06:07:42'),
(46, 'LUM-DEMO-432704', 9, NULL, 'delivered', 0, NULL, 'BDT', 2014000.00, 0.00, 0.00, 201400.00, 90630.00, 0.00, 0.00, 1903230.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801462665325', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-28 12:07:42', '2026-05-28 06:07:42', '2026-07-10 06:07:42'),
(47, 'LUM-DEMO-433164', 30, NULL, 'delivered', 0, NULL, 'BDT', 583000.00, 0.00, 0.00, 58300.00, 26235.00, 0.00, 0.00, 550935.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801485302212', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-28 12:07:42', '2026-05-28 06:07:42', '2026-07-10 06:07:42'),
(48, 'LUM-DEMO-434736', 19, NULL, 'shipped', 0, NULL, 'BDT', 270500.00, 0.00, 0.00, 27050.00, 12173.00, 0.00, 0.00, 255623.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801804371556', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-28 12:07:42', '2026-05-28 06:07:42', '2026-07-10 06:07:42'),
(49, 'LUM-DEMO-420276', 33, NULL, 'confirmed', 0, NULL, 'BDT', 1666400.00, 0.00, 0.00, 0.00, 83320.00, 0.00, 0.00, 1749720.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801840461401', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-29 12:07:42', '2026-05-29 06:07:42', '2026-07-10 06:07:42'),
(50, 'LUM-DEMO-421412', 19, NULL, 'shipped', 0, NULL, 'BDT', 229000.00, 0.00, 0.00, 0.00, 11450.00, 0.00, 0.00, 240450.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801793357388', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-29 12:07:42', '2026-05-29 06:07:42', '2026-07-10 06:07:42'),
(51, 'LUM-DEMO-410510', 4, NULL, 'shipped', 0, NULL, 'BDT', 980000.00, 0.00, 0.00, 0.00, 49000.00, 0.00, 0.00, 1029000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801992445055', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-30 12:07:42', '2026-05-30 06:07:42', '2026-07-10 06:07:42'),
(52, 'LUM-DEMO-411243', 12, NULL, 'delivered', 0, NULL, 'BDT', 1068800.00, 0.00, 0.00, 106880.00, 48096.00, 0.00, 0.00, 1010016.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801710177526', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-30 12:07:42', '2026-05-30 06:07:42', '2026-07-10 06:07:42'),
(53, 'LUM-DEMO-412897', 28, NULL, 'delivered', 0, NULL, 'BDT', 2746000.00, 0.00, 0.00, 274600.00, 123570.00, 0.00, 0.00, 2594970.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801744901864', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-30 12:07:42', '2026-05-30 06:07:42', '2026-07-10 06:07:42'),
(54, 'LUM-DEMO-413474', 2, NULL, 'confirmed', 0, NULL, 'BDT', 528000.00, 0.00, 0.00, 0.00, 26400.00, 0.00, 0.00, 554400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801635567435', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-30 12:07:42', '2026-05-30 06:07:42', '2026-07-10 06:07:42'),
(55, 'LUM-DEMO-414273', 15, NULL, 'shipped', 0, NULL, 'BDT', 723200.00, 0.00, 0.00, 0.00, 36160.00, 0.00, 0.00, 759360.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801681742790', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-30 12:07:42', '2026-05-30 06:07:42', '2026-07-10 06:07:42'),
(56, 'LUM-DEMO-400493', 10, NULL, 'delivered', 0, NULL, 'BDT', 527600.00, 0.00, 0.00, 52760.00, 23742.00, 0.00, 0.00, 498582.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801845210628', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-31 12:07:42', '2026-05-31 06:07:42', '2026-07-10 06:07:42'),
(57, 'LUM-DEMO-401149', 35, NULL, 'processing', 0, NULL, 'BDT', 233800.00, 0.00, 0.00, 0.00, 11690.00, 0.00, 0.00, 245490.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801853742820', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-31 12:07:42', '2026-05-31 06:07:42', '2026-07-10 06:07:42'),
(58, 'LUM-DEMO-402230', 22, NULL, 'shipped', 0, NULL, 'BDT', 228800.00, 0.00, 0.00, 0.00, 11440.00, 0.00, 0.00, 240240.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801494773223', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-05-31 12:07:42', '2026-05-31 06:07:42', '2026-07-10 06:07:42'),
(59, 'LUM-DEMO-390273', 20, NULL, 'confirmed', 0, NULL, 'BDT', 386000.00, 0.00, 0.00, 0.00, 19300.00, 0.00, 0.00, 405300.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801610177009', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-01 12:07:42', '2026-06-01 06:07:42', '2026-07-10 06:07:42'),
(60, 'LUM-DEMO-380255', 13, NULL, 'delivered', 0, NULL, 'BDT', 479600.00, 0.00, 0.00, 47960.00, 21582.00, 0.00, 0.00, 453222.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801413672435', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-02 12:07:42', '2026-06-02 06:07:42', '2026-07-10 06:07:42'),
(61, 'LUM-DEMO-381554', 22, NULL, 'pending', 0, NULL, 'BDT', 518800.00, 0.00, 0.00, 51880.00, 23346.00, 0.00, 0.00, 490266.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801474504931', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-02 12:07:42', '2026-06-02 06:07:42', '2026-07-10 06:07:42'),
(62, 'LUM-DEMO-382486', 19, NULL, 'delivered', 0, NULL, 'BDT', 307600.00, 0.00, 0.00, 0.00, 15380.00, 0.00, 0.00, 322980.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801582901958', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-02 12:07:42', '2026-06-02 06:07:42', '2026-07-10 06:07:42'),
(63, 'LUM-DEMO-383496', 29, NULL, 'pending', 0, NULL, 'BDT', 1050000.00, 0.00, 0.00, 0.00, 52500.00, 0.00, 0.00, 1102500.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801348379930', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-02 12:07:42', '2026-06-02 06:07:42', '2026-07-10 06:07:42'),
(64, 'LUM-DEMO-384800', 13, NULL, 'pending', 0, NULL, 'BDT', 562400.00, 0.00, 0.00, 0.00, 28120.00, 0.00, 0.00, 590520.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801956754057', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-02 12:07:42', '2026-06-02 06:07:42', '2026-07-10 06:07:42'),
(65, 'LUM-DEMO-370351', 13, NULL, 'delivered', 0, NULL, 'BDT', 218000.00, 0.00, 0.00, 0.00, 10900.00, 0.00, 0.00, 228900.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801648013843', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-03 12:07:42', '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(66, 'LUM-DEMO-371823', 11, NULL, 'pending', 0, NULL, 'BDT', 1221600.00, 0.00, 0.00, 122160.00, 54972.00, 0.00, 0.00, 1154412.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801416244887', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-03 12:07:42', '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(67, 'LUM-DEMO-372566', 42, NULL, 'delivered', 0, NULL, 'BDT', 248000.00, 0.00, 0.00, 0.00, 12400.00, 0.00, 0.00, 260400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801790755624', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-03 12:07:42', '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(68, 'LUM-DEMO-373734', 37, NULL, 'delivered', 0, NULL, 'BDT', 1727000.00, 0.00, 0.00, 0.00, 86350.00, 0.00, 0.00, 1813350.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801703141901', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-03 12:07:42', '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(69, 'LUM-DEMO-374316', 38, NULL, 'confirmed', 0, NULL, 'BDT', 3084000.00, 0.00, 0.00, 308400.00, 138780.00, 0.00, 0.00, 2914380.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801307203256', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-03 12:07:42', '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(70, 'LUM-DEMO-350890', 4, NULL, 'shipped', 0, NULL, 'BDT', 1304000.00, 0.00, 0.00, 0.00, 65200.00, 0.00, 0.00, 1369200.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801666312578', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-05 12:07:42', '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(71, 'LUM-DEMO-351818', 36, NULL, 'confirmed', 0, NULL, 'BDT', 446400.00, 0.00, 0.00, 0.00, 22320.00, 0.00, 0.00, 468720.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801421275741', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-05 12:07:42', '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(72, 'LUM-DEMO-352217', 41, NULL, 'cancelled', 0, NULL, 'BDT', 930000.00, 0.00, 0.00, 93000.00, 41850.00, 0.00, 0.00, 878850.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801829038401', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-05 12:07:42', '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(73, 'LUM-DEMO-353112', 3, NULL, 'delivered', 0, NULL, 'BDT', 168000.00, 0.00, 0.00, 0.00, 8400.00, 0.00, 0.00, 176400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801590476892', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-05 12:07:42', '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(74, 'LUM-DEMO-340773', 39, NULL, 'processing', 0, NULL, 'BDT', 148400.00, 0.00, 0.00, 0.00, 7420.00, 0.00, 0.00, 155820.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801968642608', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-06 12:07:42', '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(75, 'LUM-DEMO-341496', 7, NULL, 'cancelled', 0, NULL, 'BDT', 305200.00, 0.00, 0.00, 0.00, 15260.00, 0.00, 0.00, 320460.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801379466129', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-06 12:07:42', '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(76, 'LUM-DEMO-342278', 29, NULL, 'cancelled', 0, NULL, 'BDT', 37200.00, 0.00, 0.00, 0.00, 1860.00, 0.00, 500.00, 39560.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801326035973', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-06 12:07:42', '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(77, 'LUM-DEMO-343568', 35, NULL, 'delivered', 0, NULL, 'BDT', 1292000.00, 0.00, 0.00, 129200.00, 58140.00, 0.00, 0.00, 1220940.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801839485274', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-06 12:07:42', '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(78, 'LUM-DEMO-344118', 11, NULL, 'processing', 0, NULL, 'BDT', 134700.00, 0.00, 0.00, 13470.00, 6062.00, 0.00, 0.00, 127292.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801621282820', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-06 12:07:42', '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(79, 'LUM-DEMO-330445', 15, NULL, 'pending', 0, NULL, 'BDT', 1162000.00, 0.00, 0.00, 0.00, 58100.00, 0.00, 0.00, 1220100.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801975190754', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-07 12:07:42', '2026-06-07 06:07:42', '2026-07-10 06:07:42'),
(80, 'LUM-DEMO-331918', 10, NULL, 'shipped', 0, NULL, 'BDT', 1156000.00, 0.00, 0.00, 0.00, 57800.00, 0.00, 0.00, 1213800.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801822961687', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-07 12:07:42', '2026-06-07 06:07:42', '2026-07-10 06:07:42'),
(81, 'LUM-DEMO-332481', 5, NULL, 'pending', 0, NULL, 'BDT', 1146000.00, 0.00, 0.00, 114600.00, 51570.00, 0.00, 0.00, 1082970.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801678461682', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-07 12:07:42', '2026-06-07 06:07:42', '2026-07-10 06:07:42'),
(82, 'LUM-DEMO-333455', 18, NULL, 'pending', 0, NULL, 'BDT', 212000.00, 0.00, 0.00, 21200.00, 9540.00, 0.00, 0.00, 200340.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801766930405', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-07 12:07:42', '2026-06-07 06:07:42', '2026-07-10 06:07:42'),
(83, 'LUM-DEMO-310117', 1, NULL, 'shipped', 0, NULL, 'BDT', 464400.00, 0.00, 0.00, 46440.00, 20898.00, 0.00, 0.00, 438858.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801639893499', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-09 12:07:42', '2026-06-09 06:07:42', '2026-07-10 06:07:42'),
(84, 'LUM-DEMO-311116', 39, NULL, 'delivered', 0, NULL, 'BDT', 1132600.00, 0.00, 0.00, 0.00, 56630.00, 0.00, 0.00, 1189230.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801573066625', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-09 12:07:42', '2026-06-09 06:07:42', '2026-07-10 06:07:42'),
(85, 'LUM-DEMO-312567', 20, NULL, 'confirmed', 0, NULL, 'BDT', 470500.00, 0.00, 0.00, 47050.00, 21173.00, 0.00, 0.00, 444623.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801563470279', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-09 12:07:42', '2026-06-09 06:07:42', '2026-07-10 06:07:42'),
(86, 'LUM-DEMO-313828', 34, NULL, 'delivered', 0, NULL, 'BDT', 224000.00, 0.00, 0.00, 0.00, 11200.00, 0.00, 0.00, 235200.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801455809660', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-09 12:07:42', '2026-06-09 06:07:42', '2026-07-10 06:07:42'),
(87, 'LUM-DEMO-300766', 30, NULL, 'confirmed', 0, NULL, 'BDT', 18600.00, 0.00, 0.00, 1860.00, 837.00, 0.00, 500.00, 18077.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801486458064', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-10 12:07:42', '2026-06-10 06:07:42', '2026-07-10 06:07:42'),
(88, 'LUM-DEMO-301924', 22, NULL, 'pending', 0, NULL, 'BDT', 4520000.00, 0.00, 0.00, 0.00, 226000.00, 0.00, 0.00, 4746000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801669168156', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-10 12:07:42', '2026-06-10 06:07:42', '2026-07-10 06:07:42'),
(89, 'LUM-DEMO-302952', 36, NULL, 'cancelled', 0, NULL, 'BDT', 196000.00, 0.00, 0.00, 19600.00, 8820.00, 0.00, 0.00, 185220.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801506791814', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-10 12:07:42', '2026-06-10 06:07:42', '2026-07-10 06:07:42'),
(90, 'LUM-DEMO-303954', 22, NULL, 'cancelled', 0, NULL, 'BDT', 74200.00, 0.00, 0.00, 0.00, 3710.00, 0.00, 500.00, 78410.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801961738902', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-10 12:07:42', '2026-06-10 06:07:42', '2026-07-10 06:07:42'),
(91, 'LUM-DEMO-290996', 8, NULL, 'shipped', 0, NULL, 'BDT', 269800.00, 0.00, 0.00, 0.00, 13490.00, 0.00, 0.00, 283290.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801551242444', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-11 12:07:42', '2026-06-11 06:07:42', '2026-07-10 06:07:42'),
(92, 'LUM-DEMO-291862', 15, NULL, 'pending', 0, NULL, 'BDT', 224000.00, 0.00, 0.00, 22400.00, 10080.00, 0.00, 0.00, 211680.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801788983337', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-11 12:07:42', '2026-06-11 06:07:42', '2026-07-10 06:07:42'),
(93, 'LUM-DEMO-292979', 31, NULL, 'processing', 0, NULL, 'BDT', 183400.00, 0.00, 0.00, 18340.00, 8253.00, 0.00, 0.00, 173313.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801922453221', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-11 12:07:42', '2026-06-11 06:07:42', '2026-07-10 06:07:42'),
(94, 'LUM-DEMO-293256', 31, NULL, 'cancelled', 0, NULL, 'BDT', 645700.00, 0.00, 0.00, 0.00, 32285.00, 0.00, 0.00, 677985.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801907812583', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-11 12:07:42', '2026-06-11 06:07:42', '2026-07-10 06:07:42'),
(95, 'LUM-DEMO-294829', 41, NULL, 'delivered', 0, NULL, 'BDT', 1784000.00, 0.00, 0.00, 0.00, 89200.00, 0.00, 0.00, 1873200.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801707595917', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-11 12:07:42', '2026-06-11 06:07:42', '2026-07-10 06:07:42'),
(96, 'LUM-DEMO-280787', 6, NULL, 'processing', 0, NULL, 'BDT', 124000.00, 0.00, 0.00, 12400.00, 5580.00, 0.00, 0.00, 117180.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801848410762', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-12 12:07:42', '2026-06-12 06:07:42', '2026-07-10 06:07:42'),
(97, 'LUM-DEMO-270337', 16, NULL, 'delivered', 0, NULL, 'BDT', 3228000.00, 0.00, 0.00, 0.00, 161400.00, 0.00, 0.00, 3389400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801332122327', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-13 12:07:42', '2026-06-13 06:07:42', '2026-07-10 06:07:42'),
(98, 'LUM-DEMO-271304', 14, NULL, 'delivered', 0, NULL, 'BDT', 904800.00, 0.00, 0.00, 0.00, 45240.00, 0.00, 0.00, 950040.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801314501285', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-13 12:07:42', '2026-06-13 06:07:42', '2026-07-10 06:07:42'),
(99, 'LUM-DEMO-272588', 26, NULL, 'shipped', 0, NULL, 'BDT', 1041000.00, 0.00, 0.00, 0.00, 52050.00, 0.00, 0.00, 1093050.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801590547244', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-13 12:07:42', '2026-06-13 06:07:42', '2026-07-10 06:07:42'),
(100, 'LUM-DEMO-273691', 30, NULL, 'pending', 0, NULL, 'BDT', 535000.00, 0.00, 0.00, 0.00, 26750.00, 0.00, 0.00, 561750.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801380361903', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-13 12:07:42', '2026-06-13 06:07:42', '2026-07-10 06:07:42'),
(101, 'LUM-DEMO-260761', 41, NULL, 'processing', 0, NULL, 'BDT', 767600.00, 0.00, 0.00, 0.00, 38380.00, 0.00, 0.00, 805980.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801363086170', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-14 12:07:42', '2026-06-14 06:07:42', '2026-07-10 06:07:42'),
(102, 'LUM-DEMO-240410', 3, NULL, 'delivered', 0, NULL, 'BDT', 37200.00, 0.00, 0.00, 0.00, 1860.00, 0.00, 500.00, 39560.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801344474010', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-16 12:07:42', '2026-06-16 06:07:42', '2026-07-10 06:07:42'),
(103, 'LUM-DEMO-241163', 34, NULL, 'pending', 0, NULL, 'BDT', 1441400.00, 0.00, 0.00, 0.00, 72070.00, 0.00, 0.00, 1513470.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801760885169', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-16 12:07:42', '2026-06-16 06:07:42', '2026-07-10 06:07:42'),
(104, 'LUM-DEMO-242411', 20, NULL, 'delivered', 0, NULL, 'BDT', 625400.00, 0.00, 0.00, 0.00, 31270.00, 0.00, 0.00, 656670.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801751561698', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-16 12:07:42', '2026-06-16 06:07:42', '2026-07-10 06:07:42'),
(105, 'LUM-DEMO-243578', 5, NULL, 'delivered', 0, NULL, 'BDT', 1678000.00, 0.00, 0.00, 0.00, 83900.00, 0.00, 0.00, 1761900.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801312153030', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-16 12:07:42', '2026-06-16 06:07:42', '2026-07-10 06:07:42'),
(106, 'LUM-DEMO-230253', 38, NULL, 'pending', 0, NULL, 'BDT', 12800.00, 0.00, 0.00, 1280.00, 576.00, 0.00, 500.00, 12596.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801474458512', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-17 12:07:42', '2026-06-17 06:07:42', '2026-07-10 06:07:42'),
(107, 'LUM-DEMO-231121', 12, NULL, 'delivered', 0, NULL, 'BDT', 218800.00, 0.00, 0.00, 21880.00, 9846.00, 0.00, 0.00, 206766.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801762237458', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-17 12:07:42', '2026-06-17 06:07:42', '2026-07-10 06:07:42'),
(108, 'LUM-DEMO-220953', 30, NULL, 'confirmed', 0, NULL, 'BDT', 448000.00, 0.00, 0.00, 0.00, 22400.00, 0.00, 0.00, 470400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801676411050', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-18 12:07:42', '2026-06-18 06:07:42', '2026-07-10 06:07:42'),
(109, 'LUM-DEMO-221235', 2, NULL, 'pending', 0, NULL, 'BDT', 3248700.00, 0.00, 0.00, 0.00, 162435.00, 0.00, 0.00, 3411135.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801950600735', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-18 12:07:42', '2026-06-18 06:07:42', '2026-07-10 06:07:42'),
(110, 'LUM-DEMO-222385', 7, NULL, 'delivered', 0, NULL, 'BDT', 32800.00, 0.00, 0.00, 3280.00, 1476.00, 0.00, 500.00, 31496.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801491046111', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-18 12:07:42', '2026-06-18 06:07:42', '2026-07-10 06:07:42'),
(111, 'LUM-DEMO-223326', 27, NULL, 'delivered', 0, NULL, 'BDT', 148000.00, 0.00, 0.00, 14800.00, 6660.00, 0.00, 0.00, 139860.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801883119074', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-18 12:07:42', '2026-06-18 06:07:42', '2026-07-10 06:07:42'),
(112, 'LUM-DEMO-180354', 24, NULL, 'processing', 0, NULL, 'BDT', 214800.00, 0.00, 0.00, 0.00, 10740.00, 0.00, 0.00, 225540.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801453003997', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-22 12:07:42', '2026-06-22 06:07:42', '2026-07-10 06:07:42'),
(113, 'LUM-DEMO-181894', 18, NULL, 'delivered', 0, NULL, 'BDT', 173000.00, 0.00, 0.00, 17300.00, 7785.00, 0.00, 0.00, 163485.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801994647611', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-22 12:07:42', '2026-06-22 06:07:42', '2026-07-10 06:07:42'),
(114, 'LUM-DEMO-182162', 15, NULL, 'processing', 0, NULL, 'BDT', 148400.00, 0.00, 0.00, 0.00, 7420.00, 0.00, 0.00, 155820.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801396097194', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-22 12:07:42', '2026-06-22 06:07:42', '2026-07-10 06:07:42'),
(115, 'LUM-DEMO-183717', 7, NULL, 'delivered', 0, NULL, 'BDT', 642800.00, 0.00, 0.00, 64280.00, 28926.00, 0.00, 0.00, 607446.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801705853256', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-22 12:07:42', '2026-06-22 06:07:42', '2026-07-10 06:07:42'),
(116, 'LUM-DEMO-170739', 3, NULL, 'confirmed', 0, NULL, 'BDT', 71100.00, 0.00, 0.00, 0.00, 3555.00, 0.00, 500.00, 75155.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801949889568', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-23 12:07:42', '2026-06-23 06:07:42', '2026-07-10 06:07:42'),
(117, 'LUM-DEMO-171648', 14, NULL, 'delivered', 0, NULL, 'BDT', 142000.00, 0.00, 0.00, 0.00, 7100.00, 0.00, 0.00, 149100.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801866527070', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-23 12:07:42', '2026-06-23 06:07:42', '2026-07-10 06:07:42'),
(118, 'LUM-DEMO-172506', 3, NULL, 'delivered', 0, NULL, 'BDT', 74200.00, 0.00, 0.00, 0.00, 3710.00, 0.00, 500.00, 78410.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801892116917', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-23 12:07:42', '2026-06-23 06:07:42', '2026-07-10 06:07:42'),
(119, 'LUM-DEMO-173613', 25, NULL, 'confirmed', 0, NULL, 'BDT', 1494000.00, 0.00, 0.00, 0.00, 74700.00, 0.00, 0.00, 1568700.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801340969148', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-23 12:07:42', '2026-06-23 06:07:42', '2026-07-10 06:07:42'),
(120, 'LUM-DEMO-160393', 32, NULL, 'delivered', 0, NULL, 'BDT', 514500.00, 0.00, 0.00, 0.00, 25725.00, 0.00, 0.00, 540225.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801320683990', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-24 12:07:42', '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(121, 'LUM-DEMO-161606', 5, NULL, 'delivered', 0, NULL, 'BDT', 927700.00, 0.00, 0.00, 0.00, 46385.00, 0.00, 0.00, 974085.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801439784133', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-24 12:07:42', '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(122, 'LUM-DEMO-162965', 20, NULL, 'delivered', 0, NULL, 'BDT', 857400.00, 0.00, 0.00, 0.00, 42870.00, 0.00, 0.00, 900270.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801890466313', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-24 12:07:42', '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(123, 'LUM-DEMO-163389', 24, NULL, 'confirmed', 0, NULL, 'BDT', 565600.00, 0.00, 0.00, 0.00, 28280.00, 0.00, 0.00, 593880.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801849598784', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-24 12:07:42', '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(124, 'LUM-DEMO-164240', 22, NULL, 'pending', 0, NULL, 'BDT', 660000.00, 0.00, 0.00, 0.00, 33000.00, 0.00, 0.00, 693000.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801945244266', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-24 12:07:42', '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(125, 'LUM-DEMO-130129', 24, NULL, 'delivered', 0, NULL, 'BDT', 476500.00, 0.00, 0.00, 47650.00, 21443.00, 0.00, 0.00, 450293.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801445373712', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-27 12:07:42', '2026-06-27 06:07:42', '2026-07-10 06:07:42'),
(126, 'LUM-DEMO-120783', 39, NULL, 'processing', 0, NULL, 'BDT', 12800.00, 0.00, 0.00, 0.00, 640.00, 0.00, 500.00, 13940.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801588245605', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-28 12:07:42', '2026-06-28 06:07:42', '2026-07-10 06:07:42'),
(127, 'LUM-DEMO-110943', 21, NULL, 'confirmed', 0, NULL, 'BDT', 2518800.00, 0.00, 0.00, 0.00, 125940.00, 0.00, 0.00, 2644740.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801542945880', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-29 12:07:42', '2026-06-29 06:07:42', '2026-07-10 06:07:42'),
(128, 'LUM-DEMO-111749', 1, NULL, 'delivered', 0, NULL, 'BDT', 518800.00, 0.00, 0.00, 0.00, 25940.00, 0.00, 0.00, 544740.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801543328240', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-29 12:07:42', '2026-06-29 06:07:42', '2026-07-10 06:07:42'),
(129, 'LUM-DEMO-112554', 33, NULL, 'confirmed', 0, NULL, 'BDT', 174000.00, 0.00, 0.00, 0.00, 8700.00, 0.00, 0.00, 182700.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801744083588', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-29 12:07:42', '2026-06-29 06:07:42', '2026-07-10 06:07:42'),
(130, 'LUM-DEMO-100740', 39, NULL, 'delivered', 0, NULL, 'BDT', 824400.00, 0.00, 0.00, 0.00, 41220.00, 0.00, 0.00, 865620.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801902101356', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-30 12:07:42', '2026-06-30 06:07:42', '2026-07-10 06:07:42'),
(131, 'LUM-DEMO-101886', 3, NULL, 'cancelled', 0, NULL, 'BDT', 428000.00, 0.00, 0.00, 0.00, 21400.00, 0.00, 0.00, 449400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801967194354', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-30 12:07:42', '2026-06-30 06:07:42', '2026-07-10 06:07:42'),
(132, 'LUM-DEMO-102968', 4, NULL, 'cancelled', 0, NULL, 'BDT', 292600.00, 0.00, 0.00, 0.00, 14630.00, 0.00, 0.00, 307230.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801688709866', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-30 12:07:42', '2026-06-30 06:07:42', '2026-07-10 06:07:42'),
(133, 'LUM-DEMO-103882', 34, NULL, 'cancelled', 0, NULL, 'BDT', 784000.00, 0.00, 0.00, 0.00, 39200.00, 0.00, 0.00, 823200.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801834632799', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-06-30 12:07:42', '2026-06-30 06:07:42', '2026-07-10 06:07:42'),
(134, 'LUM-DEMO-090557', 13, NULL, 'cancelled', 0, NULL, 'BDT', 296000.00, 0.00, 0.00, 29600.00, 13320.00, 0.00, 0.00, 279720.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801426323560', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-01 12:07:42', '2026-07-01 06:07:42', '2026-07-10 06:07:42'),
(135, 'LUM-DEMO-091326', 23, NULL, 'pending', 0, NULL, 'BDT', 1228700.00, 0.00, 0.00, 0.00, 61435.00, 0.00, 0.00, 1290135.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801534736061', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-01 12:07:42', '2026-07-01 06:07:42', '2026-07-10 06:07:42'),
(136, 'LUM-DEMO-092447', 14, NULL, 'delivered', 0, NULL, 'BDT', 1076000.00, 0.00, 0.00, 0.00, 53800.00, 0.00, 0.00, 1129800.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801319951490', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-01 12:07:42', '2026-07-01 06:07:42', '2026-07-10 06:07:42'),
(137, 'LUM-DEMO-093520', 5, NULL, 'cancelled', 0, NULL, 'BDT', 1068000.00, 0.00, 0.00, 0.00, 53400.00, 0.00, 0.00, 1121400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801838963659', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-01 12:07:42', '2026-07-01 06:07:42', '2026-07-10 06:07:42'),
(138, 'LUM-DEMO-094389', 28, NULL, 'delivered', 0, NULL, 'BDT', 117800.00, 0.00, 0.00, 11780.00, 5301.00, 0.00, 0.00, 111321.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801820598526', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-01 12:07:42', '2026-07-01 06:07:42', '2026-07-10 06:07:42'),
(139, 'LUM-DEMO-080718', 4, NULL, 'processing', 0, NULL, 'BDT', 39800.00, 0.00, 0.00, 0.00, 1990.00, 0.00, 500.00, 42290.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801427865375', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-02 12:07:42', '2026-07-02 06:07:42', '2026-07-10 06:07:42'),
(140, 'LUM-DEMO-070734', 32, NULL, 'delivered', 0, NULL, 'BDT', 257000.00, 0.00, 0.00, 0.00, 12850.00, 0.00, 0.00, 269850.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801733115128', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-03 12:07:42', '2026-07-03 06:07:42', '2026-07-10 06:07:42'),
(141, 'LUM-DEMO-071563', 42, NULL, 'shipped', 0, NULL, 'BDT', 1230500.00, 0.00, 0.00, 0.00, 61525.00, 0.00, 0.00, 1292025.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801971372888', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-03 12:07:42', '2026-07-03 06:07:42', '2026-07-10 06:07:42'),
(142, 'LUM-DEMO-072687', 36, NULL, 'confirmed', 0, NULL, 'BDT', 167600.00, 0.00, 0.00, 0.00, 8380.00, 0.00, 0.00, 175980.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801781742230', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-03 12:07:42', '2026-07-03 06:07:42', '2026-07-10 06:07:42'),
(143, 'LUM-DEMO-073658', 3, NULL, 'delivered', 0, NULL, 'BDT', 679400.00, 0.00, 0.00, 0.00, 33970.00, 0.00, 0.00, 713370.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801556915075', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-03 12:07:42', '2026-07-03 06:07:42', '2026-07-10 06:07:42'),
(144, 'LUM-DEMO-074859', 37, NULL, 'shipped', 0, NULL, 'BDT', 196000.00, 0.00, 0.00, 0.00, 9800.00, 0.00, 0.00, 205800.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801803628577', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-03 12:07:42', '2026-07-03 06:07:42', '2026-07-10 06:07:42'),
(145, 'LUM-DEMO-060695', 17, NULL, 'shipped', 0, NULL, 'BDT', 1342000.00, 0.00, 0.00, 0.00, 67100.00, 0.00, 0.00, 1409100.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801997535425', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-04 12:07:42', '2026-07-04 06:07:42', '2026-07-10 06:07:42'),
(146, 'LUM-DEMO-040919', 10, NULL, 'processing', 0, NULL, 'BDT', 329800.00, 0.00, 0.00, 0.00, 16490.00, 0.00, 0.00, 346290.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801309116182', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-06 12:07:42', '2026-07-06 06:07:42', '2026-07-10 06:07:42'),
(147, 'LUM-DEMO-041759', 2, NULL, 'delivered', 0, NULL, 'BDT', 1422200.00, 0.00, 0.00, 0.00, 71110.00, 0.00, 0.00, 1493310.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801651315303', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-06 12:07:42', '2026-07-06 06:07:42', '2026-07-10 06:07:42'),
(148, 'LUM-DEMO-042849', 11, NULL, 'processing', 0, NULL, 'BDT', 745000.00, 0.00, 0.00, 0.00, 37250.00, 0.00, 0.00, 782250.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801840618458', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-06 12:07:42', '2026-07-06 06:07:42', '2026-07-10 06:07:42'),
(149, 'LUM-DEMO-030819', 5, NULL, 'shipped', 0, NULL, 'BDT', 186000.00, 0.00, 0.00, 0.00, 9300.00, 0.00, 0.00, 195300.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801591377890', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-07 12:07:42', '2026-07-07 06:07:42', '2026-07-10 06:07:42'),
(150, 'LUM-DEMO-010580', 10, NULL, 'cancelled', 0, NULL, 'BDT', 486000.00, 0.00, 0.00, 0.00, 24300.00, 0.00, 0.00, 510300.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801638666027', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-09 12:07:42', '2026-07-09 06:07:42', '2026-07-10 06:07:42'),
(151, 'LUM-DEMO-000909', 22, NULL, 'confirmed', 0, NULL, 'BDT', 793400.00, 0.00, 0.00, 0.00, 39670.00, 0.00, 0.00, 833070.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801610059172', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-10 12:07:42', '2026-07-10 06:07:42', '2026-07-12 19:29:02'),
(152, 'LUM-DEMO-001101', 8, NULL, 'delivered', 0, NULL, 'BDT', 428000.00, 0.00, 0.00, 0.00, 21400.00, 0.00, 0.00, 449400.00, 'cod', 'pending', NULL, NULL, 'Demo Customer', '+8801994131693', NULL, NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-10 12:07:42', '2026-07-10 06:07:42', '2026-07-10 06:07:42'),
(156, 'LUM-2026-877269', NULL, NULL, 'returned', 0, NULL, 'BDT', 223000.00, 0.00, 0.00, 0.00, 11150.00, 0.00, 0.00, 234150.00, 'cod', 'pending', NULL, NULL, 'Harum odio at eu rep', 'Ullam vero cupiditat', 'Incididunt minima ab', NULL, NULL, NULL, NULL, 'BD', NULL, 'Aspernatur rerum qui', NULL, NULL, '2026-07-11 02:21:17', '2026-07-10 20:21:17', '2026-07-12 11:23:06'),
(157, 'LUM-2026-742772', NULL, NULL, 'expired', 0, NULL, 'BDT', 16000.00, 0.00, 0.00, 0.00, 800.00, 0.00, 0.00, 16800.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853871', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh', NULL, NULL, NULL, NULL, 'BD', NULL, NULL, NULL, NULL, '2026-07-13 16:15:42', '2026-07-13 10:15:42', '2026-07-13 11:15:22');

INSERT INTO `orders` (`id`, `order_no`, `user_id`, `address_id`, `status`, `is_test`, `reserved_until`, `currency`, `subtotal`, `making_charge_total`, `stone_charge_total`, `discount_total`, `tax_total`, `tax_rate`, `shipping_total`, `grand_total`, `payment_method`, `payment_status`, `coupon_id`, `coupon_code`, `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_label`, `shipping_city`, `shipping_district`, `shipping_postcode`, `shipping_country`, `billing_address`, `customer_note`, `gift_message`, `internal_note`, `placed_at`, `created_at`, `updated_at`) VALUES
(158, 'LUM-2026-568968', NULL, NULL, 'expired', 0, NULL, 'BDT', 60000.00, 0.00, 0.00, 0.00, 3000.00, 0.00, 0.00, 63000.00, 'cod', 'pending', NULL, NULL, 'Scott Mcintosh', '01760322222', 'Tenetur dolorem offi', NULL, NULL, NULL, NULL, 'BD', NULL, 'Ullamco Nam voluptat', NULL, NULL, '2026-07-13 16:29:28', '2026-07-13 10:29:28', '2026-07-13 11:15:22'),
(162, 'LUM-2026-514280', 47, 2, 'cancelled', 0, NULL, 'BDT', 60000.00, 0.00, 0.00, 0.00, 3000.00, 5.00, 150.00, 63150.00, 'cod', 'pending', NULL, NULL, 'Maryam Dunn', '01777775538', 'Nihil iusto rerum ir, Aspernatur laborum i, Omnis et consequatur, Quam asperiores volu', 'Ipsam non culpa et e', 'Omnis et consequatur', 'Quam asperiores volu', 'Laboris eu fugit et', 'BD', NULL, 'Quia autem tenetur illum sed', 'In adipisci nisi ex perferendis delectus dolor ad neque nostrum ad eum', NULL, '2026-07-14 00:31:54', '2026-07-13 18:31:54', '2026-07-13 18:34:45'),
(168, 'LUM-2026-767017', 53, 6, 'delivered', 0, NULL, 'BDT', 50000.00, 0.00, 0.00, 0.00, 2500.00, 5.00, 150.00, 52650.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853872', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207', 'Et explicabo Pariat', 'Dhaka', 'E', '1207', 'BD', 'Robert Jojo, Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207 · 01788853872', 'Lorem culpa eligendi aliquid vel corporis fugiat voluptas consectetur', 'Quam autem est similique qui recusandae Quibusdam', NULL, '2026-07-14 02:49:27', '2026-07-13 20:49:27', '2026-07-13 23:25:39'),
(170, 'LUM-2026-343078', 53, 6, 'pending', 0, NULL, 'BDT', 100000.00, 0.00, 0.00, 0.00, 5000.00, 5.00, 0.00, 105000.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853872', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207', 'Et explicabo Pariat', 'Dhaka', 'E', '1207', 'BD', 'Robert Jojo, Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207 · 01788853872', NULL, NULL, NULL, '2026-07-14 07:09:03', '2026-07-14 01:09:03', '2026-07-14 01:09:03'),
(171, 'LUM-2026-203166', 53, 6, 'pending', 0, NULL, 'BDT', 60000.00, 0.00, 0.00, 0.00, 3000.00, 5.00, 150.00, 63150.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853872', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207', 'Et explicabo Pariat', 'Dhaka', 'E', '1207', 'BD', 'Robert Jojo, Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207 · 01788853872', NULL, NULL, NULL, '2026-07-14 07:23:23', '2026-07-14 01:23:23', '2026-07-14 01:23:23'),
(172, 'LUM-2026-502121', 53, 6, 'cancelled', 0, NULL, 'BDT', 51797.00, 0.00, 0.00, 0.00, 2590.00, 5.00, 150.00, 54537.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853872', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207', 'Et explicabo Pariat', 'Dhaka', 'E', '1207', 'BD', 'Robert Jojo, Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207 · 01788853872', NULL, NULL, NULL, '2026-07-14 07:28:22', '2026-07-14 01:28:22', '2026-07-14 01:28:34'),
(173, 'LUM-2026-393312', 53, 6, 'pending', 0, NULL, 'BDT', 100000.00, 0.00, 0.00, 0.00, 5000.00, 5.00, 0.00, 105000.00, 'cod', 'pending', NULL, NULL, 'Robert Jojo', '01788853872', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207', 'Et explicabo Pariat', 'Dhaka', 'E', '1207', 'BD', 'Robert Jojo, Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Facere natus veritat, Dhaka, E, 1207 · 01788853872', NULL, NULL, NULL, '2026-07-14 17:59:53', '2026-07-14 11:59:53', '2026-07-14 11:59:53'),
(179, 'LUM-2026-751325', 53, 7, 'refunded', 0, NULL, 'BDT', 495000.00, 0.00, 0.00, 0.00, 24750.00, 5.00, 0.00, 519750.00, 'cod', 'pending', NULL, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207', NULL, 'ঢাকা', NULL, '1207', 'BD', 'American International University-Bangladesh (Dhaka), R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207 · 01725154222', NULL, NULL, NULL, '2026-07-14 23:05:51', '2026-07-14 17:05:51', '2026-07-14 17:09:34'),
(180, 'LUM-2026-123435', 53, 7, 'confirmed', 0, NULL, 'BDT', 1190000.00, 0.00, 0.00, 0.00, 59500.00, 5.00, 0.00, 1249500.00, 'cod', 'pending', NULL, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207', NULL, 'ঢাকা', NULL, '1207', 'BD', 'American International University-Bangladesh (Dhaka), R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207 · 01725154222', NULL, NULL, NULL, '2026-07-14 23:12:03', '2026-07-14 17:12:03', '2026-07-14 17:16:09'),
(183, 'LUM-2026-511911', 53, 7, 'pending', 0, NULL, 'BDT', 10000.00, 0.00, 0.00, 0.00, 500.00, 5.00, 150.00, 10650.00, 'cod', 'pending', NULL, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207', NULL, 'ঢাকা', NULL, '1207', 'BD', 'American International University-Bangladesh (Dhaka), R9CV+W8R, মাটিকাটা রোড, ঢাকা, 1207 · 01725154222', NULL, NULL, NULL, '2026-07-15 15:08:31', '2026-07-15 09:08:31', '2026-07-15 09:08:31'),
(184, 'LUM-2026-883021', 56, 8, 'confirmed', 0, NULL, 'BDT', 20000.00, 0.00, 0.00, 0.00, 1000.00, 5.00, 150.00, 21150.00, 'cod', 'pending', NULL, NULL, 'American International University-Bangladesh (Dhaka)', '01725154222', 'Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Dhaka, 1207', NULL, 'Dhaka', NULL, '1207', 'BD', 'American International University-Bangladesh (Dhaka), Kuratoli, Khilkhet,Dhaka 1229, Bangladesh, Dhaka, 1207 · 01725154222', NULL, NULL, NULL, '2026-07-15 15:31:23', '2026-07-15 09:31:23', '2026-07-15 09:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_name` varchar(200) NOT NULL,
  `variant_sku` varchar(64) NOT NULL,
  `serial_number` varchar(80) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `metal` varchar(30) DEFAULT NULL,
  `purity` varchar(10) DEFAULT NULL,
  `metal_color` varchar(30) DEFAULT NULL,
  `size_label` varchar(40) DEFAULT NULL,
  `metal_weight_g` decimal(8,2) DEFAULT NULL,
  `diamond_carat` decimal(7,2) DEFAULT NULL,
  `stone_count` int(10) UNSIGNED DEFAULT NULL,
  `certificate_no` varchar(60) DEFAULT NULL,
  `certificate_issuer` varchar(30) DEFAULT NULL,
  `making_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stone_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `metal_rate` decimal(12,2) DEFAULT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `engraving` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `variant_id`, `product_name`, `variant_sku`, `serial_number`, `image_path`, `metal`, `purity`, `metal_color`, `size_label`, `metal_weight_g`, `diamond_carat`, `stone_count`, `certificate_no`, `certificate_issuer`, `making_charge`, `stone_charge`, `metal_rate`, `quantity`, `unit_price`, `line_total`, `engraving`) VALUES
(1, 1, NULL, 'Aurelle Wedding Band', 'LUM-0001-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 86500.00, 86500.00, NULL),
(2, 2, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 264000.00, 528000.00, NULL),
(3, 3, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 186000.00, 372000.00, NULL),
(4, 4, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(5, 5, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 52300.00, 52300.00, NULL),
(6, 5, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 44600.00, 89200.00, NULL),
(7, 5, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(8, 6, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 892000.00, 892000.00, NULL),
(9, 7, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(10, 7, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 386000.00, 772000.00, NULL),
(11, 8, NULL, 'Maharani Polki Ring', 'LUM-0004-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 168000.00, 336000.00, NULL),
(12, 8, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 218000.00, 218000.00, NULL),
(13, 8, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 264000.00, 264000.00, NULL),
(14, 9, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 44600.00, 89200.00, NULL),
(15, 9, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 224000.00, 448000.00, NULL),
(16, 10, NULL, 'Goutte Hoops', 'LUM-0011-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 36400.00, 72800.00, NULL),
(17, 11, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 745000.00, 745000.00, NULL),
(18, 11, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 486000.00, 972000.00, NULL),
(19, 12, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 18600.00, 18600.00, NULL),
(20, 12, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 892000.00, 1784000.00, NULL),
(21, 12, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 128500.00, 128500.00, NULL),
(22, 13, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 2260000.00, 2260000.00, NULL),
(23, 14, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(24, 14, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 685000.00, 685000.00, NULL),
(25, 14, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 745000.00, 745000.00, NULL),
(26, 15, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(27, 15, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 745000.00, 1490000.00, NULL),
(28, 16, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(29, 16, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(30, 16, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 18600.00, 18600.00, NULL),
(31, 17, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 124000.00, 248000.00, NULL),
(32, 17, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 32800.00, 65600.00, NULL),
(33, 18, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 52300.00, 104600.00, NULL),
(34, 18, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(35, 18, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 158000.00, 158000.00, NULL),
(36, 19, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(37, 20, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 58900.00, 58900.00, NULL),
(38, 21, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 52300.00, 52300.00, NULL),
(39, 21, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 892000.00, 892000.00, NULL),
(40, 21, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(41, 22, NULL, 'Halo Céleste Ring', 'LUM-0018-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 312000.00, 624000.00, NULL),
(42, 23, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 96700.00, 193400.00, NULL),
(43, 24, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(44, 24, NULL, 'Halo Céleste Ring', 'LUM-0018-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 312000.00, 312000.00, NULL),
(45, 24, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(46, 25, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 2260000.00, 2260000.00, NULL),
(47, 25, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(48, 25, NULL, 'Scintille Nose Pin', 'LUM-0029-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 28400.00, 28400.00, NULL),
(49, 26, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 32800.00, 65600.00, NULL),
(50, 26, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 18600.00, 37200.00, NULL),
(51, 26, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 685000.00, 1370000.00, NULL),
(52, 27, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 52300.00, 52300.00, NULL),
(53, 27, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 486000.00, 972000.00, NULL),
(54, 27, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(55, 28, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(56, 29, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 218000.00, 218000.00, NULL),
(57, 30, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(58, 30, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(59, 30, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 124000.00, 248000.00, NULL),
(60, 31, NULL, 'Halo Céleste Ring', 'LUM-0018-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 312000.00, 312000.00, NULL),
(61, 31, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 58900.00, 58900.00, NULL),
(62, 32, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(63, 32, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 2260000.00, 4520000.00, NULL),
(64, 32, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(65, 33, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 264000.00, 528000.00, NULL),
(66, 34, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 2260000.00, 4520000.00, NULL),
(67, 35, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(68, 35, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 745000.00, 745000.00, NULL),
(69, 35, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(70, 36, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(71, 37, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 52300.00, 104600.00, NULL),
(72, 38, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 158000.00, 158000.00, NULL),
(73, 38, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 9400.00, 18800.00, NULL),
(74, 38, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 892000.00, 1784000.00, NULL),
(75, 39, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 128500.00, 128500.00, NULL),
(76, 39, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(77, 39, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 196000.00, 196000.00, NULL),
(78, 40, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 52300.00, 104600.00, NULL),
(79, 40, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(80, 41, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(81, 42, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(82, 42, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 892000.00, 1784000.00, NULL),
(83, 42, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(84, 43, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(85, 43, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 892000.00, 1784000.00, NULL),
(86, 44, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 264000.00, 528000.00, NULL),
(87, 44, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(88, 45, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 745000.00, 1490000.00, NULL),
(89, 45, NULL, 'Maharani Polki Ring', 'LUM-0004-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 168000.00, 336000.00, NULL),
(90, 46, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(91, 46, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 685000.00, 1370000.00, NULL),
(92, 46, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 148000.00, 296000.00, NULL),
(93, 47, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 128500.00, 257000.00, NULL),
(94, 47, NULL, 'Maharani Polki Ring', 'LUM-0004-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 168000.00, 168000.00, NULL),
(95, 47, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 158000.00, 158000.00, NULL),
(96, 48, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(97, 48, NULL, 'Astre Lab Pendant', 'LUM-0026-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 84500.00, 84500.00, NULL),
(98, 49, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 486000.00, 972000.00, NULL),
(99, 49, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 9400.00, 9400.00, NULL),
(100, 49, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 685000.00, 685000.00, NULL),
(101, 50, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(102, 50, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 39800.00, 39800.00, NULL),
(103, 50, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(104, 51, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(105, 51, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(106, 52, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 39800.00, 39800.00, NULL),
(107, 52, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(108, 52, NULL, 'Aurelle Wedding Band', 'LUM-0001-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 86500.00, 173000.00, NULL),
(109, 53, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 2260000.00, 2260000.00, NULL),
(110, 53, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(111, 54, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 264000.00, 528000.00, NULL),
(112, 55, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(113, 55, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 44600.00, 89200.00, NULL),
(114, 55, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(115, 56, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 39800.00, 79600.00, NULL),
(116, 56, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 224000.00, 448000.00, NULL),
(117, 57, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(118, 57, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(119, 57, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(120, 58, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(121, 58, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 196000.00, 196000.00, NULL),
(122, 59, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 386000.00, 386000.00, NULL),
(123, 60, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(124, 60, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 9400.00, 18800.00, NULL),
(125, 60, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(126, 61, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(127, 61, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(128, 62, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 96700.00, 96700.00, NULL),
(129, 62, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 41200.00, 82400.00, NULL),
(130, 62, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 128500.00, 128500.00, NULL),
(131, 63, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 892000.00, 892000.00, NULL),
(132, 63, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 158000.00, 158000.00, NULL),
(133, 64, NULL, 'Scintille Nose Pin', 'LUM-0029-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 28400.00, 28400.00, NULL),
(134, 64, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(135, 64, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(136, 65, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 218000.00, 218000.00, NULL),
(137, 66, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 12800.00, 25600.00, NULL),
(138, 66, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 486000.00, 972000.00, NULL),
(139, 66, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 224000.00, 224000.00, NULL),
(140, 67, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 124000.00, 248000.00, NULL),
(141, 68, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 685000.00, 685000.00, NULL),
(142, 68, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(143, 68, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(144, 69, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 745000.00, 1490000.00, NULL),
(145, 69, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 224000.00, 224000.00, NULL),
(146, 69, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 685000.00, 1370000.00, NULL),
(147, 70, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(148, 70, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 224000.00, 448000.00, NULL),
(149, 71, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 58900.00, 117800.00, NULL),
(150, 71, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(151, 71, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 142000.00, 284000.00, NULL),
(152, 72, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(153, 72, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(154, 72, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(155, 73, NULL, 'Maharani Polki Ring', 'LUM-0004-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 168000.00, 168000.00, NULL),
(156, 74, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 74200.00, 148400.00, NULL),
(157, 75, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 264000.00, 264000.00, NULL),
(158, 75, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(159, 76, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 18600.00, 37200.00, NULL),
(160, 77, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(161, 77, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(162, 78, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 52300.00, 52300.00, NULL),
(163, 78, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 41200.00, 82400.00, NULL),
(164, 79, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(165, 79, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(166, 79, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 386000.00, 386000.00, NULL),
(167, 80, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 264000.00, 264000.00, NULL),
(168, 80, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 892000.00, 892000.00, NULL),
(169, 81, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(170, 81, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(171, 81, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(172, 82, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 96700.00, 193400.00, NULL),
(173, 82, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 18600.00, 18600.00, NULL),
(174, 83, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(175, 83, NULL, 'Goutte Hoops', 'LUM-0011-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 36400.00, 36400.00, NULL),
(176, 84, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(177, 84, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 348000.00, 696000.00, NULL),
(178, 84, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(179, 85, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 386000.00, 386000.00, NULL),
(180, 85, NULL, 'Astre Lab Pendant', 'LUM-0026-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 84500.00, 84500.00, NULL),
(181, 86, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 224000.00, 224000.00, NULL),
(182, 87, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 18600.00, 18600.00, NULL),
(183, 88, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 2260000.00, 4520000.00, NULL),
(184, 89, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 196000.00, 196000.00, NULL),
(185, 90, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 74200.00, 74200.00, NULL),
(186, 91, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(187, 91, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 128500.00, 257000.00, NULL),
(188, 92, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 224000.00, 224000.00, NULL),
(189, 93, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 58900.00, 117800.00, NULL),
(190, 93, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 32800.00, 65600.00, NULL),
(191, 94, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(192, 94, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 128500.00, 128500.00, NULL),
(193, 94, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 44600.00, 89200.00, NULL),
(194, 95, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 892000.00, 1784000.00, NULL),
(195, 96, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(196, 97, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 745000.00, 1490000.00, NULL),
(197, 97, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 745000.00, 1490000.00, NULL),
(198, 97, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 124000.00, 248000.00, NULL),
(199, 98, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(200, 98, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 386000.00, 386000.00, NULL),
(201, 98, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(202, 99, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 745000.00, 745000.00, NULL),
(203, 99, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 148000.00, 296000.00, NULL),
(204, 100, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(205, 100, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 218000.00, 218000.00, NULL),
(206, 100, NULL, 'Astre Lab Pendant', 'LUM-0026-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 84500.00, 169000.00, NULL),
(207, 101, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 39800.00, 79600.00, NULL),
(208, 101, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 186000.00, 372000.00, NULL),
(209, 101, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 158000.00, 316000.00, NULL),
(210, 102, NULL, 'Argent Cuff', 'LUM-0034-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 18600.00, 37200.00, NULL),
(211, 103, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 96700.00, 193400.00, NULL),
(212, 103, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(213, 103, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(214, 104, NULL, 'Scintille Nose Pin', 'LUM-0029-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 28400.00, 28400.00, NULL),
(215, 104, NULL, 'Astre Lab Pendant', 'LUM-0026-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 84500.00, 169000.00, NULL),
(216, 104, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(217, 105, NULL, 'Maharani Polki Ring', 'LUM-0004-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 168000.00, 336000.00, NULL),
(218, 105, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(219, 105, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(220, 106, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(221, 107, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(222, 107, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(223, 108, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 224000.00, 448000.00, NULL),
(224, 109, NULL, 'Nikkah Bridal Set', 'LUM-0036-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 892000.00, 892000.00, NULL),
(225, 109, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 2260000.00, 2260000.00, NULL),
(226, 109, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 96700.00, 96700.00, NULL),
(227, 110, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(228, 111, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(229, 112, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(230, 112, NULL, 'Goutte Hoops', 'LUM-0011-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 36400.00, 72800.00, NULL),
(231, 113, NULL, 'Aurelle Wedding Band', 'LUM-0001-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 86500.00, 173000.00, NULL),
(232, 114, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 74200.00, 148400.00, NULL),
(233, 115, NULL, 'Halo Céleste Ring', 'LUM-0018-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 312000.00, 624000.00, NULL),
(234, 115, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 9400.00, 18800.00, NULL),
(235, 116, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 9400.00, 18800.00, NULL),
(236, 116, NULL, 'Lien Bracelet Homme', 'LUM-0015-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 52300.00, 52300.00, NULL),
(237, 117, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(238, 118, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 74200.00, 74200.00, NULL),
(239, 119, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 685000.00, 1370000.00, NULL),
(240, 119, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(241, 120, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(242, 120, NULL, 'Aurelle Wedding Band', 'LUM-0001-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 86500.00, 86500.00, NULL),
(243, 121, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(244, 121, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 58900.00, 58900.00, NULL),
(245, 121, NULL, 'Voile Bridal Earrings', 'LUM-0037-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(246, 122, NULL, 'Platine Union Bands', 'LUM-0032-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 158000.00, 316000.00, NULL),
(247, 122, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(248, 122, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 96700.00, 193400.00, NULL),
(249, 123, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 39800.00, 79600.00, NULL),
(250, 123, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(251, 124, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 348000.00, 348000.00, NULL),
(252, 124, NULL, 'Halo Céleste Ring', 'LUM-0018-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 312000.00, 312000.00, NULL),
(253, 125, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(254, 125, NULL, 'Astre Lab Pendant', 'LUM-0026-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 84500.00, 84500.00, NULL),
(255, 126, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 12800.00, 12800.00, NULL),
(256, 127, NULL, 'Goutte Hoops', 'LUM-0011-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 36400.00, 72800.00, NULL),
(257, 127, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL),
(258, 127, NULL, 'Rivière Éternelle', 'LUM-0022-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 2260000.00, 2260000.00, NULL),
(259, 128, NULL, 'Petit Or Ring', 'LUM-0003-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 32800.00, 32800.00, NULL),
(260, 128, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(261, 129, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 74200.00, 148400.00, NULL),
(262, 129, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 12800.00, 25600.00, NULL),
(263, 130, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 148000.00, 148000.00, NULL),
(264, 130, NULL, 'Séraphine Signet', 'LUM-0002-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 74200.00, 148400.00, NULL),
(265, 130, NULL, 'Lueur Studs', 'LUM-0024-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 264000.00, 528000.00, NULL),
(266, 131, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(267, 132, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 44600.00, 44600.00, NULL),
(268, 132, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(269, 132, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 124000.00, 124000.00, NULL),
(270, 133, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(271, 133, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(272, 134, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 148000.00, 296000.00, NULL),
(273, 135, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(274, 135, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 96700.00, 96700.00, NULL),
(275, 135, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 348000.00, 696000.00, NULL),
(276, 136, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(277, 136, NULL, 'Noor Bangle Pair', 'LUM-0012-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 218000.00, 436000.00, NULL),
(278, 136, NULL, 'Vintage Portrait Locket', 'LUM-0030-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 124000.00, 248000.00, NULL),
(279, 137, NULL, 'Éclat Vert Ring', 'LUM-0020-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 148000.00, 296000.00, NULL),
(280, 137, NULL, 'Kada Étoilée', 'LUM-0028-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 386000.00, 772000.00, NULL),
(281, 138, NULL, 'Cœur Locket', 'LUM-0008-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 58900.00, 117800.00, NULL),
(282, 139, NULL, 'Étoile Pendant', 'LUM-0009-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 39800.00, 39800.00, NULL),
(283, 140, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 128500.00, 257000.00, NULL),
(284, 141, NULL, 'Monsieur Diamond Band', 'LUM-0021-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 224000.00, 448000.00, NULL),
(285, 141, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 348000.00, 696000.00, NULL),
(286, 141, NULL, 'Aurelle Wedding Band', 'LUM-0001-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 86500.00, 86500.00, NULL),
(287, 142, NULL, 'Kiran Nose Pin', 'LUM-0016-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 12800.00, 25600.00, NULL),
(288, 142, NULL, 'Jhumka Royale', 'LUM-0010-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 142000.00, 142000.00, NULL),
(289, 143, NULL, 'Héritage Rani Haar', 'LUM-0005-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(290, 143, NULL, 'Maille Bracelet', 'LUM-0014-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 96700.00, 193400.00, NULL),
(291, 144, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 196000.00, 196000.00, NULL),
(292, 145, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 428000.00, 856000.00, NULL),
(293, 145, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(294, 146, NULL, 'Lumière Box Chain', 'LUM-0006-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 128500.00, 257000.00, NULL),
(295, 146, NULL, 'Goutte Hoops', 'LUM-0011-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 36400.00, 72800.00, NULL),
(296, 147, NULL, 'Première Baby Bangle', 'LUM-0013-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 41200.00, 41200.00, NULL),
(297, 147, NULL, 'Halo Nuit Earrings', 'LUM-0025-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 348000.00, 696000.00, NULL),
(298, 147, NULL, 'L\'Éclat Solitaire', 'LUM-0017-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 685000.00, 685000.00, NULL),
(299, 148, NULL, 'Ligne Tennis Bracelet', 'LUM-0027-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 745000.00, 745000.00, NULL),
(300, 149, NULL, 'Solitaire Drop Pendant', 'LUM-0023-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 186000.00, 186000.00, NULL);

INSERT INTO `order_items` (`id`, `order_id`, `variant_id`, `product_name`, `variant_sku`, `serial_number`, `image_path`, `metal`, `purity`, `metal_color`, `size_label`, `metal_weight_g`, `diamond_carat`, `stone_count`, `certificate_no`, `certificate_issuer`, `making_charge`, `stone_charge`, `metal_rate`, `quantity`, `unit_price`, `line_total`, `engraving`) VALUES
(301, 150, NULL, 'Platine Solitaire', 'LUM-0033-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 486000.00, 486000.00, NULL),
(302, 151, NULL, 'Argent Charm Chain', 'LUM-0035-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 9400.00, 9400.00, NULL),
(303, 151, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(304, 151, NULL, 'Éclat Station Chain', 'LUM-0031-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 196000.00, 392000.00, NULL),
(305, 152, NULL, 'Soirée Cocktail Ring', 'LUM-0019-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 428000.00, 428000.00, NULL),
(309, 156, NULL, 'Fil d’Or Chain', 'LUM-0007-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 5, 44600.00, 223000.00, NULL),
(310, 157, 64, 'Diamond Ring (PT950, Size 7)', 'LUM-0009-PT950-5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 16000.00, 16000.00, NULL),
(311, 158, 87, 'Gold Ring (24K, Size 6)', 'LUM-0011-24K-5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 60000.00, 60000.00, NULL),
(315, 162, 88, 'Gold Ring', 'LUM-0011-24K-6', NULL, '/uploads/products/LUM-0011/large/3.jpg', 'Gold', '24K', 'Yellow Gold', '6', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 60000.00, 60000.00, NULL),
(321, 168, 45, 'Sitahar', 'LUM-0003-01', NULL, '/uploads/products/LUM-0003/large/3.jpg', 'Gold', '21K', 'Yellow Gold', NULL, 4.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 50000.00, 50000.00, NULL),
(323, 170, 108, 'Full Bridal Set', 'LUM-0016-24K', NULL, '/uploads/products/LUM-0016/large/3.jpg', 'Gold', '24K', 'Yellow Gold', NULL, 50.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 100000.00, 100000.00, NULL),
(324, 171, 88, 'Gold Ring', 'LUM-0011-24K-6', NULL, '/uploads/products/LUM-0011/large/3.jpg', 'Gold', '24K', 'Yellow Gold', '6', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 60000.00, 60000.00, NULL),
(325, 172, 104, 'Diamond Necklace', 'LUM-0014-S925-20 inch', NULL, '/uploads/products/LUM-0014/large/3.jpg', 'Platinum', 'S925', NULL, '20 inch', 5.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 51797.00, 51797.00, NULL),
(326, 173, 108, 'Full Bridal Set', 'LUM-0016-24K', NULL, '/uploads/products/LUM-0016/large/3.jpg', 'Gold', '24K', 'Yellow Gold', NULL, 50.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 100000.00, 100000.00, NULL),
(328, 179, 107, 'Diamond Chain', 'LUM-0015-PT950-18 inch', NULL, '/uploads/products/LUM-0015/large/3.jpg', 'Platinum', 'PT950', NULL, '18 inch', 10.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 495000.00, 495000.00, NULL),
(329, 180, 106, 'Diamond Chain', 'LUM-0015-PT950-16 inch', NULL, '/uploads/products/LUM-0015/large/3.jpg', 'Platinum', 'PT950', NULL, '16 inch', 10.00, 12.00, 30, NULL, NULL, 0.00, 0.00, NULL, 1, 450000.00, 450000.00, NULL),
(330, 180, 46, 'Bangles', 'LUM-0004-01', NULL, '/uploads/products/LUM-0004/large/3.jpg', 'Gold', '22K', NULL, NULL, 5.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 2, 40000.00, 80000.00, NULL),
(331, 180, 108, 'Full Bridal Set', 'LUM-0016-24K', NULL, '/uploads/products/LUM-0016/large/3.jpg', 'Gold', '24K', 'Yellow Gold', NULL, 50.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 100000.00, 100000.00, NULL),
(332, 180, 45, 'Sitahar', 'LUM-0003-01', NULL, '/uploads/products/LUM-0003/large/3.jpg', 'Gold', '21K', 'Yellow Gold', NULL, 4.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 50000.00, 50000.00, NULL),
(333, 180, 88, 'Gold Ring', 'LUM-0011-24K-6', NULL, '/uploads/products/LUM-0011/large/3.jpg', 'Gold', '24K', 'Yellow Gold', '6', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 60000.00, 60000.00, NULL),
(334, 180, 97, 'Diamond Nosepin', 'LUM-0013-S925', NULL, '/uploads/products/LUM-0013/large/3.jpg', 'Platinum', 'S925', NULL, NULL, 12.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 50000.00, 50000.00, NULL),
(335, 180, 92, 'Diamond bangles', 'LUM-0012-PT950-2.4', NULL, '/uploads/products/LUM-0012/large/3.jpg', 'Platinum', 'PT950', NULL, '2.4', 2.00, 5.00, 5, NULL, NULL, 0.00, 0.00, NULL, 1, 400000.00, 400000.00, NULL),
(336, 183, 48, 'Chain', 'LUM-0005-01', NULL, '/uploads/products/LUM-0005/large/2.jpg', 'Gold', '24K', 'Yellow Gold', '16 inch', 5.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 10000.00, 10000.00, NULL),
(337, 184, 44, 'Earring', 'LUM-0002-01', NULL, '/uploads/products/LUM-0002/large/3.jpg', 'Gold', '22K', 'Yellow Gold', NULL, 2.00, NULL, NULL, NULL, NULL, 0.00, 0.00, NULL, 1, 20000.00, 20000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` varchar(30) DEFAULT NULL,
  `to_status` varchar(30) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `changed_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `from_status`, `to_status`, `note`, `changed_by`, `created_at`) VALUES
(1, 1, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-09 11:20:01'),
(6, 156, NULL, 'reserved', 'booked via storefront — awaiting phone confirmation', NULL, '2026-07-10 20:21:17'),
(7, 156, 'reserved', 'expired', 'hold expired — not confirmed in time', NULL, '2026-07-11 04:19:51'),
(8, 156, 'expired', 'returned', 'bulk update from admin panel', NULL, '2026-07-12 11:23:06'),
(9, 151, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-12 19:29:02'),
(10, 157, NULL, 'reserved', 'booked via storefront — awaiting phone confirmation', NULL, '2026-07-13 10:15:42'),
(11, 158, NULL, 'reserved', 'booked via storefront — awaiting phone confirmation', NULL, '2026-07-13 10:29:28'),
(13, 157, 'reserved', 'expired', 'hold expired — not confirmed in time', NULL, '2026-07-13 11:15:22'),
(14, 158, 'reserved', 'expired', 'hold expired — not confirmed in time', NULL, '2026-07-13 11:15:22'),
(18, 162, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-13 18:31:54'),
(19, 162, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-13 18:33:49'),
(20, 162, 'confirmed', 'pending', 'changed from admin panel', NULL, '2026-07-13 18:34:15'),
(21, 162, 'pending', 'cancelled', 'changed from admin panel', NULL, '2026-07-13 18:34:45'),
(27, 168, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-13 20:49:27'),
(28, 168, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-13 20:50:28'),
(31, 168, 'confirmed', 'delivered', 'changed from admin panel', NULL, '2026-07-13 23:25:39'),
(32, 170, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 01:09:03'),
(33, 171, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 01:23:23'),
(34, 172, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 01:28:22'),
(35, 172, 'pending', 'cancelled', 'cancelled by customer', NULL, '2026-07-14 01:28:34'),
(36, 173, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 11:59:53'),
(37, 179, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 17:05:51'),
(38, 179, 'pending', 'crafting', 'changed from admin panel', NULL, '2026-07-14 17:06:42'),
(39, 179, 'crafting', 'diamond_setting', 'changed from admin panel', NULL, '2026-07-14 17:06:52'),
(40, 179, 'diamond_setting', 'out_for_delivery', 'changed from admin panel', NULL, '2026-07-14 17:09:16'),
(41, 179, 'out_for_delivery', 'refunded', 'changed from admin panel', NULL, '2026-07-14 17:09:34'),
(42, 180, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-14 17:12:03'),
(43, 180, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-14 17:16:09'),
(44, 183, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-15 09:08:31'),
(45, 184, NULL, 'pending', 'placed on the storefront', NULL, '2026-07-15 09:31:23'),
(46, 184, 'pending', 'confirmed', 'changed from admin panel', NULL, '2026-07-15 09:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `body` mediumtext DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `method` enum('cod','bkash','nagad','rocket','card','bank_transfer','emi') NOT NULL,
  `type` enum('payment','refund') NOT NULL DEFAULT 'payment',
  `status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  `amount` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `gateway_txn_id` varchar(120) DEFAULT NULL,
  `gateway_payload` text DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_transactions`
--

INSERT INTO `payment_transactions` (`id`, `order_id`, `method`, `type`, `status`, `amount`, `currency`, `gateway_txn_id`, `gateway_payload`, `processed_at`, `created_at`) VALUES
(2, 162, 'cod', 'payment', 'pending', 63150.00, 'BDT', NULL, NULL, NULL, '2026-07-13 18:31:54'),
(4, 168, 'cod', 'payment', 'pending', 52650.00, 'BDT', NULL, NULL, NULL, '2026-07-13 20:49:27'),
(5, 170, 'cod', 'payment', 'pending', 105000.00, 'BDT', NULL, NULL, NULL, '2026-07-14 01:09:03'),
(6, 171, 'cod', 'payment', 'pending', 63150.00, 'BDT', NULL, NULL, NULL, '2026-07-14 01:23:23'),
(7, 172, 'cod', 'payment', 'cancelled', 54537.00, 'BDT', NULL, NULL, NULL, '2026-07-14 01:28:22'),
(8, 173, 'cod', 'payment', 'pending', 105000.00, 'BDT', NULL, NULL, NULL, '2026-07-14 11:59:53'),
(9, 179, 'cod', 'payment', 'pending', 519750.00, 'BDT', NULL, NULL, NULL, '2026-07-14 17:05:51'),
(10, 180, 'cod', 'payment', 'pending', 1249500.00, 'BDT', NULL, NULL, NULL, '2026-07-14 17:12:03'),
(11, 183, 'cod', 'payment', 'pending', 10650.00, 'BDT', NULL, NULL, NULL, '2026-07-15 09:08:31'),
(12, 184, 'cod', 'payment', 'pending', 21150.00, 'BDT', NULL, NULL, NULL, '2026-07-15 09:31:23');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `code` varchar(80) NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `code`, `name`) VALUES
(1, 'products.manage', 'Manage products'),
(2, 'rates.update', 'Update metal rates'),
(3, 'inventory.adjust', 'Adjust inventory'),
(4, 'orders.manage', 'Manage orders'),
(5, 'discounts.approve', 'Approve discounts'),
(6, 'cms.manage', 'Manage CMS content'),
(7, 'admin.manage', 'Manage admin users');

-- --------------------------------------------------------

--
-- Table structure for table `price_history`
--

CREATE TABLE `price_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'BDT',
  `effective_at` datetime NOT NULL,
  `reason` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `price_history`
--

INSERT INTO `price_history` (`id`, `variant_id`, `price`, `sale_price`, `currency`, `effective_at`, `reason`) VALUES
(45, 43, 100000.00, NULL, 'BDT', '2026-07-12 21:08:08', 'admin edit'),
(46, 44, 20000.00, NULL, 'BDT', '2026-07-12 22:13:30', 'admin edit'),
(47, 45, 50000.00, NULL, 'BDT', '2026-07-12 22:29:45', 'admin edit'),
(48, 46, 40000.00, NULL, 'BDT', '2026-07-12 22:37:20', 'admin edit'),
(50, 48, 20000.00, 10000.00, 'BDT', '2026-07-12 22:48:47', 'admin edit'),
(51, 45, 50000.00, NULL, 'BDT', '2026-07-12 22:49:58', 'admin edit'),
(52, 48, 20000.00, 10000.00, 'BDT', '2026-07-12 22:50:45', 'admin edit'),
(53, 48, 20000.00, 10000.00, 'BDT', '2026-07-12 22:51:14', 'admin edit'),
(66, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:46:56', 'admin edit'),
(67, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:46:56', 'admin edit'),
(68, 57, 4500.00, NULL, 'BDT', '2026-07-13 00:46:56', 'admin edit'),
(69, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:46:56', 'admin edit'),
(70, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:48:26', 'admin edit'),
(71, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:48:26', 'admin edit'),
(72, 57, 4500.00, NULL, 'BDT', '2026-07-13 00:48:26', 'admin edit'),
(73, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:48:26', 'admin edit'),
(74, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:49:59', 'admin edit'),
(75, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:49:59', 'admin edit'),
(76, 57, 45000.00, NULL, 'BDT', '2026-07-13 00:49:59', 'admin edit'),
(77, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:49:59', 'admin edit'),
(78, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:50:03', 'admin edit'),
(79, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:50:03', 'admin edit'),
(80, 57, 45000.00, NULL, 'BDT', '2026-07-13 00:50:03', 'admin edit'),
(81, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:50:03', 'admin edit'),
(82, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:50:44', 'admin edit'),
(83, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:50:44', 'admin edit'),
(84, 57, 45000.00, NULL, 'BDT', '2026-07-13 00:50:44', 'admin edit'),
(85, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:50:44', 'admin edit'),
(86, 59, 80000.00, NULL, 'BDT', '2026-07-13 00:50:44', 'admin edit'),
(87, 55, 43000.00, NULL, 'BDT', '2026-07-13 00:54:55', 'admin edit'),
(88, 56, 44000.00, NULL, 'BDT', '2026-07-13 00:54:55', 'admin edit'),
(89, 57, 45000.00, NULL, 'BDT', '2026-07-13 00:54:55', 'admin edit'),
(90, 58, 50000.00, NULL, 'BDT', '2026-07-13 00:54:55', 'admin edit'),
(91, 59, 80000.00, NULL, 'BDT', '2026-07-13 00:54:55', 'admin edit'),
(92, 46, 40000.00, NULL, 'BDT', '2026-07-13 00:55:01', 'admin edit'),
(93, 45, 50000.00, NULL, 'BDT', '2026-07-13 00:57:18', 'admin edit'),
(94, 60, 70000.00, NULL, 'BDT', '2026-07-13 00:57:18', 'admin edit'),
(95, 61, 80000.00, NULL, 'BDT', '2026-07-13 00:57:18', 'admin edit'),
(96, 62, 150000.00, NULL, 'BDT', '2026-07-13 01:28:18', 'admin edit'),
(97, 63, 140000.00, NULL, 'BDT', '2026-07-13 01:28:18', 'admin edit'),
(98, 64, 10000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(99, 65, 15000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(100, 66, 16000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(101, 67, 17000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(102, 68, 18000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(103, 69, 19000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(104, 70, 20000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(105, 71, 21000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(106, 72, 22000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(107, 73, 23000.00, NULL, 'BDT', '2026-07-13 01:33:59', 'admin edit'),
(108, 55, 43000.00, NULL, 'BDT', '2026-07-13 01:34:54', 'admin edit'),
(109, 56, 44000.00, NULL, 'BDT', '2026-07-13 01:34:54', 'admin edit'),
(110, 57, 45000.00, NULL, 'BDT', '2026-07-13 01:34:54', 'admin edit'),
(111, 58, 50000.00, NULL, 'BDT', '2026-07-13 01:34:54', 'admin edit'),
(112, 59, 80000.00, NULL, 'BDT', '2026-07-13 01:34:54', 'admin edit'),
(113, 64, 10000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(114, 65, 15000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(115, 66, 16000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(116, 67, 17000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(117, 68, 18000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(118, 69, 19000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(119, 70, 20000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(120, 71, 21000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(121, 72, 22000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(122, 73, 23000.00, NULL, 'BDT', '2026-07-13 01:42:13', 'admin edit'),
(123, 74, 30000.00, NULL, 'BDT', '2026-07-13 01:46:31', 'admin edit'),
(126, 46, 40000.00, NULL, 'BDT', '2026-07-13 02:42:07', 'admin edit'),
(127, 74, 30000.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(128, 77, 35000.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(129, 78, 36000.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(130, 79, 35007.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(131, 80, 35008.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(132, 81, 35009.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(133, 82, 35010.00, NULL, 'BDT', '2026-07-13 14:17:39', 'admin edit'),
(138, 87, 50000.00, NULL, 'BDT', '2026-07-13 15:31:21', 'admin edit'),
(139, 88, 60000.00, NULL, 'BDT', '2026-07-13 15:31:21', 'admin edit'),
(140, 89, 70000.00, NULL, 'BDT', '2026-07-13 15:31:21', 'admin edit'),
(141, 90, 80000.00, NULL, 'BDT', '2026-07-13 15:31:21', 'admin edit'),
(142, 46, 40000.00, NULL, 'BDT', '2026-07-13 15:34:49', 'admin edit'),
(143, 74, 30000.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(144, 77, 35000.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(145, 78, 36000.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(146, 79, 35007.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(147, 80, 35008.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(148, 81, 35009.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(149, 82, 35010.00, NULL, 'BDT', '2026-07-13 16:02:50', 'admin edit'),
(151, 46, 40000.00, NULL, 'BDT', '2026-07-13 16:08:05', 'admin edit'),
(152, 92, 400000.00, NULL, 'BDT', '2026-07-13 17:56:22', 'admin edit'),
(153, 93, 500000.00, NULL, 'BDT', '2026-07-13 17:56:22', 'admin edit'),
(154, 94, 600000.00, NULL, 'BDT', '2026-07-13 17:56:22', 'admin edit'),
(155, 95, 70000.00, NULL, 'BDT', '2026-07-13 17:56:22', 'admin edit'),
(156, 96, 53000.00, NULL, 'BDT', '2026-07-14 04:13:38', 'admin edit'),
(157, 97, 50000.00, NULL, 'BDT', '2026-07-14 04:13:38', 'admin edit'),
(158, 96, 53000.00, NULL, 'BDT', '2026-07-14 04:15:27', 'admin edit'),
(159, 97, 50000.00, NULL, 'BDT', '2026-07-14 04:15:27', 'admin edit'),
(160, 98, 40000.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(161, 99, 42000.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(162, 100, 42400.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(163, 101, 42800.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(164, 102, 43200.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(165, 103, 47088.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(166, 104, 51797.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(167, 105, 57495.00, NULL, 'BDT', '2026-07-14 04:20:26', 'admin edit'),
(168, 106, 450000.00, NULL, 'BDT', '2026-07-14 04:48:27', 'admin edit'),
(169, 107, 495000.00, NULL, 'BDT', '2026-07-14 04:48:27', 'admin edit'),
(170, 92, 400000.00, NULL, 'BDT', '2026-07-14 04:50:11', 'admin edit'),
(171, 93, 500000.00, NULL, 'BDT', '2026-07-14 04:50:11', 'admin edit'),
(172, 94, 600000.00, NULL, 'BDT', '2026-07-14 04:50:12', 'admin edit'),
(173, 95, 70000.00, NULL, 'BDT', '2026-07-14 04:50:12', 'admin edit'),
(174, 74, 30000.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(175, 77, 35000.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(176, 78, 36000.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(177, 79, 35007.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(178, 80, 35008.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(179, 81, 35009.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(180, 82, 35010.00, NULL, 'BDT', '2026-07-14 04:50:26', 'admin edit'),
(181, 108, 100000.00, NULL, 'BDT', '2026-07-14 04:53:46', 'admin edit'),
(182, 109, 880000.00, NULL, 'BDT', '2026-07-14 04:53:46', 'admin edit'),
(183, 110, 774400.00, NULL, 'BDT', '2026-07-14 04:53:46', 'admin edit'),
(184, 106, 450000.00, NULL, 'BDT', '2026-07-14 05:15:22', 'admin edit'),
(185, 107, 495000.00, NULL, 'BDT', '2026-07-14 05:15:22', 'admin edit'),
(186, 64, 10000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(187, 65, 15000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(188, 66, 16000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(189, 67, 17000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(190, 68, 18000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(191, 69, 19000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(192, 70, 20000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(193, 71, 21000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(194, 72, 22000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(195, 73, 23000.00, NULL, 'BDT', '2026-07-14 05:35:07', 'admin edit'),
(196, 106, 450000.00, NULL, 'BDT', '2026-07-14 05:49:36', 'admin edit'),
(197, 107, 495000.00, NULL, 'BDT', '2026-07-14 05:49:36', 'admin edit'),
(198, 46, 40000.00, NULL, 'BDT', '2026-07-14 16:32:41', 'admin edit'),
(199, 46, 40000.00, NULL, 'BDT', '2026-07-14 16:33:00', 'admin edit'),
(200, 44, 20000.00, NULL, 'BDT', '2026-07-15 15:24:58', 'admin edit'),
(201, 44, 20000.00, NULL, 'BDT', '2026-07-15 15:25:11', 'admin edit'),
(202, 45, 50000.00, NULL, 'BDT', '2026-07-15 15:25:22', 'admin edit'),
(203, 60, 70000.00, NULL, 'BDT', '2026-07-15 15:25:22', 'admin edit'),
(204, 61, 80000.00, NULL, 'BDT', '2026-07-15 15:25:22', 'admin edit'),
(205, 87, 50000.00, NULL, 'BDT', '2026-07-15 15:25:56', 'admin edit'),
(206, 88, 60000.00, NULL, 'BDT', '2026-07-15 15:25:56', 'admin edit'),
(207, 89, 70000.00, NULL, 'BDT', '2026-07-15 15:25:56', 'admin edit'),
(208, 90, 80000.00, NULL, 'BDT', '2026-07-15 15:25:56', 'admin edit');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(64) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `name` varchar(200) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `brand_id` int(10) UNSIGNED DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `care_instructions` text DEFAULT NULL,
  `status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `slug`, `name`, `short_description`, `description`, `brand_id`, `video_url`, `care_instructions`, `status`, `is_featured`, `is_new_arrival`, `is_best_seller`, `created_at`, `updated_at`) VALUES
(45, 'LUM-0001', 'gold-ring', 'Gold Ring', 'Gold Ring For Woman', 'Gold Ring For Woman', NULL, NULL, NULL, 'active', 1, 1, 0, '2026-07-12 15:08:08', '2026-07-14 16:10:46'),
(46, 'LUM-0002', 'earring', 'Earring', 'Gold Woman Earrings', 'Gold Woman Earrings', NULL, NULL, NULL, 'active', 1, 1, 0, '2026-07-12 16:13:30', '2026-07-13 22:21:54'),
(47, 'LUM-0003', 'sitahar', 'Sitahar', 'Woman Gold Sitahar', 'Woman Gold Sitahar', NULL, NULL, NULL, 'active', 1, 1, 0, '2026-07-12 16:29:45', '2026-07-13 22:21:54'),
(48, 'LUM-0004', 'bangles', 'Bangles', 'Woman Bangles', 'Woman Bangles', NULL, NULL, NULL, 'active', 1, 1, 0, '2026-07-12 16:37:20', '2026-07-14 10:59:51'),
(50, 'LUM-0005', 'chain', 'Chain', 'Woman Chain', 'Woman Chain', NULL, NULL, NULL, 'active', 0, 1, 0, '2026-07-12 16:48:46', '2026-07-13 22:32:55'),
(52, 'LUM-0007', 'white-gold-rings', 'White Gold Rings', 'White Ring For Woman', 'White Ring For Woman', NULL, NULL, NULL, 'draft', 0, 1, 0, '2026-07-12 17:23:47', '2026-07-13 22:50:44'),
(54, 'LUM-0008', 'diamond-bracelets', 'Diamond Bracelets', 'Luxury Diamond Bracelet for Woman', 'Luxury Diamond Bracelet for Woman', NULL, NULL, NULL, 'active', 0, 1, 0, '2026-07-12 19:28:18', '2026-07-12 19:28:18'),
(55, 'LUM-0009', 'diamond-ring', 'Diamond Ring', 'Diamond Ring For Woman', 'Diamond Ring For Woman', NULL, NULL, NULL, 'active', 0, 1, 0, '2026-07-12 19:33:59', '2026-07-12 19:33:59'),
(56, 'LUM-0010', 'diamon-earrings', 'Diamon Earrings', 'Woman Earings ', 'Woman Earings ', NULL, NULL, NULL, 'active', 0, 1, 0, '2026-07-12 19:46:31', '2026-07-13 22:32:55'),
(63, 'LUM-0011', 'gold-ring-2', 'Gold Ring', 'Woman Gold Ring', 'Woman Gold Ring', NULL, NULL, NULL, 'active', 0, 1, 1, '2026-07-13 09:31:21', '2026-07-13 22:32:55'),
(65, 'LUM-0012', 'diamond-bangles', 'Diamond bangles', 'Luxury Diamond Bangles', 'Luxury Diamond Bangles', NULL, NULL, NULL, 'active', 0, 1, 1, '2026-07-13 11:56:22', '2026-07-13 22:32:55'),
(66, 'LUM-0013', 'diamond-nosepin', 'Diamond Nosepin', 'Diamond Nosepin For Woman', 'Diamond Nosepin For Woman', NULL, NULL, NULL, 'active', 0, 1, 0, '2026-07-13 22:13:38', '2026-07-13 22:15:27'),
(67, 'LUM-0014', 'diamond-necklace', 'Diamond Necklace', 'Diamond Necklace For Woman', 'Diamond Necklace For Woman', NULL, NULL, NULL, 'active', 0, 1, 1, '2026-07-13 22:20:26', '2026-07-13 22:32:55'),
(68, 'LUM-0015', 'diamond-chain', 'Diamond Chain', 'Diamond Chain', 'Diamond Chain', NULL, NULL, NULL, 'active', 1, 1, 1, '2026-07-13 22:48:27', '2026-07-13 22:48:27'),
(69, 'LUM-0016', 'full-bridal-set', 'Full Bridal Set', 'Wedding Full Bridal Set', 'Wedding Full Bridal Set', NULL, NULL, NULL, 'active', 1, 1, 1, '2026-07-13 22:53:46', '2026-07-13 22:53:46');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(45, 1),
(46, 2),
(47, 15),
(48, 6),
(50, 7),
(52, 1),
(54, 5),
(55, 1),
(56, 2),
(63, 1),
(65, 6),
(66, 9),
(67, 3),
(68, 7),
(69, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_collections`
--

CREATE TABLE `product_collections` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `collection_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_collections`
--

INSERT INTO `product_collections` (`product_id`, `collection_id`) VALUES
(45, 1),
(45, 5),
(46, 1),
(47, 4),
(47, 5),
(48, 1),
(48, 2),
(48, 3),
(48, 4),
(52, 1),
(54, 4),
(54, 5),
(56, 2),
(56, 3),
(56, 4),
(56, 5),
(63, 2),
(63, 3),
(63, 4),
(65, 1),
(65, 3),
(65, 4),
(65, 5),
(67, 1),
(67, 3),
(68, 5),
(68, 6),
(69, 4);

-- --------------------------------------------------------

--
-- Table structure for table `product_genders`
--

CREATE TABLE `product_genders` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `gender_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_genders`
--

INSERT INTO `product_genders` (`product_id`, `gender_id`) VALUES
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(52, 1),
(54, 1),
(55, 2),
(56, 1),
(63, 1),
(65, 1),
(67, 1),
(68, 1),
(69, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `is_360` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `variant_id`, `image_path`, `alt_text`, `sort_order`, `is_primary`, `is_360`) VALUES
(77, 45, NULL, '/uploads/products/LUM-0001/large/3.jpg', NULL, 0, 1, 0),
(78, 46, NULL, '/uploads/products/LUM-0002/large/3.jpg', NULL, 0, 1, 0),
(80, 48, NULL, '/uploads/products/LUM-0004/large/3.jpg', NULL, 0, 1, 0),
(81, 50, NULL, '/uploads/products/LUM-0005/large/2.jpg', NULL, 0, 1, 0),
(82, 47, NULL, '/uploads/products/LUM-0003/large/3.jpg', NULL, 0, 1, 0),
(83, 52, NULL, '/uploads/products/LUM-0007/large/3.jpg', NULL, 0, 1, 0),
(86, 54, NULL, '/uploads/products/LUM-0008/large/1.jpg', NULL, 0, 1, 0),
(87, 55, NULL, '/uploads/products/LUM-0009/large/3.jpg', NULL, 0, 1, 0),
(88, 56, NULL, '/uploads/products/LUM-0010/large/3.jpg', NULL, 0, 1, 0),
(89, 63, NULL, '/uploads/products/LUM-0011/large/3.jpg', NULL, 0, 1, 0),
(90, 65, NULL, '/uploads/products/LUM-0012/large/3.jpg', NULL, 0, 1, 0),
(91, 66, NULL, '/uploads/products/LUM-0013/large/3.jpg', NULL, 0, 1, 0),
(92, 67, NULL, '/uploads/products/LUM-0014/large/3.jpg', NULL, 0, 1, 0),
(93, 68, NULL, '/uploads/products/LUM-0015/large/3.jpg', NULL, 0, 1, 0),
(94, 69, NULL, '/uploads/products/LUM-0016/large/3.jpg', NULL, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_occasions`
--

CREATE TABLE `product_occasions` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `occasion_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_occasions`
--

INSERT INTO `product_occasions` (`product_id`, `occasion_id`) VALUES
(54, 2),
(54, 3),
(54, 4),
(54, 6),
(56, 2),
(56, 3),
(56, 4),
(56, 6),
(63, 2),
(63, 3),
(65, 1),
(65, 2),
(65, 3),
(65, 6),
(67, 2),
(67, 3),
(67, 4),
(67, 5),
(68, 1),
(68, 2),
(68, 3),
(68, 5),
(69, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_serials`
--

CREATE TABLE `product_serials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `serial_number` varchar(80) NOT NULL,
  `status` enum('in_stock','reserved','sold','returned','damaged') NOT NULL DEFAULT 'in_stock',
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_specifications`
--

CREATE TABLE `product_specifications` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_id` smallint(5) UNSIGNED NOT NULL,
  `value` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_styles`
--

CREATE TABLE `product_styles` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `style_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_styles`
--

INSERT INTO `product_styles` (`product_id`, `style_id`) VALUES
(45, 8),
(46, 8),
(47, 3),
(48, 1),
(48, 6),
(48, 10),
(54, 1),
(54, 2),
(54, 8),
(56, 2),
(56, 3),
(56, 8),
(56, 9),
(65, 2),
(65, 4),
(65, 5),
(65, 8),
(67, 5),
(67, 10),
(68, 2),
(68, 4),
(68, 6),
(68, 9),
(68, 10),
(69, 7);

-- --------------------------------------------------------

--
-- Table structure for table `product_tags`
--

CREATE TABLE `product_tags` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_tags`
--

INSERT INTO `product_tags` (`product_id`, `tag_id`) VALUES
(54, 1),
(54, 2),
(54, 3),
(54, 4),
(54, 5),
(55, 1),
(55, 2),
(55, 3),
(55, 4),
(55, 5),
(56, 1),
(56, 2),
(56, 3),
(56, 4),
(56, 5),
(63, 1),
(63, 2),
(63, 3),
(63, 4),
(63, 5),
(65, 1),
(65, 2),
(65, 3),
(65, 4),
(65, 5),
(67, 1),
(67, 2),
(67, 3),
(67, 4),
(67, 5),
(68, 1),
(68, 2),
(68, 3),
(68, 4),
(68, 5),
(69, 1),
(69, 2),
(69, 3),
(69, 4),
(69, 5);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_sku` varchar(64) NOT NULL,
  `barcode` varchar(64) DEFAULT NULL,
  `metal_id` smallint(5) UNSIGNED DEFAULT NULL,
  `purity_id` smallint(5) UNSIGNED DEFAULT NULL,
  `metal_color_id` smallint(5) UNSIGNED DEFAULT NULL,
  `metal_weight_g` decimal(10,3) DEFAULT NULL,
  `gross_weight_g` decimal(10,3) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_sku`, `barcode`, `metal_id`, `purity_id`, `metal_color_id`, `metal_weight_g`, `gross_weight_g`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(43, 45, 'LUM-0001-01', NULL, 1, 1, 1, 2.000, NULL, 1, 'active', '2026-07-12 15:08:08', '2026-07-12 15:08:08'),
(44, 46, 'LUM-0002-01', NULL, 1, 2, 1, 2.000, NULL, 1, 'active', '2026-07-12 16:13:30', '2026-07-15 09:24:58'),
(45, 47, 'LUM-0003-01', NULL, 1, 3, 1, 4.000, NULL, 1, 'active', '2026-07-12 16:29:45', '2026-07-12 16:29:45'),
(46, 48, 'LUM-0004-01', NULL, 1, 2, NULL, 5.000, NULL, 1, 'active', '2026-07-12 16:37:20', '2026-07-14 16:40:06'),
(48, 50, 'LUM-0005-01', NULL, 1, 1, 1, 5.000, NULL, 1, 'active', '2026-07-12 16:48:46', '2026-07-12 16:48:46'),
(55, 52, 'LUM-0007-24K-5', NULL, 1, 1, 2, NULL, NULL, 1, 'active', '2026-07-12 18:46:56', '2026-07-12 18:48:26'),
(56, 52, 'LUM-0007-24K-6', NULL, 1, 1, 2, NULL, NULL, 0, 'active', '2026-07-12 18:46:56', '2026-07-12 18:48:26'),
(57, 52, 'LUM-0007-24K-7', NULL, 1, 1, 2, NULL, NULL, 0, 'active', '2026-07-12 18:46:56', '2026-07-12 18:48:26'),
(58, 52, 'LUM-0007-24K-8', NULL, 1, 1, 2, NULL, NULL, 0, 'active', '2026-07-12 18:46:56', '2026-07-12 18:48:26'),
(59, 52, 'LUM-0007-22K-5', NULL, 1, 2, 2, NULL, NULL, 0, 'active', '2026-07-12 18:50:44', '2026-07-12 18:50:44'),
(60, 47, 'LUM-0003-22K', NULL, 1, 2, 1, 4.000, NULL, 0, 'active', '2026-07-12 18:57:18', '2026-07-15 09:25:22'),
(61, 47, 'LUM-0003-18K', NULL, 1, 4, 1, 4.000, NULL, 0, 'active', '2026-07-12 18:57:18', '2026-07-15 09:25:22'),
(62, 54, 'LUM-0008-PT950', NULL, NULL, 6, NULL, 5.000, NULL, 1, 'active', '2026-07-12 19:28:18', '2026-07-12 19:28:18'),
(63, 54, 'LUM-0008-S925', NULL, NULL, 7, NULL, 4.000, NULL, 0, 'active', '2026-07-12 19:28:18', '2026-07-12 19:28:18'),
(64, 55, 'LUM-0009-PT950-5', NULL, 2, 6, NULL, 2.000, NULL, 1, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(65, 55, 'LUM-0009-PT950-6', NULL, 2, 6, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(66, 55, 'LUM-0009-PT950-7', NULL, 2, 6, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(67, 55, 'LUM-0009-PT950-8', NULL, 2, 6, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(68, 55, 'LUM-0009-PT950-9', NULL, 2, 6, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(69, 55, 'LUM-0009-S925-5', NULL, 2, 7, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(70, 55, 'LUM-0009-S925-6', NULL, 2, 7, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(71, 55, 'LUM-0009-S925-7', NULL, 2, 7, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(72, 55, 'LUM-0009-S925-8', NULL, 2, 7, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(73, 55, 'LUM-0009-S925-9', NULL, 2, 7, NULL, 2.000, NULL, 0, 'active', '2026-07-12 19:33:59', '2026-07-13 23:35:07'),
(74, 56, 'LUM-0010-PT950', NULL, 2, 6, 2, 5.000, NULL, 1, 'active', '2026-07-12 19:46:31', '2026-07-13 22:50:26'),
(77, 56, 'LUM-0010-14K-5', NULL, 2, 5, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(78, 56, 'LUM-0010-14K-6', NULL, 2, 5, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(79, 56, 'LUM-0010-PT950-5', NULL, 2, 6, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(80, 56, 'LUM-0010-PT950-6', NULL, 2, 6, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(81, 56, 'LUM-0010-S925-5', NULL, 2, 7, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(82, 56, 'LUM-0010-S925-6', NULL, 2, 7, 2, NULL, NULL, 0, 'active', '2026-07-13 08:17:39', '2026-07-13 22:50:26'),
(87, 63, 'LUM-0011-24K-5', NULL, 1, 1, 1, 4.000, NULL, 1, 'active', '2026-07-13 09:31:21', '2026-07-15 09:25:56'),
(88, 63, 'LUM-0011-24K-6', NULL, 1, 1, 1, 4.000, NULL, 0, 'active', '2026-07-13 09:31:21', '2026-07-15 09:25:56'),
(89, 63, 'LUM-0011-22K-5', NULL, 1, 2, 1, 4.000, NULL, 0, 'active', '2026-07-13 09:31:21', '2026-07-15 09:25:56'),
(90, 63, 'LUM-0011-22K-6', NULL, 1, 2, 1, 4.000, NULL, 0, 'active', '2026-07-13 09:31:21', '2026-07-15 09:25:56'),
(92, 65, 'LUM-0012-PT950-2.4', NULL, 2, 6, NULL, 2.000, NULL, 1, 'active', '2026-07-13 11:56:22', '2026-07-13 22:50:11'),
(93, 65, 'LUM-0012-PT950-2.6', NULL, 2, 6, NULL, 3.000, NULL, 0, 'active', '2026-07-13 11:56:22', '2026-07-13 22:50:11'),
(94, 65, 'LUM-0012-21K-2.4', NULL, 2, 3, NULL, NULL, NULL, 0, 'active', '2026-07-13 11:56:22', '2026-07-13 22:50:12'),
(95, 65, 'LUM-0012-21K-2.6', NULL, 2, 3, NULL, NULL, NULL, 0, 'active', '2026-07-13 11:56:22', '2026-07-13 22:50:12'),
(96, 66, 'LUM-0013-PT950', NULL, 2, 6, NULL, 12.000, NULL, 1, 'active', '2026-07-13 22:13:38', '2026-07-13 22:13:38'),
(97, 66, 'LUM-0013-S925', NULL, 2, 7, NULL, 12.000, NULL, 0, 'active', '2026-07-13 22:13:38', '2026-07-13 22:13:38'),
(98, 67, 'LUM-0014-PT950-16 inch', NULL, 2, 6, NULL, 5.000, NULL, 1, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(99, 67, 'LUM-0014-PT950-18 inch', NULL, 2, 6, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(100, 67, 'LUM-0014-PT950-20 inch', NULL, 2, 6, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(101, 67, 'LUM-0014-PT950-22 inch', NULL, 2, 6, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(102, 67, 'LUM-0014-S925-16 inch', NULL, 2, 7, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(103, 67, 'LUM-0014-S925-18 inch', NULL, 2, 7, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(104, 67, 'LUM-0014-S925-20 inch', NULL, 2, 7, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(105, 67, 'LUM-0014-S925-22 inch', NULL, 2, 7, NULL, 5.000, NULL, 0, 'active', '2026-07-13 22:20:26', '2026-07-13 22:20:26'),
(106, 68, 'LUM-0015-PT950-16 inch', NULL, 2, 6, NULL, 10.000, NULL, 1, 'active', '2026-07-13 22:48:27', '2026-07-13 22:48:27'),
(107, 68, 'LUM-0015-PT950-18 inch', NULL, 2, 6, NULL, 10.000, NULL, 0, 'active', '2026-07-13 22:48:27', '2026-07-13 22:48:27'),
(108, 69, 'LUM-0016-24K', NULL, 1, 1, 1, 50.000, NULL, 1, 'active', '2026-07-13 22:53:46', '2026-07-13 22:53:46'),
(109, 69, 'LUM-0016-22K', NULL, 1, 2, 1, 50.000, NULL, 0, 'active', '2026-07-13 22:53:46', '2026-07-13 22:53:46'),
(110, 69, 'LUM-0016-21K', NULL, 1, 3, 1, 50.000, NULL, 0, 'active', '2026-07-13 22:53:46', '2026-07-13 22:53:46');

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `return_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(40) NOT NULL,
  `status` enum('pending','processed','failed') NOT NULL DEFAULT 'pending',
  `processed_at` datetime DEFAULT NULL,
  `processed_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `returns`
--

CREATE TABLE `returns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `order_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('requested','approved','rejected','received','refunded') NOT NULL DEFAULT 'requested',
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `reply` text DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `helpful_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `order_id`, `rating`, `title`, `body`, `reply`, `replied_at`, `helpful_count`, `status`, `created_at`, `updated_at`) VALUES
(3, 47, 53, 168, 5, 'Luxurios', 'The GOLD were total pure.', 'Thank you for your review', '2026-07-14 22:58:35', 0, 'approved', '2026-07-14 16:57:28', '2026-07-14 16:58:40');

-- --------------------------------------------------------

--
-- Table structure for table `review_helpful`
--

CREATE TABLE `review_helpful` (
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_media`
--

CREATE TABLE `review_media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `review_id` bigint(20) UNSIGNED NOT NULL,
  `path` varchar(255) NOT NULL,
  `kind` enum('image','video') NOT NULL DEFAULT 'image',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(2, 'Manager'),
(3, 'Staff'),
(1, 'Super Admin');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` smallint(5) UNSIGNED NOT NULL,
  `permission_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(2, 1),
(2, 3),
(2, 4),
(2, 6);

-- --------------------------------------------------------

--
-- Table structure for table `seo_meta`
--

CREATE TABLE `seo_meta` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` varchar(40) NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` varchar(320) DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `og_image` varchar(255) DEFAULT NULL,
  `schema_json` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `courier` varchar(80) DEFAULT NULL,
  `tracking_no` varchar(120) DEFAULT NULL,
  `status` enum('pending','picked','in_transit','delivered','failed','returned') NOT NULL DEFAULT 'pending',
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stone_clarities`
--

CREATE TABLE `stone_clarities` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stone_clarities`
--

INSERT INTO `stone_clarities` (`id`, `name`) VALUES
(1, 'IF'),
(6, 'SI1'),
(7, 'SI2'),
(4, 'VS1'),
(5, 'VS2'),
(2, 'VVS1'),
(3, 'VVS2');

-- --------------------------------------------------------

--
-- Table structure for table `stone_colors`
--

CREATE TABLE `stone_colors` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stone_colors`
--

INSERT INTO `stone_colors` (`id`, `name`) VALUES
(1, 'D'),
(2, 'E'),
(3, 'F'),
(4, 'G'),
(5, 'H'),
(6, 'I'),
(7, 'J');

-- --------------------------------------------------------

--
-- Table structure for table `stone_cuts`
--

CREATE TABLE `stone_cuts` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stone_cuts`
--

INSERT INTO `stone_cuts` (`id`, `name`) VALUES
(1, 'Excellent'),
(3, 'Good'),
(2, 'Very Good');

-- --------------------------------------------------------

--
-- Table structure for table `stone_shapes`
--

CREATE TABLE `stone_shapes` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stone_shapes`
--

INSERT INTO `stone_shapes` (`id`, `name`) VALUES
(7, 'Cushion'),
(5, 'Emerald'),
(6, 'Heart'),
(8, 'Marquise'),
(2, 'Oval'),
(4, 'Pear'),
(3, 'Princess'),
(1, 'Round');

-- --------------------------------------------------------

--
-- Table structure for table `stone_types`
--

CREATE TABLE `stone_types` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stone_types`
--

INSERT INTO `stone_types` (`id`, `name`) VALUES
(1, 'Diamond'),
(3, 'Emerald'),
(5, 'Pearl'),
(6, 'Polki'),
(2, 'Ruby'),
(4, 'Sapphire');

-- --------------------------------------------------------

--
-- Table structure for table `styles`
--

CREATE TABLE `styles` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `styles`
--

INSERT INTO `styles` (`id`, `name`, `slug`) VALUES
(1, 'Solitaire', 'solitaire'),
(2, 'Halo', 'halo'),
(3, 'Cocktail', 'cocktail'),
(4, 'Color Stone', 'color-stone'),
(5, 'Multi Stone', 'multi-stone'),
(6, 'Single Stone', 'single-stone'),
(7, 'Vintage', 'vintage'),
(8, 'Minimal', 'minimal'),
(9, 'Designer', 'designer'),
(10, 'Polki', 'polki');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `slug` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
(1, 'Trending', 'trending'),
(2, 'Editor\'s Choice', 'editors-choice'),
(3, 'Celebrity', 'celebrity'),
(4, 'Luxury', 'luxury'),
(5, 'Best Seller', 'best-seller');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(10) UNSIGNED NOT NULL,
  `author_name` varchar(120) NOT NULL,
  `author_title` varchar(120) DEFAULT NULL,
  `quote` text NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `author_name`, `author_title`, `quote`, `avatar`, `sort_order`, `is_active`) VALUES
(1, 'A. de Villiers', 'Genève', 'The rivière necklace I commissioned took eight months. When it arrived, my wife wept. Nothing we own compares to it.', NULL, 1, 1),
(2, 'M. Hartwell', 'New York', 'Their private salon experience is unlike anything in Paris. Three generations of my family now wear Nahar Jewellers.', NULL, 2, 1),
(3, 'S. Al-Rashid', 'Paris', 'I have collected high jewelry for twenty years. Nahar Jewellers\' gold work is the finest I have ever held.', NULL, 3, 1),
(4, 'N. Rahman', 'Dhaka', 'From the first sketch to the final polish, they treated my mother\'s heirloom stones with reverence. The reset bangles are breathtaking.', NULL, 4, 1),
(5, 'E. Whitmore', 'London', 'The engagement ring was ready before the promised date, with a certificate for every stone. Service as flawless as the diamond.', NULL, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `url_redirects`
--

CREATE TABLE `url_redirects` (
  `id` int(10) UNSIGNED NOT NULL,
  `from_path` varchar(255) NOT NULL,
  `to_path` varchar(255) NOT NULL,
  `status_code` smallint(5) UNSIGNED NOT NULL DEFAULT 301,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notify_order` tinyint(1) NOT NULL DEFAULT 1,
  `notify_offers` tinyint(1) NOT NULL DEFAULT 0,
  `notify_sms` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar_path`, `password_hash`, `email_verified_at`, `phone_verified_at`, `is_active`, `notify_order`, `notify_offers`, `notify_sms`, `created_at`, `updated_at`) VALUES
(1, 'Lamia Bhuiyan', 'lamia.bhuiyan.0@demo.lumina', '+8801931960110', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-05 06:07:42', '2026-07-10 06:07:42'),
(2, 'Sourav Jahan', 'sourav.jahan.1@demo.lumina', '+8801374569682', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-26 06:07:42', '2026-07-10 06:07:42'),
(3, 'Mehjabin Karim', 'mehjabin.karim.2@demo.lumina', '+8801835651657', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-06 06:07:42', '2026-07-10 06:07:42'),
(4, 'Shakib Rahman', 'shakib.rahman.3@demo.lumina', '+8801933484568', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-22 06:07:42', '2026-07-10 06:07:42'),
(5, 'Zara Hossain', 'zara.hossain.4@demo.lumina', '+8801693564222', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-04 06:07:42', '2026-07-10 06:07:42'),
(6, 'Kabir Chowdhury', 'kabir.chowdhury.5@demo.lumina', '+8801938729169', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-14 06:07:42', '2026-07-10 06:07:42'),
(7, 'Kabir Hossain', 'kabir.hossain.6@demo.lumina', '+8801922363157', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-01 06:07:42', '2026-07-10 06:07:42'),
(8, 'Rumana Ahmed', 'rumana.ahmed.7@demo.lumina', '+8801719362743', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-22 06:07:42', '2026-07-10 06:07:42'),
(9, 'Kabir Chowdhury', 'kabir.chowdhury.8@demo.lumina', '+8801410567485', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-14 06:07:42', '2026-07-10 06:07:42'),
(10, 'Farhana Akter', 'farhana.akter.9@demo.lumina', '+8801512421491', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-08 06:07:42', '2026-07-10 06:07:42'),
(11, 'Zara Chowdhury', 'zara.chowdhury.10@demo.lumina', '+8801811225651', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-16 06:07:42', '2026-07-10 06:07:42'),
(12, 'Sadia Karim', 'sadia.karim.11@demo.lumina', '+8801607822499', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-01 06:07:42', '2026-07-10 06:07:42'),
(13, 'Rahim Karim', 'rahim.karim.12@demo.lumina', '+8801541555067', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-16 06:07:42', '2026-07-10 06:07:42'),
(14, 'Fahim Jahan', 'fahim.jahan.13@demo.lumina', '+8801895360839', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-12 06:07:42', '2026-07-10 06:07:42'),
(15, 'Nusrat Akter', 'nusrat.akter.14@demo.lumina', '+8801988182449', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-27 06:07:42', '2026-07-10 06:07:42'),
(16, 'Sourav Ahmed', 'sourav.ahmed.15@demo.lumina', '+8801855868079', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(17, 'Zara Rahman', 'zara.rahman.16@demo.lumina', '+8801592030656', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-20 06:07:42', '2026-07-10 06:07:42'),
(18, 'Rahim Rahman', 'rahim.rahman.17@demo.lumina', '+8801684588231', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-24 06:07:42', '2026-07-10 06:07:42'),
(19, 'Rahim Rahman', 'rahim.rahman.18@demo.lumina', '+8801712090583', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-09 06:07:42', '2026-07-10 06:07:42'),
(20, 'Tasnia Ahmed', 'tasnia.ahmed.19@demo.lumina', '+8801649452961', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-24 06:07:42', '2026-07-10 06:07:42'),
(21, 'Lamia Akter', 'lamia.akter.20@demo.lumina', '+8801329929558', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-23 06:07:42', '2026-07-10 06:07:42'),
(22, 'Lamia Karim', 'lamia.karim.21@demo.lumina', '+8801477010690', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-05 06:07:42', '2026-07-10 06:07:42'),
(23, 'Kabir Bhuiyan', 'kabir.bhuiyan.22@demo.lumina', '+8801432720098', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-08 06:07:42', '2026-07-10 06:07:42'),
(24, 'Imran Siddiqui', 'imran.siddiqui.23@demo.lumina', '+8801857908590', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-13 06:07:42', '2026-07-10 06:07:42'),
(25, 'Shakib Jahan', 'shakib.jahan.24@demo.lumina', '+8801838779649', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-11 06:07:42', '2026-07-10 06:07:42'),
(26, 'Farhana Chowdhury', 'farhana.chowdhury.25@demo.lumina', '+8801395254768', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-29 06:07:42', '2026-07-10 06:07:42'),
(27, 'Imran Akter', 'imran.akter.26@demo.lumina', '+8801460578508', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-20 06:07:42', '2026-07-10 06:07:42'),
(28, 'Hasan Karim', 'hasan.karim.27@demo.lumina', '+8801673641495', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-15 06:07:42', '2026-07-10 06:07:42'),
(29, 'Sourav Hossain', 'sourav.hossain.28@demo.lumina', '+8801780378466', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-26 06:07:42', '2026-07-10 06:07:42'),
(30, 'Arif Hossain', 'arif.hossain.29@demo.lumina', '+8801367258876', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-09 06:07:42', '2026-07-10 06:07:42'),
(31, 'Sourav Karim', 'sourav.karim.30@demo.lumina', '+8801458679773', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-06 06:07:42', '2026-07-10 06:07:42'),
(32, 'Zara Islam', 'zara.islam.31@demo.lumina', '+8801545125927', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-28 06:07:42', '2026-07-10 06:07:42'),
(33, 'Sourav Karim', 'sourav.karim.32@demo.lumina', '+8801811927323', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-28 06:07:42', '2026-07-10 06:07:42'),
(34, 'Hasan Bhuiyan', 'hasan.bhuiyan.33@demo.lumina', '+8801600446857', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-19 06:07:42', '2026-07-10 06:07:42'),
(35, 'Lamia Islam', 'lamia.islam.34@demo.lumina', '+8801509433413', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-04-13 06:07:42', '2026-07-10 06:07:42'),
(36, 'Tasnia Jahan', 'tasnia.jahan.35@demo.lumina', '+8801309213228', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-29 06:07:42', '2026-07-10 06:07:42'),
(37, 'Hasan Chowdhury', 'hasan.chowdhury.36@demo.lumina', '+8801394750262', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-06-03 06:07:42', '2026-07-10 06:07:42'),
(38, 'Nabila Rahman', 'nabila.rahman.37@demo.lumina', '+8801364064664', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-29 06:07:42', '2026-07-10 06:07:42'),
(39, 'Arif Hossain', 'arif.hossain.38@demo.lumina', '+8801773396585', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-07 06:07:42', '2026-07-10 06:07:42'),
(40, 'Shakib Islam', 'shakib.islam.39@demo.lumina', '+8801577249899', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-05-04 06:07:42', '2026-07-10 06:07:42'),
(41, 'Imran Akter', 'imran.akter.40@demo.lumina', '+8801837326356', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-29 06:07:42', '2026-07-10 06:07:42'),
(42, 'Arif Siddiqui', 'arif.siddiqui.41@demo.lumina', '+8801564848288', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-03-23 06:07:42', '2026-07-10 06:07:42'),
(43, 'Tahoshin Islam', NULL, '01712345678', NULL, 'a6cd189081fde9ad2a66ab54f1905914:77595d553edffb129d22ed844c2bcb53b926f1e757936a510bf8fc8e1c44b828708c297c72beb3a288e49e0f3f1ba6bd181a9a97fe514970bcfa5da5ec99b257', NULL, NULL, 1, 1, 0, 1, '2026-07-12 13:22:13', '2026-07-12 13:22:13'),
(44, 'Robert Jojo', 'tahoshin@gmail.com', '01788853871', NULL, '9f5fce5f52027b9181c21b7e733f2e9e:aa5503298376f0ab1cf1e778a5b5e4ff89a0d20b26ee54988dea115bbca8305f0a71768fc94a774747755a37fb2047368f7da3700976b8422953f1e1c1eb0d6a', NULL, NULL, 1, 1, 0, 1, '2026-07-12 14:01:59', '2026-07-12 14:01:59'),
(47, 'Maryam Dunn', 'mivecegosy@mailinator.com', '01777775538', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-13 18:31:51', '2026-07-13 18:31:51'),
(53, 'Robert Jojo', NULL, '01788853872', '/uploads/avatars/53-4aaa5f4f7048.jpg', NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-13 20:49:21', '2026-07-13 23:10:12'),
(56, 'American International University-Bangladesh (Dhaka)', 'm@gmail.com', '01725154222', NULL, NULL, NULL, NULL, 1, 1, 0, 1, '2026-07-15 09:31:17', '2026-07-15 09:31:17');

-- --------------------------------------------------------

--
-- Table structure for table `variant_attributes`
--

CREATE TABLE `variant_attributes` (
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_value_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_attributes`
--

INSERT INTO `variant_attributes` (`variant_id`, `attribute_value_id`) VALUES
(48, 6),
(48, 7),
(48, 8),
(48, 9),
(55, 1),
(56, 2),
(57, 3),
(58, 4),
(59, 1),
(64, 1),
(65, 2),
(66, 3),
(67, 4),
(68, 5),
(69, 1),
(70, 2),
(71, 3),
(72, 4),
(73, 5),
(77, 1),
(78, 2),
(79, 1),
(80, 2),
(81, 1),
(82, 2),
(87, 1),
(88, 2),
(89, 1),
(90, 2),
(92, 10),
(93, 11),
(94, 10),
(95, 11),
(98, 6),
(99, 7),
(100, 8),
(101, 9),
(102, 6),
(103, 7),
(104, 8),
(105, 9),
(106, 6),
(107, 7);

-- --------------------------------------------------------

--
-- Table structure for table `variant_price_components`
--

CREATE TABLE `variant_price_components` (
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `pricing_mode` enum('fixed','rate_based') NOT NULL DEFAULT 'rate_based',
  `fixed_price` decimal(12,2) DEFAULT NULL,
  `compare_price` decimal(12,2) DEFAULT NULL,
  `cost_price` decimal(12,2) DEFAULT NULL,
  `stone_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `making_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `wastage_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_percent` decimal(5,2) NOT NULL DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_price_components`
--

INSERT INTO `variant_price_components` (`variant_id`, `pricing_mode`, `fixed_price`, `compare_price`, `cost_price`, `stone_charge`, `making_charge`, `wastage_percent`, `discount_amount`, `tax_percent`) VALUES
(43, 'fixed', 100000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(44, 'fixed', 20000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(45, 'fixed', 50000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(46, 'fixed', 40000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(48, 'fixed', 20000.00, NULL, NULL, 0.00, 0.00, 0.00, 10000.00, 5.00),
(55, 'fixed', 43000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(56, 'fixed', 44000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(57, 'fixed', 45000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(58, 'fixed', 50000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(59, 'fixed', 80000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(60, 'fixed', 70000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(61, 'fixed', 80000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(62, 'fixed', 150000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(63, 'fixed', 140000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(64, 'fixed', 10000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(65, 'fixed', 15000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(66, 'fixed', 16000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(67, 'fixed', 17000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(68, 'fixed', 18000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(69, 'fixed', 19000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(70, 'fixed', 20000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(71, 'fixed', 21000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(72, 'fixed', 22000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(73, 'fixed', 23000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(74, 'fixed', 30000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(77, 'fixed', 35000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(78, 'fixed', 36000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(79, 'fixed', 35007.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(80, 'fixed', 35008.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(81, 'fixed', 35009.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(82, 'fixed', 35010.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(87, 'fixed', 50000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(88, 'fixed', 60000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(89, 'fixed', 70000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(90, 'fixed', 80000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(92, 'fixed', 400000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(93, 'fixed', 500000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(94, 'fixed', 600000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(95, 'fixed', 70000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(96, 'fixed', 53000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(97, 'fixed', 50000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(98, 'fixed', 40000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(99, 'fixed', 42000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(100, 'fixed', 42400.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(101, 'fixed', 42800.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(102, 'fixed', 43200.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(103, 'fixed', 47088.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(104, 'fixed', 51797.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(105, 'fixed', 57495.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(106, 'fixed', 450000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(107, 'fixed', 495000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(108, 'fixed', 100000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(109, 'fixed', 880000.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00),
(110, 'fixed', 774400.00, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `variant_stones`
--

CREATE TABLE `variant_stones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `stone_type_id` smallint(5) UNSIGNED NOT NULL,
  `stone_shape_id` smallint(5) UNSIGNED DEFAULT NULL,
  `stone_color_id` smallint(5) UNSIGNED DEFAULT NULL,
  `stone_clarity_id` smallint(5) UNSIGNED DEFAULT NULL,
  `stone_cut_id` smallint(5) UNSIGNED DEFAULT NULL,
  `is_lab_grown` tinyint(1) NOT NULL DEFAULT 0,
  `carat_each` decimal(8,3) DEFAULT NULL,
  `carat_total` decimal(8,3) DEFAULT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `is_center_stone` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_stones`
--

INSERT INTO `variant_stones` (`id`, `variant_id`, `stone_type_id`, `stone_shape_id`, `stone_color_id`, `stone_clarity_id`, `stone_cut_id`, `is_lab_grown`, `carat_each`, `carat_total`, `quantity`, `is_center_stone`) VALUES
(22, 62, 1, 7, 1, 1, 1, 0, 4.000, 5.000, 10, 1),
(23, 64, 1, 2, 2, 2, 1, 0, NULL, 5.000, 3, 1),
(24, 74, 1, 8, 4, 6, 2, 0, NULL, 4.000, 4, 1),
(25, 92, 1, 2, 3, 2, 2, 0, 5.000, 5.000, 5, 1),
(26, 96, 1, 8, 2, 2, 1, 0, 1.000, NULL, 1, 1),
(27, 98, 1, 3, 3, 5, 2, 0, 5.000, 5.000, 6, 1),
(28, 106, 1, 4, 3, 2, 2, 0, 1.000, 12.000, 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `type` enum('warehouse','store') NOT NULL DEFAULT 'warehouse',
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`id`, `name`, `type`, `address`, `phone`, `is_active`) VALUES
(1, 'Main Warehouse', 'warehouse', 'Dhaka', NULL, 1),
(2, 'Dhaka Boutique', 'store', 'Gulshan, Dhaka', NULL, 1),
(3, 'Chittagong Boutique', 'store', 'Chittagong', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_addr_user` (`user_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_au_role` (`role_id`);

--
-- Indexes for table `analytics_events`
--
ALTER TABLE `analytics_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_ae_order_event` (`order_id`,`event`),
  ADD KEY `idx_ae_created` (`created_at`),
  ADD KEY `idx_ae_session` (`session_id`),
  ADD KEY `idx_ae_event` (`event`,`created_at`),
  ADD KEY `idx_ae_source` (`referrer_source`,`created_at`),
  ADD KEY `idx_ae_country` (`country`,`created_at`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_appt_status` (`status`,`created_at`),
  ADD KEY `idx_appt_kind` (`kind`,`created_at`),
  ADD KEY `fk_appt_user` (`user_id`),
  ADD KEY `fk_appt_boutique` (`boutique_id`);

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_attr_value` (`attribute_id`,`value`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_al_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_al_admin` (`admin_user_id`,`created_at`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blog_comments` (`blog_id`,`status`,`created_at`),
  ADD KEY `fk_comment_user` (`user_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_campaigns_dates` (`start_at`,`end_at`),
  ADD KEY `idx_campaigns_published` (`is_published`);

--
-- Indexes for table `campaign_products`
--
ALTER TABLE `campaign_products`
  ADD PRIMARY KEY (`campaign_id`,`product_id`),
  ADD KEY `fk_campaign_products_product` (`product_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cart_user` (`user_id`),
  ADD KEY `idx_cart_session` (`session_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cart_variant` (`cart_id`,`variant_id`),
  ADD KEY `fk_ci_variant` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_cat_parent` (`parent_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cert_no` (`issuer`,`certificate_no`),
  ADD KEY `fk_cert_variant` (`variant_id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `home_media`
--
ALTER TABLE `home_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_home_media_section` (`section`,`sort_order`,`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`variant_id`,`warehouse_id`),
  ADD KEY `fk_inv_warehouse` (`warehouse_id`);

--
-- Indexes for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_im_warehouse` (`warehouse_id`),
  ADD KEY `idx_im_variant` (`variant_id`,`created_at`),
  ADD KEY `idx_im_ref` (`reference_type`,`reference_id`);

--
-- Indexes for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ir_variant` (`variant_id`),
  ADD KEY `fk_ir_warehouse` (`warehouse_id`),
  ADD KEY `idx_ir_status` (`status`,`expires_at`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mi_parent` (`parent_id`),
  ADD KEY `idx_mi_menu` (`menu_id`,`parent_id`,`sort_order`);

--
-- Indexes for table `metals`
--
ALTER TABLE `metals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `metal_colors`
--
ALTER TABLE `metal_colors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `metal_purities`
--
ALTER TABLE `metal_purities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_metal_purity` (`metal_id`,`name`);

--
-- Indexes for table `metal_rates`
--
ALTER TABLE `metal_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rate_lookup` (`purity_id`,`effective_from`);

--
-- Indexes for table `occasions`
--
ALTER TABLE `occasions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_no` (`order_no`),
  ADD KEY `fk_order_user` (`user_id`),
  ADD KEY `fk_order_coupon` (`coupon_id`),
  ADD KEY `idx_orders_status` (`status`,`placed_at`),
  ADD KEY `idx_orders_reserved` (`status`,`reserved_until`),
  ADD KEY `idx_orders_is_test` (`is_test`,`placed_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_oi_order` (`order_id`),
  ADD KEY `fk_oi_variant` (`variant_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_osh_order` (`order_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ptx_order` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `price_history`
--
ALTER TABLE `price_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ph_variant` (`variant_id`,`effective_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_prod_brand` (`brand_id`),
  ADD KEY `idx_products_status` (`status`),
  ADD KEY `idx_products_flags` (`is_featured`,`is_new_arrival`,`is_best_seller`);

ALTER TABLE `products` ADD FULLTEXT KEY `ft_products` (`name`,`short_description`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_id`,`category_id`),
  ADD KEY `fk_pc_category` (`category_id`);

--
-- Indexes for table `product_collections`
--
ALTER TABLE `product_collections`
  ADD PRIMARY KEY (`product_id`,`collection_id`),
  ADD KEY `fk_pcol_collection` (`collection_id`);

--
-- Indexes for table `product_genders`
--
ALTER TABLE `product_genders`
  ADD PRIMARY KEY (`product_id`,`gender_id`),
  ADD KEY `fk_pg_gender` (`gender_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_img_variant` (`variant_id`),
  ADD KEY `idx_img_product` (`product_id`,`sort_order`);

--
-- Indexes for table `product_occasions`
--
ALTER TABLE `product_occasions`
  ADD PRIMARY KEY (`product_id`,`occasion_id`),
  ADD KEY `fk_po_occasion` (`occasion_id`);

--
-- Indexes for table `product_serials`
--
ALTER TABLE `product_serials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_serial` (`serial_number`),
  ADD KEY `idx_serial_variant_status` (`variant_id`,`status`),
  ADD KEY `fk_serial_order` (`order_id`);

--
-- Indexes for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD PRIMARY KEY (`product_id`,`attribute_id`),
  ADD KEY `fk_prodspec_attribute` (`attribute_id`);

--
-- Indexes for table `product_styles`
--
ALTER TABLE `product_styles`
  ADD PRIMARY KEY (`product_id`,`style_id`),
  ADD KEY `fk_ps_style` (`style_id`);

--
-- Indexes for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`product_id`,`tag_id`),
  ADD KEY `fk_pt_tag` (`tag_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `variant_sku` (`variant_sku`),
  ADD KEY `fk_var_metal` (`metal_id`),
  ADD KEY `fk_var_purity` (`purity_id`),
  ADD KEY `fk_var_color` (`metal_color_id`),
  ADD KEY `idx_var_product` (`product_id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ref_order` (`order_id`),
  ADD KEY `fk_ref_return` (`return_id`);

--
-- Indexes for table `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ret_order` (`order_id`),
  ADD KEY `fk_ret_item` (`order_item_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_review_user_product` (`product_id`,`user_id`),
  ADD UNIQUE KEY `uq_review` (`product_id`,`user_id`,`order_id`),
  ADD KEY `fk_rev_user` (`user_id`),
  ADD KEY `fk_rev_order` (`order_id`);

--
-- Indexes for table `review_helpful`
--
ALTER TABLE `review_helpful`
  ADD PRIMARY KEY (`review_id`,`user_id`),
  ADD KEY `fk_helpful_user` (`user_id`);

--
-- Indexes for table `review_media`
--
ALTER TABLE `review_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_review_media` (`review_id`,`sort_order`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `fk_rp_perm` (`permission_id`);

--
-- Indexes for table `seo_meta`
--
ALTER TABLE `seo_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_seo_entity` (`entity_type`,`entity_id`);

--
-- Indexes for table `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ship_order` (`order_id`);

--
-- Indexes for table `stone_clarities`
--
ALTER TABLE `stone_clarities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `stone_colors`
--
ALTER TABLE `stone_colors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `stone_cuts`
--
ALTER TABLE `stone_cuts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `stone_shapes`
--
ALTER TABLE `stone_shapes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `stone_types`
--
ALTER TABLE `stone_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `styles`
--
ALTER TABLE `styles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `url_redirects`
--
ALTER TABLE `url_redirects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `from_path` (`from_path`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD PRIMARY KEY (`variant_id`,`attribute_value_id`),
  ADD KEY `fk_va_value` (`attribute_value_id`);

--
-- Indexes for table `variant_price_components`
--
ALTER TABLE `variant_price_components`
  ADD PRIMARY KEY (`variant_id`);

--
-- Indexes for table `variant_stones`
--
ALTER TABLE `variant_stones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vs_type` (`stone_type_id`),
  ADD KEY `fk_vs_shape` (`stone_shape_id`),
  ADD KEY `fk_vs_color` (`stone_color_id`),
  ADD KEY `fk_vs_clarity` (`stone_clarity_id`),
  ADD KEY `fk_vs_cut` (`stone_cut_id`),
  ADD KEY `idx_vs_variant` (`variant_id`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`user_id`,`product_id`),
  ADD KEY `fk_wl_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `analytics_events`
--
ALTER TABLE `analytics_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1925;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog_comments`
--
ALTER TABLE `blog_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `home_media`
--
ALTER TABLE `home_media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `metals`
--
ALTER TABLE `metals`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `metal_colors`
--
ALTER TABLE `metal_colors`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `metal_purities`
--
ALTER TABLE `metal_purities`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `metal_rates`
--
ALTER TABLE `metal_rates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `occasions`
--
ALTER TABLE `occasions`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=338;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `price_history`
--
ALTER TABLE `price_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `product_serials`
--
ALTER TABLE `product_serials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `returns`
--
ALTER TABLE `returns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `review_media`
--
ALTER TABLE `review_media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `seo_meta`
--
ALTER TABLE `seo_meta`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stone_clarities`
--
ALTER TABLE `stone_clarities`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stone_colors`
--
ALTER TABLE `stone_colors`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stone_cuts`
--
ALTER TABLE `stone_cuts`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stone_shapes`
--
ALTER TABLE `stone_shapes`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stone_types`
--
ALTER TABLE `stone_types`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `styles`
--
ALTER TABLE `styles`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `url_redirects`
--
ALTER TABLE `url_redirects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `variant_stones`
--
ALTER TABLE `variant_stones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD CONSTRAINT `fk_au_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `analytics_events`
--
ALTER TABLE `analytics_events`
  ADD CONSTRAINT `fk_ae_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appt_boutique` FOREIGN KEY (`boutique_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_appt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `fk_av_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_al_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD CONSTRAINT `fk_comment_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `campaign_products`
--
ALTER TABLE `campaign_products`
  ADD CONSTRAINT `fk_campaign_products_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_campaign_products_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ci_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `fk_cert_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inv_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inv_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  ADD CONSTRAINT `fk_im_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_im_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  ADD CONSTRAINT `fk_ir_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ir_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `fk_mi_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mi_parent` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `metal_purities`
--
ALTER TABLE `metal_purities`
  ADD CONSTRAINT `fk_purity_metal` FOREIGN KEY (`metal_id`) REFERENCES `metals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `metal_rates`
--
ALTER TABLE `metal_rates`
  ADD CONSTRAINT `fk_rate_purity` FOREIGN KEY (`purity_id`) REFERENCES `metal_purities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_oi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `fk_ptx_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `price_history`
--
ALTER TABLE `price_history`
  ADD CONSTRAINT `fk_ph_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pc_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_collections`
--
ALTER TABLE `product_collections`
  ADD CONSTRAINT `fk_pcol_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pcol_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_genders`
--
ALTER TABLE `product_genders`
  ADD CONSTRAINT `fk_pg_gender` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pg_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_img_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_img_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_occasions`
--
ALTER TABLE `product_occasions`
  ADD CONSTRAINT `fk_po_occasion` FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_po_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_serials`
--
ALTER TABLE `product_serials`
  ADD CONSTRAINT `fk_serial_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_serial_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD CONSTRAINT `fk_prodspec_attribute` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prodspec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_styles`
--
ALTER TABLE `product_styles`
  ADD CONSTRAINT `fk_ps_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ps_style` FOREIGN KEY (`style_id`) REFERENCES `styles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD CONSTRAINT `fk_pt_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `fk_var_color` FOREIGN KEY (`metal_color_id`) REFERENCES `metal_colors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_var_metal` FOREIGN KEY (`metal_id`) REFERENCES `metals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_var_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_var_purity` FOREIGN KEY (`purity_id`) REFERENCES `metal_purities` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `fk_ref_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ref_return` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `fk_ret_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ret_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_rev_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rev_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_helpful`
--
ALTER TABLE `review_helpful`
  ADD CONSTRAINT `fk_helpful_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_helpful_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_media`
--
ALTER TABLE `review_media`
  ADD CONSTRAINT `fk_review_media_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `fk_ship_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_attributes`
--
ALTER TABLE `variant_attributes`
  ADD CONSTRAINT `fk_va_value` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_va_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_price_components`
--
ALTER TABLE `variant_price_components`
  ADD CONSTRAINT `fk_vpc_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_stones`
--
ALTER TABLE `variant_stones`
  ADD CONSTRAINT `fk_vs_clarity` FOREIGN KEY (`stone_clarity_id`) REFERENCES `stone_clarities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_vs_color` FOREIGN KEY (`stone_color_id`) REFERENCES `stone_colors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_vs_cut` FOREIGN KEY (`stone_cut_id`) REFERENCES `stone_cuts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_vs_shape` FOREIGN KEY (`stone_shape_id`) REFERENCES `stone_shapes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_vs_type` FOREIGN KEY (`stone_type_id`) REFERENCES `stone_types` (`id`),
  ADD CONSTRAINT `fk_vs_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wl_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;