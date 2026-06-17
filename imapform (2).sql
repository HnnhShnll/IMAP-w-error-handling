-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2026 at 03:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imapform`
--

-- --------------------------------------------------------

--
-- Table structure for table `application_information`
--

CREATE TABLE `application_information` (
  `Application_ID` int(7) UNSIGNED ZEROFILL NOT NULL,
  `Patient_ID` varchar(6) NOT NULL,
  `Patient_Diagnosis` varchar(255) NOT NULL,
  `Patient_NatureOfRequest` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient_information`
--

CREATE TABLE `patient_information` (
  `Patient_ID` varchar(6) NOT NULL,
  `patient_Name` varchar(100) NOT NULL,
  `patient_Address` text NOT NULL,
  `patient_CivilStatus` varchar(30) NOT NULL,
  `patient_BirthDate` date DEFAULT NULL,
  `patient_Sex` char(1) DEFAULT NULL,
  `patient_Religion` varchar(50) DEFAULT NULL,
  `patient_EducationalAttainment` varchar(50) DEFAULT NULL,
  `patient_Job` varchar(50) DEFAULT NULL,
  `patient_MonthlyIncome` int(11) DEFAULT NULL,
  `philhealth_MembershipStatus` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relative_information`
--

CREATE TABLE `relative_information` (
  `Relative_ID` int(11) NOT NULL,
  `Patient_ID` varchar(6) NOT NULL,
  `Relative_Name` varchar(100) NOT NULL,
  `Relative_Age` int(11) DEFAULT NULL,
  `Relative_CivilStatus` varchar(30) DEFAULT NULL,
  `Relative_RelationToPatient` varchar(50) DEFAULT NULL,
  `Relative_Job` varchar(50) DEFAULT NULL,
  `Relative_MonthlyIncome` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Patient_ID` varchar(6) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_information`
--
ALTER TABLE `application_information`
  ADD PRIMARY KEY (`Application_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `patient_information`
--
ALTER TABLE `patient_information`
  ADD PRIMARY KEY (`Patient_ID`);

--
-- Indexes for table `relative_information`
--
ALTER TABLE `relative_information`
  ADD PRIMARY KEY (`Relative_ID`),
  ADD KEY `Patient_ID` (`Patient_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Patient_ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_information`
--
ALTER TABLE `application_information`
  MODIFY `Application_ID` int(7) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `relative_information`
--
ALTER TABLE `relative_information`
  MODIFY `Relative_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_information`
--
ALTER TABLE `application_information`
  ADD CONSTRAINT `application_information_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `users` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `patient_information`
--
ALTER TABLE `patient_information`
  ADD CONSTRAINT `patient_information_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `users` (`Patient_ID`) ON DELETE CASCADE;

--
-- Constraints for table `relative_information`
--
ALTER TABLE `relative_information`
  ADD CONSTRAINT `relative_information_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `users` (`Patient_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
