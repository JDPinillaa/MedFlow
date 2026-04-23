# Guia de validacion backend con Thunder Client

Esta guia resume el orden recomendado para validar el backend antes de iniciar el frontend. Las pruebas se ejecutan contra `http://localhost:8080` con el backend levantado desde esta carpeta:

```bash
./mvnw spring-boot:run
```

Los datos creados en Thunder Client quedan persistidos en MySQL (`clinica_db`) hasta que se eliminen por endpoints o se limpie la base de datos manualmente.

## Orden recomendado

1. Crear paciente: `POST /api/pacientes`
2. Crear doctor: `POST /api/doctores`
3. Crear procedimiento: `POST /api/procedimientos`
4. Crear cita: `POST /api/citas`
5. Editar doctor: `PUT /api/doctores/{id}`
6. Crear historia clinica: `POST /api/historias-clinicas`
7. Consultar historia por id: `GET /api/historias-clinicas/{id}`
8. Consultar historia por paciente: `GET /api/historias-clinicas/paciente/{pacienteId}`
9. Crear evento de calendario: `POST /api/calendario/eventos`
10. Ver calendario integrado: `GET /api/calendario?doctorId=1&desde=2026-04-30T00:00:00&hasta=2026-05-01T00:00:00`

## Bodies principales

Paciente:

```json
{
  "nombreCompleto": "Ana Perez",
  "documento": "123456789",
  "telefono": "3001234567",
  "email": "ana.perez@correo.com",
  "direccion": "Calle 10 # 20-30"
}
```

Doctor:

```json
{
  "nombreCompleto": "Dra. Laura Gomez",
  "especialidad": "Medicina General",
  "registroMedico": "RM-001",
  "email": "laura.gomez@medflow.com"
}
```

Procedimiento:

```json
{
  "nombre": "Consulta General",
  "descripcion": "Consulta medica general",
  "precio": 120000,
  "duracionMinutos": 30
}
```

Cita:

```json
{
  "pacienteId": 1,
  "doctorId": 1,
  "procedimientoId": 1,
  "fechaHora": "2026-04-30T10:00:00",
  "estado": "PROGRAMADA"
}
```

Historia clinica:

```json
{
  "citaId": 1,
  "diagnostico": "Faringitis aguda",
  "observaciones": "Paciente refiere dolor de garganta de dos dias de evolucion.",
  "datosRelevantes": "Sin alergias reportadas. Signos vitales dentro de rangos normales."
}
```

Evento de calendario:

```json
{
  "doctorId": 1,
  "titulo": "Reunion administrativa",
  "descripcion": "Revision de agenda semanal",
  "inicio": "2026-04-30T14:00:00",
  "fin": "2026-04-30T15:00:00"
}
```

## Casos negativos obligatorios

- Doctor: editar con email usado por otro doctor debe responder `409`.
- Doctor: editar con registro medico usado por otro doctor debe responder `409`.
- Historia clinica: crear con campos vacios debe responder `400`.
- Historia clinica: crear para cita cancelada debe responder `409`.
- Historia clinica: crear dos veces para la misma cita debe responder `409`.
- Calendario: crear evento con `fin` antes o igual a `inicio` debe responder `409`.
- Calendario: crear evento cruzado con una cita activa debe responder `409`.
- Calendario: crear evento cruzado con otro evento debe responder `409`.

## Cierre esperado

Antes de pasar al frontend, ejecutar:

```bash
./mvnw test
```

La suite debe finalizar con `BUILD SUCCESS`.
