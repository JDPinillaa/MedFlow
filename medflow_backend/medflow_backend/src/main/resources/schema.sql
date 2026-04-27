CREATE DATABASE IF NOT EXISTS `clinica_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `clinica_db`;

CREATE TABLE IF NOT EXISTS `doctores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `especialidad` varchar(100) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `registro_medico` varchar(80) NOT NULL,
  `email` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrxi7ou0oc024hmqknfdof0cr5` (`registro_medico`),
  UNIQUE KEY `UKd73enkt3ggy3dlibgn86qs5ea` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `documento` varchar(30) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `email` varchar(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpmbbinegtxye4liqd61ionaau` (`documento`),
  UNIQUE KEY `UKa83ft0lfk8ltx47ve931qw2kq` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `procedimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `duracion_minutos` int NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','MEDICO','PACIENTE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

UPDATE `usuarios`
SET `rol` = CASE
  WHEN `rol` IS NULL OR TRIM(`rol`) = '' THEN 'PACIENTE'
  WHEN UPPER(TRIM(`rol`)) = 'ADMIN' THEN 'ADMIN'
  WHEN UPPER(TRIM(`rol`)) = 'MEDICO' THEN 'MEDICO'
  WHEN UPPER(TRIM(`rol`)) = 'PACIENTE' THEN 'PACIENTE'
  WHEN UPPER(TRIM(`rol`)) = 'DOCTOR' THEN 'MEDICO'
  WHEN UPPER(TRIM(`rol`)) = 'RECEPCION' THEN 'ADMIN'
  ELSE 'PACIENTE'
END;

ALTER TABLE `usuarios`
  MODIFY COLUMN `rol` enum('ADMIN','MEDICO','PACIENTE') NOT NULL;

CREATE TABLE IF NOT EXISTS `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(50) NOT NULL,
  `fecha_hora` datetime(6) NOT NULL,
  `doctor_id` int NOT NULL,
  `paciente_id` int NOT NULL,
  `procedimiento_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_citas_doctor` (`doctor_id`),
  KEY `idx_citas_paciente` (`paciente_id`),
  KEY `idx_citas_procedimiento` (`procedimiento_id`),
  CONSTRAINT `fk_citas_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`),
  CONSTRAINT `fk_citas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `fk_citas_procedimiento` FOREIGN KEY (`procedimiento_id`) REFERENCES `procedimientos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `eventos_calendario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` text,
  `fin` datetime(6) NOT NULL,
  `inicio` datetime(6) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `doctor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_eventos_calendario_doctor` (`doctor_id`),
  CONSTRAINT `fk_eventos_calendario_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `historias_clinicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_registro` datetime(6) NOT NULL,
  `observaciones` text NOT NULL,
  `cita_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `paciente_id` int NOT NULL,
  `datos_relevantes` text NOT NULL,
  `diagnostico` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_historias_clinicas_cita` (`cita_id`),
  KEY `idx_historias_clinicas_doctor` (`doctor_id`),
  KEY `idx_historias_clinicas_paciente` (`paciente_id`),
  CONSTRAINT `fk_historias_clinicas_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`),
  CONSTRAINT `fk_historias_clinicas_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`),
  CONSTRAINT `fk_historias_clinicas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
