USE `clinica_db`;

-- Usuarios de prueba
-- Contrasena para todos: Medflow123*
INSERT INTO `usuarios` (`email`, `password`, `rol`)
SELECT 'admin@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1
  FROM `usuarios`
  WHERE `email` = 'admin@medflow.com'
);

INSERT INTO `usuarios` (`email`, `password`, `rol`)
SELECT 'doctor.prueba@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'MEDICO'
WHERE NOT EXISTS (
  SELECT 1
  FROM `usuarios`
  WHERE `email` = 'doctor.prueba@medflow.com'
);

INSERT INTO `usuarios` (`email`, `password`, `rol`)
SELECT 'paciente.prueba@medflow.com', '$2a$10$ZCFgcMlM2IkM2buNWkBQC.H935KwcS6BGcd68CoRpgHJqGsUYINwm', 'PACIENTE'
WHERE NOT EXISTS (
  SELECT 1
  FROM `usuarios`
  WHERE `email` = 'paciente.prueba@medflow.com'
);

-- Doctores
INSERT INTO `doctores` (`especialidad`, `nombre_completo`, `registro_medico`, `email`)
SELECT 'Medicina General', 'Dra. Laura Gomez', 'RM-001', 'laura.gomez@medflow.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM `doctores`
  WHERE `email` = 'laura.gomez@medflow.com'
     OR `registro_medico` = 'RM-001'
);

INSERT INTO `doctores` (`especialidad`, `nombre_completo`, `registro_medico`, `email`)
SELECT 'Dermatologia', 'Dr. Andres Ruiz', 'RM-002', 'andres.ruiz@medflow.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM `doctores`
  WHERE `email` = 'andres.ruiz@medflow.com'
     OR `registro_medico` = 'RM-002'
);

-- Pacientes
INSERT INTO `pacientes` (`documento`, `nombre_completo`, `telefono`, `direccion`, `email`)
SELECT 'CC-1001001001', 'Ana Perez', '3001234567', 'Calle 10 # 20-30, Bogota', 'ana.perez@correo.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM `pacientes`
  WHERE `documento` = 'CC-1001001001'
     OR `email` = 'ana.perez@correo.com'
);

INSERT INTO `pacientes` (`documento`, `nombre_completo`, `telefono`, `direccion`, `email`)
SELECT 'CC-1001001002', 'Carlos Ramirez', '3001234568', 'Carrera 15 # 45-20, Bogota', 'carlos.ramirez@correo.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM `pacientes`
  WHERE `documento` = 'CC-1001001002'
     OR `email` = 'carlos.ramirez@correo.com'
);

INSERT INTO `pacientes` (`documento`, `nombre_completo`, `telefono`, `direccion`, `email`)
SELECT 'CC-1001001003', 'Maria Torres', '3001234569', 'Avenida 68 # 90-15, Bogota', 'maria.torres@correo.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM `pacientes`
  WHERE `documento` = 'CC-1001001003'
     OR `email` = 'maria.torres@correo.com'
);

-- Procedimientos
INSERT INTO `procedimientos` (`nombre`, `precio`, `duracion_minutos`)
SELECT 'Consulta General', 120000.00, 30
WHERE NOT EXISTS (
  SELECT 1
  FROM `procedimientos`
  WHERE `nombre` = 'Consulta General'
);

INSERT INTO `procedimientos` (`nombre`, `precio`, `duracion_minutos`)
SELECT 'Control Dermatologico', 180000.00, 45
WHERE NOT EXISTS (
  SELECT 1
  FROM `procedimientos`
  WHERE `nombre` = 'Control Dermatologico'
);

INSERT INTO `procedimientos` (`nombre`, `precio`, `duracion_minutos`)
SELECT 'Valoracion Prioritaria', 150000.00, 20
WHERE NOT EXISTS (
  SELECT 1
  FROM `procedimientos`
  WHERE `nombre` = 'Valoracion Prioritaria'
);

-- Citas
INSERT INTO `citas` (`estado`, `fecha_hora`, `doctor_id`, `paciente_id`, `procedimiento_id`)
SELECT 'COMPLETADA',
       '2026-05-10 09:00:00',
       d.`id`,
       p.`id`,
       pr.`id`
FROM `doctores` d
JOIN `pacientes` p ON p.`email` = 'ana.perez@correo.com'
JOIN `procedimientos` pr ON pr.`nombre` = 'Consulta General'
WHERE d.`email` = 'laura.gomez@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `citas` c
    JOIN `doctores` doctor ON doctor.`id` = c.`doctor_id`
    WHERE doctor.`email` = 'laura.gomez@medflow.com'
      AND c.`fecha_hora` = '2026-05-10 09:00:00'
  );

INSERT INTO `citas` (`estado`, `fecha_hora`, `doctor_id`, `paciente_id`, `procedimiento_id`)
SELECT 'PROGRAMADA',
       '2026-05-12 09:00:00',
       d.`id`,
       p.`id`,
       pr.`id`
FROM `doctores` d
JOIN `pacientes` p ON p.`email` = 'carlos.ramirez@correo.com'
JOIN `procedimientos` pr ON pr.`nombre` = 'Consulta General'
WHERE d.`email` = 'laura.gomez@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `citas` c
    JOIN `doctores` doctor ON doctor.`id` = c.`doctor_id`
    WHERE doctor.`email` = 'laura.gomez@medflow.com'
      AND c.`fecha_hora` = '2026-05-12 09:00:00'
  );

INSERT INTO `citas` (`estado`, `fecha_hora`, `doctor_id`, `paciente_id`, `procedimiento_id`)
SELECT 'PROGRAMADA',
       '2026-05-12 11:00:00',
       d.`id`,
       p.`id`,
       pr.`id`
FROM `doctores` d
JOIN `pacientes` p ON p.`email` = 'maria.torres@correo.com'
JOIN `procedimientos` pr ON pr.`nombre` = 'Control Dermatologico'
WHERE d.`email` = 'andres.ruiz@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `citas` c
    JOIN `doctores` doctor ON doctor.`id` = c.`doctor_id`
    WHERE doctor.`email` = 'andres.ruiz@medflow.com'
      AND c.`fecha_hora` = '2026-05-12 11:00:00'
  );

INSERT INTO `citas` (`estado`, `fecha_hora`, `doctor_id`, `paciente_id`, `procedimiento_id`)
SELECT 'CANCELADA',
       '2026-05-13 08:30:00',
       d.`id`,
       p.`id`,
       pr.`id`
FROM `doctores` d
JOIN `pacientes` p ON p.`email` = 'maria.torres@correo.com'
JOIN `procedimientos` pr ON pr.`nombre` = 'Valoracion Prioritaria'
WHERE d.`email` = 'laura.gomez@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `citas` c
    JOIN `doctores` doctor ON doctor.`id` = c.`doctor_id`
    WHERE doctor.`email` = 'laura.gomez@medflow.com'
      AND c.`fecha_hora` = '2026-05-13 08:30:00'
  );

-- Eventos de calendario
INSERT INTO `eventos_calendario` (`descripcion`, `fin`, `inicio`, `titulo`, `doctor_id`)
SELECT 'Revision de agenda semanal',
       '2026-05-12 08:30:00',
       '2026-05-12 08:00:00',
       'Reunion administrativa',
       d.`id`
FROM `doctores` d
WHERE d.`email` = 'laura.gomez@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `eventos_calendario` e
    JOIN `doctores` doctor ON doctor.`id` = e.`doctor_id`
    WHERE doctor.`email` = 'laura.gomez@medflow.com'
      AND e.`inicio` = '2026-05-12 08:00:00'
  );

INSERT INTO `eventos_calendario` (`descripcion`, `fin`, `inicio`, `titulo`, `doctor_id`)
SELECT 'Capacitacion en manejo de historias clinicas',
       '2026-05-12 16:00:00',
       '2026-05-12 15:00:00',
       'Capacitacion interna',
       d.`id`
FROM `doctores` d
WHERE d.`email` = 'andres.ruiz@medflow.com'
  AND NOT EXISTS (
    SELECT 1
    FROM `eventos_calendario` e
    JOIN `doctores` doctor ON doctor.`id` = e.`doctor_id`
    WHERE doctor.`email` = 'andres.ruiz@medflow.com'
      AND e.`inicio` = '2026-05-12 15:00:00'
  );

-- Historia clinica asociada a la cita completada
INSERT INTO `historias_clinicas`
  (`fecha_registro`, `observaciones`, `cita_id`, `doctor_id`, `paciente_id`, `datos_relevantes`, `diagnostico`)
SELECT '2026-05-10 09:30:00',
       'Dolor de garganta de dos dias de evolucion',
       c.`id`,
       d.`id`,
       p.`id`,
       'Sin alergias reportadas',
       'Faringitis aguda'
FROM `citas` c
JOIN `doctores` d ON d.`id` = c.`doctor_id`
JOIN `pacientes` p ON p.`id` = c.`paciente_id`
JOIN `procedimientos` pr ON pr.`id` = c.`procedimiento_id`
WHERE d.`email` = 'laura.gomez@medflow.com'
  AND p.`email` = 'ana.perez@correo.com'
  AND pr.`nombre` = 'Consulta General'
  AND c.`fecha_hora` = '2026-05-10 09:00:00'
  AND NOT EXISTS (
    SELECT 1
    FROM `historias_clinicas` h
    WHERE h.`cita_id` = c.`id`
  );
