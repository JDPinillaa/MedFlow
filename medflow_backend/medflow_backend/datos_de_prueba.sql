USE `clinica_db`;


-- Usuarios de prueba
-- Contrasena para todos: Medflow123*
INSERT INTO `usuarios` (`id`, `email`, `password`, `rol`) VALUES 
(1, 'admin@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'ADMIN'),
(2, 'doctor.prueba@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'MEDICO'),
(3, 'paciente.prueba@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'PACIENTE');

-- Doctores
INSERT INTO `doctores` (`id`, `especialidad`, `nombre_completo`, `registro_medico`, `email`) VALUES 
(1, 'Medicina General', 'Dr. Ever Quintero', 'RM-001', 'ever@medflow.com'),
(2, 'Dermatologia', 'Dra. Diana Marcela Henao', 'RM-002', 'profe@medflow.com');

-- Pacientes
INSERT INTO `pacientes` (`id`, `documento`, `nombre_completo`, `telefono`, `direccion`, `email`) VALUES 
(1, 'CC-1001001001', 'Juan Diego Pinilla', '3001234567', 'Calle 10 # 20-30, Villamaria', 'juandi@correo.com'),
(2, 'CC-1001001002', 'Juan David Gomez', '3001234568', 'Carrera 15 # 45-20, Chinchina', 'juanda@correo.com'),
(3, 'CC-1001001003', 'Santiago Uribe', '3001234569', 'Avenida 68 # 90-15, Manizales', 'santi@correo.com');

-- Procedimientos
INSERT INTO `procedimientos` (`id`, `nombre`, `precio`, `duracion_minutos`) VALUES 
(1, 'Consulta General', 120000.00, 30),
(2, 'Control Dermatologico', 180000.00, 45),
(3, 'Valoracion Prioritaria', 150000.00, 20);

-- Citas
INSERT INTO `citas` (`id`, `estado`, `fecha_hora`, `doctor_id`, `paciente_id`, `procedimiento_id`) VALUES 
(1, 'COMPLETADA', '2026-05-10 09:00:00', 1, 1, 1),
(2, 'PROGRAMADA', '2026-05-12 09:00:00', 1, 2, 1),
(3, 'PROGRAMADA', '2026-05-12 11:00:00', 2, 3, 2),
(4, 'CANCELADA',  '2026-05-13 08:30:00', 1, 3, 3);

-- Eventos de calendario
INSERT INTO `eventos_calendario` (`id`, `descripcion`, `fin`, `inicio`, `titulo`, `doctor_id`) VALUES 
(1, 'Revision de agenda semanal', '2026-05-12 08:30:00', '2026-05-12 08:00:00', 'Reunion administrativa', 1),
(2, 'Capacitacion en manejo de historias clinicas', '2026-05-12 16:00:00', '2026-05-12 15:00:00', 'Capacitacion interna', 2);

-- Historia clinica asociada a la cita completada
INSERT INTO `historias_clinicas` (`id`, `fecha_registro`, `observaciones`, `cita_id`, `doctor_id`, `paciente_id`, `datos_relevantes`, `diagnostico`) VALUES 
(1, '2026-05-10 09:30:00', 'Dolor de garganta de dos dias de evolucion', 1, 1, 1, 'Sin alergias reportadas', 'Faringitis aguda');
