-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2025 at 11:38 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ddos_simulation`
--

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `fb_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`fb_id`, `user_id`, `message`, `submitted_at`) VALUES
(1, 1, 'User 1 requested this feedback for testing.', '2025-02-25 11:15:33'),
(2, NULL, 'suka blyat nahui', '2025-03-05 09:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `ip_tracking`
--

CREATE TABLE `ip_tracking` (
  `ip_id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `status` enum('unmarked','attempted','blocked') DEFAULT 'unmarked',
  `attempt_count` int(11) DEFAULT 0,
  `first_attempt` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_attempt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `block_reason` text DEFAULT NULL,
  `blocked_until` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `work` varchar(100) DEFAULT 'Guests',
  `account_type` enum('Client','Admin') NOT NULL DEFAULT 'Client',
  `company` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`, `email`, `password_hash`, `address`, `work`, `account_type`, `company`, `created_at`) VALUES
(1, 'human', 'bruh@hitman.com', 'a95bc16631ae2b6fadb455ee018da0adc2703e56d89e3eed074ce56d2f7b1b6a', 'Moscow', 'asdasd', 'Admin', NULL, '2025-02-09 11:50:59'),
(2, 'leo', 'lm10@miami.com', '8535e86c8118bbbb0a18ac72d15d3a2b37b18d1bce1611fc60165f322cf57386', 'argentina', 'manug sipa', 'Client', 'miami', '2025-03-05 07:02:19'),
(10, 'kuru', 'kuru@kuru.com', '82742b5469234a2239dd86f966284af74a9ebd70c6cfeff2ce2095dc4614017f', 'space station', 'AI', 'Client', 'herta ', '2025-03-05 07:35:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`fb_id`),
  ADD KEY `feedback_ibfk_1` (`user_id`);

--
-- Indexes for table `ip_tracking`
--
ALTER TABLE `ip_tracking`
  ADD PRIMARY KEY (`ip_id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `fb_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ip_tracking`
--
ALTER TABLE `ip_tracking`
  MODIFY `ip_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
