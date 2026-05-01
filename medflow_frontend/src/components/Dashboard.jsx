import { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import logoDashboard from '../assets/logoDashboard.png'

const THEME_STORAGE_KEY = 'medflow-theme'

const FALLBACK_APPOINTMENTS = [
  {
    id: 'fallback-1',
    fechaHora: '2026-05-10T09:00:00',
    estado: 'COMPLETADA',
    pacienteId: 'patient-1',
    pacienteNombre: 'Ana Perez',
    doctorId: 'doctor-1',
    procedimientoNombre: 'Consulta General',
    procedimientoId: 'procedure-1',
    doctorNombre: 'Dra. Laura Gomez',
  },
  {
    id: 'fallback-2',
    fechaHora: '2026-05-12T09:00:00',
    estado: 'PROGRAMADA',
    pacienteId: 'patient-2',
    pacienteNombre: 'Carlos Ramirez',
    doctorId: 'doctor-1',
    procedimientoNombre: 'Consulta General',
    procedimientoId: 'procedure-1',
    doctorNombre: 'Dra. Laura Gomez',
  },
  {
    id: 'fallback-3',
    fechaHora: '2026-05-12T11:00:00',
    estado: 'PROGRAMADA',
    pacienteId: 'patient-3',
    pacienteNombre: 'Maria Torres',
    doctorId: 'doctor-2',
    procedimientoNombre: 'Control Dermatologico',
    procedimientoId: 'procedure-2',
    doctorNombre: 'Dr. Andres Ruiz',
  },
]

const FALLBACK_PATIENTS = [
  {
    id: 'patient-1',
    nombreCompleto: 'Ana Perez',
    documento: 'CC-1001001001',
    telefono: '3001234567',
    email: 'ana.perez@correo.com',
    direccion: 'Calle 10 # 20-30, Bogota',
  },
  {
    id: 'patient-2',
    nombreCompleto: 'Carlos Ramirez',
    documento: 'CC-1001001002',
    telefono: '3001234568',
    email: 'carlos.ramirez@correo.com',
    direccion: 'Carrera 15 # 45-20, Bogota',
  },
  {
    id: 'patient-3',
    nombreCompleto: 'Maria Torres',
    documento: 'CC-1001001003',
    telefono: '3001234569',
    email: 'maria.torres@correo.com',
    direccion: 'Avenida 68 # 90-15, Bogota',
  },
]

const FALLBACK_DOCTORS = [
  {
    id: 'doctor-1',
    nombreCompleto: 'Dra. Laura Gomez',
    especialidad: 'Medicina General',
    email: 'laura.gomez@medflow.com',
  },
  {
    id: 'doctor-2',
    nombreCompleto: 'Dr. Andres Ruiz',
    especialidad: 'Dermatologia',
    email: 'doctor.prueba@medflow.com',
  },
]

const FALLBACK_PROCEDURES = [
  { id: 'procedure-1', nombre: 'Consulta General', duracionMinutos: 30 },
  { id: 'procedure-2', nombre: 'Control Dermatologico', duracionMinutos: 45 },
  { id: 'procedure-3', nombre: 'Resultados de Laboratorio', duracionMinutos: 25 },
]

const FALLBACK_CALENDAR_EVENTS = [
  {
    id: 'event-fallback-1',
    tipo: 'EVENTO',
    titulo: 'Revisión de resultados pendientes',
    descripcion: 'Bloque reservado para revisar resultados de laboratorio antes de la jornada.',
    inicio: '2026-05-12T08:00:00',
    fin: '2026-05-12T08:30:00',
    doctorId: 'doctor-1',
    doctorNombre: 'Dra. Laura Gomez',
    eventoId: 'event-fallback-1',
  },
  {
    id: 'event-fallback-2',
    tipo: 'EVENTO',
    titulo: 'Reunión administrativa',
    descripcion: 'Revisión de disponibilidad y coordinación del consultorio.',
    inicio: '2026-05-12T15:00:00',
    fin: '2026-05-12T16:00:00',
    doctorId: 'doctor-2',
    doctorNombre: 'Dr. Andres Ruiz',
    eventoId: 'event-fallback-2',
  },
]

const FALLBACK_CLINICAL_RECORDS = {
  'patient-1': [
    {
      id: 'history-fallback-1',
      fechaRegistro: '2026-05-10T09:30:00',
      diagnostico: 'Faringitis aguda',
      observaciones:
        'Paciente refiere odinofagia de dos dias de evolucion, sin fiebre persistente. Se indica manejo sintomatico, hidratacion y signos de alarma.',
      datosRelevantes:
        'Sin alergias reportadas. Presion arterial 118/76 mmHg, frecuencia cardiaca 74 lpm, saturacion 98%.',
      citaId: 'fallback-1',
      citaFechaHora: '2026-05-10T09:00:00',
      citaEstado: 'COMPLETADA',
      doctorId: 'doctor-1',
      doctorNombre: 'Dra. Laura Gomez',
      doctorEspecialidad: 'Medicina General',
      procedimientoId: 'procedure-1',
      procedimientoNombre: 'Consulta General',
    },
    {
      id: 'history-fallback-2',
      fechaRegistro: '2026-03-18T10:20:00',
      diagnostico: 'Control preventivo anual',
      observaciones:
        'Revision general sin hallazgos de alarma. Se refuerzan habitos de sueno, actividad fisica regular y tamizajes segun edad.',
      datosRelevantes:
        'Antecedentes familiares no contributivos. Peso estable y examen fisico dentro de parametros esperados.',
      citaId: 'fallback-history-appointment-2',
      citaFechaHora: '2026-03-18T10:00:00',
      citaEstado: 'COMPLETADA',
      doctorId: 'doctor-1',
      doctorNombre: 'Dra. Laura Gomez',
      doctorEspecialidad: 'Medicina General',
      procedimientoId: 'procedure-1',
      procedimientoNombre: 'Consulta General',
    },
  ],
  'patient-2': [
    {
      id: 'history-fallback-3',
      fechaRegistro: '2026-04-22T11:40:00',
      diagnostico: 'Seguimiento de presion arterial',
      observaciones:
        'Lecturas domiciliarias con tendencia a la estabilidad. Se mantiene vigilancia mensual y registro de sintomas asociados.',
      datosRelevantes:
        'Sin alergias medicamentosas conocidas. Se recomienda reducir consumo de sodio y aumentar caminatas semanales.',
      citaId: 'fallback-history-appointment-3',
      citaFechaHora: '2026-04-22T11:00:00',
      citaEstado: 'COMPLETADA',
      doctorId: 'doctor-1',
      doctorNombre: 'Dra. Laura Gomez',
      doctorEspecialidad: 'Medicina General',
      procedimientoId: 'procedure-1',
      procedimientoNombre: 'Consulta General',
    },
  ],
  'patient-3': [
    {
      id: 'history-fallback-4',
      fechaRegistro: '2026-04-08T15:25:00',
      diagnostico: 'Dermatitis irritativa leve',
      observaciones:
        'Lesiones eritematosas localizadas sin signos de infeccion. Se formula manejo topico y control en seis semanas.',
      datosRelevantes:
        'Antecedente de piel sensible. Evitar fragancias y registrar respuesta al tratamiento indicado.',
      citaId: 'fallback-history-appointment-4',
      citaFechaHora: '2026-04-08T15:00:00',
      citaEstado: 'COMPLETADA',
      doctorId: 'doctor-2',
      doctorNombre: 'Dr. Andres Ruiz',
      doctorEspecialidad: 'Dermatologia',
      procedimientoId: 'procedure-2',
      procedimientoNombre: 'Control Dermatologico',
    },
  ],
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'pacientes', label: 'Pacientes', icon: UsersIcon },
  { id: 'citas', label: 'Citas', icon: ClockIcon },
  { id: 'calendario', label: 'Calendario', icon: CalendarIcon },
]

const WEEK_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const CALENDAR_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const MONTH_WEEK_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function fetchWithAuth(apiBaseUrl, token, path, signal) {
  return fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`No fue posible cargar ${path}`)
    }

    return response.json()
  })
}

function fetchCalendarWithAuth(apiBaseUrl, token, doctorId, startDate, endDate, signal) {
  const params = new URLSearchParams({
    doctorId: String(doctorId),
    desde: toLocalDateTimeParam(startDate),
    hasta: toLocalDateTimeParam(endDate),
  })

  return fetchWithAuth(apiBaseUrl, token, `/calendario?${params.toString()}`, signal)
}

function requestWithAuth(apiBaseUrl, token, path, options = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  }).then(async (response) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(payload?.mensaje ?? 'No fue posible completar la operación.')
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  })
}

function normalizeName(email) {
  if (!email) {
    return 'Usuario'
  }

  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getGreetingName(session) {
  if (session.rol === 'MEDICO') {
    return `Dr. ${normalizeName(session.email).replace(/^Doctor\s+/i, '')}`
  }

  if (session.rol === 'ADMIN') {
    return 'Administrador'
  }

  return normalizeName(session.email)
}

function getInitials(value) {
  return normalizeName(value)
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function parseDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function formatTime(value) {
  const date = parseDate(value)

  if (!date) {
    return '--:--'
  }

  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function formatShortDate(value) {
  const date = parseDate(value)

  if (!date) {
    return 'Sin registro'
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getDateInputValue(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

function getDateTimeInputValue(value) {
  const date = value ? parseDate(value) : new Date()

  if (!date) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function toLocalDateTimeParam(date) {
  return `${getDateTimeInputValue(date)}:00`
}

function addDays(date, amount) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function addMinutes(date, amount) {
  const nextDate = new Date(date)
  nextDate.setMinutes(nextDate.getMinutes() + amount)
  return nextDate
}

function startOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function endOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

function startOfWorkWeek(date) {
  const nextDate = startOfDay(date)
  const day = nextDate.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addDays(nextDate, offset)
}

function endOfMonth(date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

function getNextHourDate() {
  const date = new Date()
  date.setHours(date.getHours() + 1, 0, 0, 0)
  return date
}

function formatStatus(status) {
  return status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'Programada'
}

function getStatusClass(status) {
  const normalized = status?.toLowerCase()

  if (normalized === 'completada') {
    return 'is-done'
  }

  if (normalized === 'cancelada') {
    return 'is-cancelled'
  }

  return 'is-pending'
}

function getWeekdayIndex(value) {
  const date = parseDate(value)

  if (!date) {
    return -1
  }

  const day = date.getDay()
  return day === 0 ? -1 : day - 1
}

function buildWeeklyData(appointments) {
  const totals = [0, 0, 0, 0, 0, 0]

  appointments.forEach((appointment) => {
    const index = getWeekdayIndex(appointment.fechaHora)

    if (index >= 0 && index < totals.length && appointment.estado !== 'CANCELADA') {
      totals[index] += 1
    }
  })

  return totals.some(Boolean) ? totals : [2, 3, 2, 4, 3, 1]
}

function buildChartPath(values) {
  const maxValue = Math.max(...values, 1)
  const width = 280
  const height = 132
  const step = width / (values.length - 1)
  const points = values.map((value, index) => {
    const x = index * step
    const y = height - (value / maxValue) * 96 - 18
    return [x, y]
  })
  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return { area, line, maxValue }
}

function getPatientAppointmentCount(patientId, appointments) {
  return appointments.filter((appointment) => appointment.pacienteId === patientId).length
}

function getPatientLastAppointment(patientId, appointments) {
  return appointments
    .filter((appointment) => appointment.pacienteId === patientId)
    .map((appointment) => parseDate(appointment.fechaHora))
    .filter(Boolean)
    .sort((first, second) => second - first)[0]
}

function patientMatchesSearch(patient, searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase()

  if (!normalizedTerm) {
    return true
  }

  return [patient.nombreCompleto, patient.documento, patient.telefono, patient.email]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedTerm))
}

function buildPatientPayload(formValues) {
  return {
    nombreCompleto: formValues.nombreCompleto.trim(),
    documento: formValues.documento.trim(),
    telefono: formValues.telefono.trim(),
    email: formValues.email.trim(),
    direccion: formValues.direccion.trim(),
  }
}

function getEmptyPatientForm() {
  return {
    nombreCompleto: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
  }
}

function getPatientFormFromRecord(patient) {
  return {
    nombreCompleto: patient.nombreCompleto ?? '',
    documento: patient.documento ?? '',
    telefono: patient.telefono ?? '',
    email: patient.email ?? '',
    direccion: patient.direccion ?? '',
  }
}

function getEmptyClinicalRecordForm(citaId = '') {
  return {
    citaId,
    diagnostico: '',
    observaciones: '',
    datosRelevantes: '',
  }
}

function buildClinicalRecordPayload(formValues) {
  return {
    citaId: toNumericId(formValues.citaId),
    diagnostico: formValues.diagnostico.trim(),
    observaciones: formValues.observaciones.trim(),
    datosRelevantes: formValues.datosRelevantes.trim(),
  }
}

function getClinicalRecordDate(record) {
  return parseDate(record.fechaRegistro) ?? parseDate(record.citaFechaHora)
}

function sortClinicalRecords(records) {
  return [...records].sort((first, second) => {
    const firstDate = getClinicalRecordDate(first)
    const secondDate = getClinicalRecordDate(second)

    return (secondDate?.getTime() ?? 0) - (firstDate?.getTime() ?? 0)
  })
}

function formatClinicalDate(value) {
  const date = parseDate(value)

  if (!date) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace('.', '')
    .toUpperCase()
}

function getFallbackClinicalKey(patient) {
  const patientId = String(patient.id)

  if (FALLBACK_CLINICAL_RECORDS[patientId]) {
    return patientId
  }

  const numericId = Number(patient.id)

  if (Number.isInteger(numericId) && FALLBACK_CLINICAL_RECORDS[`patient-${numericId}`]) {
    return `patient-${numericId}`
  }

  const normalizedName = normalizeName(patient.nombreCompleto).toLowerCase()

  if (normalizedName.includes('ana') || normalizedName.includes('juan diego')) {
    return 'patient-1'
  }

  if (normalizedName.includes('carlos') || normalizedName.includes('juan david')) {
    return 'patient-2'
  }

  if (normalizedName.includes('maria') || normalizedName.includes('santiago')) {
    return 'patient-3'
  }

  return patientId
}

function getFallbackClinicalRecords(patient, appointments) {
  const fallbackKey = getFallbackClinicalKey(patient)
  const configuredRecords = FALLBACK_CLINICAL_RECORDS[fallbackKey]

  if (configuredRecords) {
    return sortClinicalRecords(
      configuredRecords.map((record) => ({
        ...record,
        pacienteId: patient.id,
        pacienteNombre: patient.nombreCompleto,
      })),
    )
  }

  return sortClinicalRecords(
    appointments
      .filter(
        (appointment) =>
          String(appointment.pacienteId) === String(patient.id) &&
          appointment.estado === 'COMPLETADA',
      )
      .map((appointment) => ({
        id: `history-derived-${appointment.id}`,
        fechaRegistro: appointment.fechaHora,
        diagnostico: appointment.procedimientoNombre ?? 'Atencion clinica',
        observaciones: 'Registro generado desde una cita completada mientras se sincroniza la historia clinica.',
        datosRelevantes: 'Datos clinicos pendientes por consolidar.',
        citaId: appointment.id,
        citaFechaHora: appointment.fechaHora,
        citaEstado: appointment.estado,
        pacienteId: patient.id,
        pacienteNombre: patient.nombreCompleto,
        doctorId: appointment.doctorId,
        doctorNombre: appointment.doctorNombre,
        doctorEspecialidad: 'Equipo medico',
        procedimientoId: appointment.procedimientoId,
        procedimientoNombre: appointment.procedimientoNombre,
      })),
  )
}

function getClinicalRecordKind(record) {
  const source = `${record.procedimientoNombre ?? ''} ${record.diagnostico ?? ''}`.toLowerCase()

  if (source.includes('lab') || source.includes('perfil') || source.includes('hemoglobina')) {
    return 'lab'
  }

  if (source.includes('receta') || source.includes('medic') || source.includes('formula')) {
    return 'medication'
  }

  if (source.includes('control') || source.includes('seguimiento')) {
    return 'control'
  }

  return 'consultation'
}

function getClinicalKindLabel(kind) {
  if (kind === 'lab') {
    return 'Laboratorio'
  }

  if (kind === 'medication') {
    return 'Medicacion'
  }

  if (kind === 'control') {
    return 'Control'
  }

  return 'Consulta'
}

function getAvailableAppointmentsForClinicalRecord(patient, appointments, clinicalRecords) {
  const usedAppointmentIds = new Set(clinicalRecords.map((record) => String(record.citaId)))

  return appointments
    .filter(
      (appointment) =>
        String(appointment.pacienteId) === String(patient.id) &&
        appointment.estado !== 'CANCELADA' &&
        !usedAppointmentIds.has(String(appointment.id)),
    )
    .sort((first, second) => parseDate(second.fechaHora) - parseDate(first.fechaHora))
}

function getNextPatientAppointment(patientId, appointments) {
  const now = new Date()

  return appointments
    .filter((appointment) => {
      const date = parseDate(appointment.fechaHora)

      return (
        String(appointment.pacienteId) === String(patientId) &&
        appointment.estado !== 'CANCELADA' &&
        date &&
        date >= now
      )
    })
    .sort((first, second) => parseDate(first.fechaHora) - parseDate(second.fechaHora))[0]
}

function appointmentMatchesSearch(appointment, searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase()

  if (!normalizedTerm) {
    return true
  }

  return [
    appointment.pacienteNombre,
    appointment.procedimientoNombre,
    appointment.doctorNombre,
    appointment.estado,
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedTerm))
}

function appointmentMatchesDate(appointment, dateFilter) {
  if (!dateFilter) {
    return true
  }

  const date = parseDate(appointment.fechaHora)
  return date ? getDateInputValue(date) === dateFilter : false
}

function appointmentMatchesStatus(appointment, statusFilter) {
  return statusFilter === 'TODOS' || appointment.estado === statusFilter
}

function getEmptyAppointmentForm(doctorId = '') {
  return {
    pacienteId: '',
    doctorId,
    procedimientoId: '',
    fechaHora: getDateTimeInputValue(),
    estado: 'PROGRAMADA',
  }
}

function getAppointmentFormFromRecord(appointment) {
  return {
    pacienteId: appointment.pacienteId ? String(appointment.pacienteId) : '',
    doctorId: appointment.doctorId ? String(appointment.doctorId) : '',
    procedimientoId: appointment.procedimientoId ? String(appointment.procedimientoId) : '',
    fechaHora: getDateTimeInputValue(appointment.fechaHora),
    estado: appointment.estado ?? 'PROGRAMADA',
  }
}

function toNumericId(value) {
  if (value === '') {
    return ''
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? value : parsedValue
}

function buildAppointmentPayload(formValues) {
  return {
    pacienteId: toNumericId(formValues.pacienteId),
    doctorId: toNumericId(formValues.doctorId),
    procedimientoId: toNumericId(formValues.procedimientoId),
    fechaHora: formValues.fechaHora,
    estado: formValues.estado,
  }
}

function getCurrentDoctor(doctors, session) {
  return doctors.find((doctor) => doctor.email === session.email) ?? doctors[0]
}

function appointmentToCalendarItem(appointment) {
  const startDate = parseDate(appointment.fechaHora)
  const duration = appointment.procedimientoDuracionMinutos ?? 30

  return {
    id: `cita-${appointment.id}`,
    tipo: 'CITA',
    titulo: `${appointment.procedimientoNombre} - ${appointment.pacienteNombre}`,
    descripcion: null,
    inicio: appointment.fechaHora,
    fin: startDate ? getDateTimeInputValue(addMinutes(startDate, duration)) : appointment.fechaHora,
    estado: appointment.estado,
    doctorId: appointment.doctorId,
    doctorNombre: appointment.doctorNombre,
    pacienteId: appointment.pacienteId,
    pacienteNombre: appointment.pacienteNombre,
    citaId: appointment.id,
    eventoId: null,
    procedimientoId: appointment.procedimientoId,
    procedimientoNombre: appointment.procedimientoNombre,
  }
}

function buildFallbackCalendarItems() {
  return [
    ...FALLBACK_APPOINTMENTS.map(appointmentToCalendarItem),
    ...FALLBACK_CALENDAR_EVENTS,
  ].sort((first, second) => parseDate(first.inicio) - parseDate(second.inicio))
}

function getCalendarRange(date, view) {
  if (view === 'day') {
    return {
      start: startOfDay(date),
      end: endOfDay(date),
    }
  }

  if (view === 'month') {
    return {
      start: startOfDay(new Date(date.getFullYear(), date.getMonth(), 1)),
      end: endOfMonth(date),
    }
  }

  const weekStart = startOfWorkWeek(date)

  return {
    start: weekStart,
    end: endOfDay(addDays(weekStart, 4)),
  }
}

function getCalendarDays(date, view) {
  if (view === 'day') {
    return [startOfDay(date)]
  }

  const weekStart = startOfWorkWeek(date)
  return Array.from({ length: 5 }, (_, index) => addDays(weekStart, index))
}

function getMonthCalendarDays(date) {
  const firstDay = startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
  const monthStartOffset = firstDay.getDay() === 0 ? -6 : 1 - firstDay.getDay()
  const gridStart = addDays(firstDay, monthStartOffset)

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

function getInitialCalendarDate(appointments) {
  const now = new Date()
  const upcomingAppointment = appointments
    .filter((appointment) => appointment.estado !== 'CANCELADA')
    .map((appointment) => parseDate(appointment.fechaHora))
    .filter(Boolean)
    .filter((date) => date >= now)
    .sort((first, second) => first - second)[0]

  return upcomingAppointment ?? now
}

function formatCalendarTitle(date, view, days) {
  if (view === 'day') {
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  if (view === 'month') {
    return new Intl.DateTimeFormat('es-CO', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const firstDay = days[0]
  const lastDay = days[days.length - 1]
  const month = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(firstDay)

  return `${month} ${firstDay.getDate()} - ${lastDay.getDate()}, ${firstDay.getFullYear()}`
}

function formatWeekdayLabel(date) {
  return new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(date)
}

function formatCalendarItemRange(item) {
  return `${formatTime(item.inicio)} - ${formatTime(item.fin)}`
}

function isCalendarItemOnDay(item, date) {
  const startDate = parseDate(item.inicio)
  return startDate ? isSameDay(startDate, date) : false
}

function getCalendarSlotItems(items, date, hour) {
  return items.filter((item) => {
    const startDate = parseDate(item.inicio)
    return startDate ? isSameDay(startDate, date) && startDate.getHours() === hour : false
  })
}

function getCalendarItemClass(item) {
  if (item.tipo === 'EVENTO') {
    return 'is-event'
  }

  if (item.estado === 'COMPLETADA') {
    return 'is-completed'
  }

  if (item.estado === 'CANCELADA') {
    return 'is-cancelled'
  }

  return 'is-scheduled'
}

function getDefaultEventStart(calendarDate) {
  const selectedDate = new Date(calendarDate)
  selectedDate.setHours(9, 0, 0, 0)

  return selectedDate > new Date() ? selectedDate : getNextHourDate()
}

function getEmptyCalendarEventForm(calendarDate = new Date()) {
  const startDate = getDefaultEventStart(calendarDate)

  return {
    titulo: '',
    descripcion: '',
    inicio: getDateTimeInputValue(startDate),
    fin: getDateTimeInputValue(addMinutes(startDate, 30)),
  }
}

function buildCalendarEventPayload(formValues, doctorId) {
  return {
    doctorId: toNumericId(doctorId),
    titulo: formValues.titulo.trim(),
    descripcion: formValues.descripcion.trim(),
    inicio: formValues.inicio,
    fin: formValues.fin,
  }
}

function Dashboard({ apiBaseUrl, onLogout, session }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  })
  const [data, setData] = useState({
    appointments: [],
    calendarItems: [],
    dashboardCalendarItems: [],
    doctors: [],
    patients: [],
    procedures: [],
  })
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState(null)
  const [quickMessage, setQuickMessage] = useState(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientForm, setPatientForm] = useState(getEmptyPatientForm)
  const [patientFormOpen, setPatientFormOpen] = useState(false)
  const [patientFeedback, setPatientFeedback] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientHistories, setPatientHistories] = useState({})
  const [clinicalRecordForm, setClinicalRecordForm] = useState(getEmptyClinicalRecordForm)
  const [clinicalRecordFormOpen, setClinicalRecordFormOpen] = useState(false)
  const [clinicalFeedback, setClinicalFeedback] = useState(null)
  const [savingClinicalRecord, setSavingClinicalRecord] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [savingPatient, setSavingPatient] = useState(false)
  const [appointmentSearch, setAppointmentSearch] = useState('')
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('TODOS')
  const [appointmentDateFilter, setAppointmentDateFilter] = useState('')
  const [appointmentForm, setAppointmentForm] = useState(getEmptyAppointmentForm)
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [appointmentFeedback, setAppointmentFeedback] = useState(null)
  const [savingAppointment, setSavingAppointment] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [calendarDateTouched, setCalendarDateTouched] = useState(false)
  const [calendarView, setCalendarView] = useState('week')
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [calendarFeedback, setCalendarFeedback] = useState(null)
  const [calendarEventForm, setCalendarEventForm] = useState(getEmptyCalendarEventForm)
  const [calendarEventFormOpen, setCalendarEventFormOpen] = useState(false)
  const [savingCalendarEvent, setSavingCalendarEvent] = useState(false)
  const selectedPatientId = selectedPatient?.id ?? null

  const currentDoctor = getCurrentDoctor(data.doctors, session)
  const calendarRange = useMemo(
    () => getCalendarRange(calendarDate, calendarView),
    [calendarDate, calendarView],
  )
  const calendarDays = useMemo(
    () => getCalendarDays(calendarDate, calendarView),
    [calendarDate, calendarView],
  )
  const monthCalendarDays = useMemo(
    () => getMonthCalendarDays(calendarDate),
    [calendarDate],
  )
  const calendarTitle = useMemo(
    () => formatCalendarTitle(calendarDate, calendarView, calendarDays),
    [calendarDate, calendarDays, calendarView],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      setLoading(true)
      setSyncError(null)

      try {
        const [appointments, patients, doctors, procedures] = await Promise.all([
          fetchWithAuth(apiBaseUrl, session.token, '/citas', controller.signal),
          fetchWithAuth(apiBaseUrl, session.token, '/pacientes', controller.signal),
          fetchWithAuth(apiBaseUrl, session.token, '/doctores', controller.signal),
          fetchWithAuth(apiBaseUrl, session.token, '/procedimientos', controller.signal),
        ])

        setData((currentData) => ({
          ...currentData,
          appointments,
          patients,
          doctors,
          procedures,
        }))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setData({
            appointments: FALLBACK_APPOINTMENTS,
            calendarItems: buildFallbackCalendarItems(),
            dashboardCalendarItems: buildFallbackCalendarItems(),
            patients: FALLBACK_PATIENTS,
            doctors: FALLBACK_DOCTORS,
            procedures: FALLBACK_PROCEDURES,
          })
          setSyncError('Mostrando datos de referencia mientras se sincroniza el servidor.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()

    return () => controller.abort()
  }, [apiBaseUrl, session.token])

  useEffect(() => {
    if (!selectedPatient || !selectedPatientId || patientFormOpen) {
      return undefined
    }

    const controller = new AbortController()

    setPatientHistories((currentHistories) => ({
      ...currentHistories,
      [selectedPatientId]: {
        error: null,
        records: currentHistories[selectedPatientId]?.records ?? [],
        status: 'loading',
      },
    }))

    async function loadPatientHistory() {
      try {
        const records = await fetchWithAuth(
          apiBaseUrl,
          session.token,
          `/historias-clinicas/paciente/${selectedPatientId}`,
          controller.signal,
        )

        setPatientHistories((currentHistories) => ({
          ...currentHistories,
          [selectedPatientId]: {
            error: null,
            records: sortClinicalRecords(records),
            status: 'loaded',
          },
        }))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPatientHistories((currentHistories) => ({
            ...currentHistories,
            [selectedPatientId]: {
              error: 'Mostrando registros de referencia mientras se sincroniza la historia clinica.',
              records: getFallbackClinicalRecords(selectedPatient, data.appointments),
              status: 'loaded',
            },
          }))
        }
      }
    }

    loadPatientHistory()

    return () => controller.abort()
  }, [
    apiBaseUrl,
    data.appointments,
    patientFormOpen,
    selectedPatient,
    selectedPatientId,
    session.token,
  ])

  useEffect(() => {
    if (calendarDateTouched || data.appointments.length === 0) {
      return
    }

    setCalendarDate(getInitialCalendarDate(data.appointments))
  }, [calendarDateTouched, data.appointments])

  useEffect(() => {
    if (!currentDoctor?.id) {
      return undefined
    }

    const controller = new AbortController()

    async function loadCalendarItems() {
      setCalendarLoading(true)

      try {
        const calendarItems = await fetchCalendarWithAuth(
          apiBaseUrl,
          session.token,
          currentDoctor.id,
          calendarRange.start,
          calendarRange.end,
          controller.signal,
        )

        setData((currentData) => ({
          ...currentData,
          calendarItems,
        }))
        setCalendarFeedback(null)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setData((currentData) => ({
            ...currentData,
            calendarItems: buildFallbackCalendarItems(),
          }))
          setCalendarFeedback({
            type: 'error',
            message: 'Mostrando agenda de referencia mientras se sincroniza el calendario.',
          })
        }
      } finally {
        setCalendarLoading(false)
      }
    }

    loadCalendarItems()

    return () => controller.abort()
  }, [
    apiBaseUrl,
    calendarRange.end,
    calendarRange.start,
    currentDoctor?.id,
    session.token,
  ])

  useEffect(() => {
    if (!currentDoctor?.id) {
      return undefined
    }

    const controller = new AbortController()
    const todayStart = startOfDay(new Date())
    const windowEnd = endOfDay(addDays(todayStart, 30))

    async function loadDashboardCalendarItems() {
      try {
        const dashboardCalendarItems = await fetchCalendarWithAuth(
          apiBaseUrl,
          session.token,
          currentDoctor.id,
          todayStart,
          windowEnd,
          controller.signal,
        )

        setData((currentData) => ({
          ...currentData,
          dashboardCalendarItems,
        }))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setData((currentData) => ({
            ...currentData,
            dashboardCalendarItems: buildFallbackCalendarItems(),
          }))
        }
      }
    }

    loadDashboardCalendarItems()

    return () => controller.abort()
  }, [apiBaseUrl, currentDoctor?.id, session.token])

  const metrics = useMemo(() => {
    const now = new Date()
    const activeAppointments = data.appointments.filter(
      (appointment) => appointment.estado !== 'CANCELADA',
    )
    const activeCalendarItems = data.dashboardCalendarItems.filter(
      (item) => item.estado !== 'CANCELADA',
    )
    const agendaTodayItems = activeCalendarItems.filter((item) => {
      const date = parseDate(item.inicio)
      return date ? isSameDay(date, now) : false
    })
    const upcomingAppointments = activeAppointments
      .filter((appointment) => {
        const date = parseDate(appointment.fechaHora)
        return date ? date >= now : false
      })
      .sort((first, second) => parseDate(first.fechaHora) - parseDate(second.fechaHora))
    const upcomingAgendaItems = activeCalendarItems
      .filter((item) => {
        const date = parseDate(item.inicio)
        return date ? date >= now : false
      })
      .sort((first, second) => parseDate(first.inicio) - parseDate(second.inicio))
    const calendarEventReminders = upcomingAgendaItems
      .filter((item) => item.tipo === 'EVENTO')
      .slice(0, 3)
    const completedAppointments = data.appointments.filter(
      (appointment) => appointment.estado === 'COMPLETADA',
    ).length
    const scheduleLoad = Math.min(100, Math.round((upcomingAppointments.length / 12) * 100))
    const availability = Math.max(25, 100 - scheduleLoad)

    return {
      activeAppointments,
      agendaTodayItems,
      appointmentsToday: agendaTodayItems.length,
      calendarEventReminders,
      completedAppointments,
      upcomingAgendaItems,
      upcomingAppointments,
      availability,
      scheduleLoad,
      totalDoctors: data.doctors.length,
      totalPatients: data.patients.length,
    }
  }, [data])

  const patientMetrics = useMemo(() => {
    const activePatientIds = new Set(
      metrics.activeAppointments.map((appointment) => appointment.pacienteId).filter(Boolean),
    )
    const attendedPatientIds = new Set(
      data.appointments
        .filter((appointment) => appointment.estado === 'COMPLETADA')
        .map((appointment) => appointment.pacienteId)
        .filter(Boolean),
    )
    const returningPatients = data.patients.filter(
      (patient) => getPatientAppointmentCount(patient.id, data.appointments) > 1,
    ).length
    const returnRate = data.patients.length
      ? Math.round((returningPatients / data.patients.length) * 100)
      : 0

    return {
      activePatients: activePatientIds.size,
      attendedPatients: attendedPatientIds.size,
      returnRate,
      totalPatients: data.patients.length,
    }
  }, [data.appointments, data.patients, metrics.activeAppointments])

  const visiblePatients = useMemo(
    () => data.patients.filter((patient) => patientMatchesSearch(patient, patientSearch)),
    [data.patients, patientSearch],
  )

  const visibleAppointments = useMemo(() => {
    return data.appointments
      .filter((appointment) => appointmentMatchesSearch(appointment, appointmentSearch))
      .filter((appointment) => appointmentMatchesDate(appointment, appointmentDateFilter))
      .filter((appointment) => appointmentMatchesStatus(appointment, appointmentStatusFilter))
      .sort((first, second) => parseDate(first.fechaHora) - parseDate(second.fechaHora))
  }, [appointmentDateFilter, appointmentSearch, appointmentStatusFilter, data.appointments])

  const appointmentMetrics = useMemo(() => {
    const tomorrowValue = getDateInputValue(getTomorrowDate())
    const activeVisibleAppointments = visibleAppointments.filter(
      (appointment) => appointment.estado !== 'CANCELADA',
    )

    return {
      totalVisible: visibleAppointments.length,
      completed: visibleAppointments.filter((appointment) => appointment.estado === 'COMPLETADA').length,
      pending: visibleAppointments.filter((appointment) => appointment.estado === 'PROGRAMADA').length,
      cancelled: visibleAppointments.filter((appointment) => appointment.estado === 'CANCELADA').length,
      tomorrow: data.appointments.filter(
        (appointment) =>
          appointment.estado !== 'CANCELADA' &&
          appointmentMatchesDate(appointment, tomorrowValue),
      ).length,
      activeVisibleAppointments,
    }
  }, [data.appointments, visibleAppointments])

  const weeklyData = useMemo(
    () => buildWeeklyData(metrics.activeAppointments),
    [metrics.activeAppointments],
  )
  const chart = useMemo(() => buildChartPath(weeklyData), [weeklyData])
  const greetingName = getGreetingName(session)
  const doctorLabel = currentDoctor?.nombreCompleto ?? greetingName
  const specialtyLabel = currentDoctor?.especialidad ?? session.rol
  const todayLabel = formatDateLabel(new Date())
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  function handleNavClick(itemId) {
    if (itemId === 'dashboard' || itemId === 'pacientes' || itemId === 'citas' || itemId === 'calendario') {
      setActiveNav(itemId)
      setQuickMessage(null)
      setPatientFeedback(null)
      setAppointmentFeedback(null)
      setCalendarFeedback(null)
      return
    }

    setActiveNav('dashboard')
    setQuickMessage(`El módulo ${itemId} quedará integrado en la siguiente fase.`)
  }

  function openNewPatientForm() {
    setEditingPatient(null)
    setSelectedPatient(null)
    setClinicalFeedback(null)
    setClinicalRecordFormOpen(false)
    setPatientFeedback(null)
    setPatientForm(getEmptyPatientForm())
    setPatientFormOpen(true)
    setActiveNav('pacientes')
  }

  function openPatientHistory(patient) {
    setSelectedPatient(patient)
    setEditingPatient(null)
    setPatientFormOpen(false)
    setPatientFeedback(null)
    setClinicalFeedback(null)
    setClinicalRecordFormOpen(false)
    setActiveNav('pacientes')
  }

  function closePatientHistory() {
    setSelectedPatient(null)
    setClinicalFeedback(null)
    setClinicalRecordFormOpen(false)
    setClinicalRecordForm(getEmptyClinicalRecordForm())
  }

  function exportClinicalHistory() {
    window.print()
  }

  function openNewAppointmentForm() {
    setEditingAppointment(null)
    setAppointmentFeedback(null)
    setAppointmentForm(getEmptyAppointmentForm(currentDoctor?.id ? String(currentDoctor.id) : ''))
    setAppointmentFormOpen(true)
    setActiveNav('citas')
  }

  function openNewCalendarEventForm() {
    setCalendarFeedback(null)
    setCalendarEventForm(getEmptyCalendarEventForm(calendarDate))
    setCalendarEventFormOpen(true)
    setActiveNav('calendario')
  }

  function closeCalendarEventForm() {
    setCalendarEventFormOpen(false)
    setCalendarEventForm(getEmptyCalendarEventForm(calendarDate))
  }

  function updateCalendarEventForm(field, value) {
    setCalendarEventForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function moveCalendar(direction) {
    const step = calendarView === 'day' ? 1 : calendarView === 'month' ? 30 : 7
    setCalendarDateTouched(true)
    setCalendarDate((currentDate) => addDays(currentDate, direction * step))
  }

  function goToTodayCalendar() {
    setCalendarDateTouched(true)
    setCalendarDate(new Date())
  }

  function changeCalendarView(view) {
    setCalendarView(view)
  }

  function openEditAppointmentForm(appointment) {
    setEditingAppointment(appointment)
    setAppointmentFeedback(null)
    setAppointmentForm(getAppointmentFormFromRecord(appointment))
    setAppointmentFormOpen(true)
  }

  function closeAppointmentForm() {
    setAppointmentFormOpen(false)
    setEditingAppointment(null)
    setAppointmentForm(getEmptyAppointmentForm())
  }

  function updateAppointmentForm(field, value) {
    setAppointmentForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function openEditPatientForm(patient) {
    setEditingPatient(patient)
    setSelectedPatient(null)
    setClinicalFeedback(null)
    setClinicalRecordFormOpen(false)
    setPatientFeedback(null)
    setPatientForm(getPatientFormFromRecord(patient))
    setPatientFormOpen(true)
  }

  function closePatientForm() {
    setPatientFormOpen(false)
    setEditingPatient(null)
    setPatientForm(getEmptyPatientForm())
  }

  function updatePatientForm(field, value) {
    setPatientForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function openClinicalRecordForm(availableAppointments) {
    const firstAppointment = availableAppointments[0]

    setClinicalFeedback(null)
    setClinicalRecordForm(getEmptyClinicalRecordForm(firstAppointment?.id ? String(firstAppointment.id) : ''))
    setClinicalRecordFormOpen(true)
  }

  function closeClinicalRecordForm() {
    setClinicalRecordFormOpen(false)
    setClinicalRecordForm(getEmptyClinicalRecordForm())
  }

  function updateClinicalRecordForm(field, value) {
    setClinicalRecordForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function refreshPatientClinicalHistory(patientId) {
    const records = await fetchWithAuth(
      apiBaseUrl,
      session.token,
      `/historias-clinicas/paciente/${patientId}`,
    )

    setPatientHistories((currentHistories) => ({
      ...currentHistories,
      [patientId]: {
        error: null,
        records: sortClinicalRecords(records),
        status: 'loaded',
      },
    }))

    return records
  }

  async function refreshPatients() {
    const [patients, appointments] = await Promise.all([
      fetchWithAuth(apiBaseUrl, session.token, '/pacientes'),
      fetchWithAuth(apiBaseUrl, session.token, '/citas'),
    ])

    setData((currentData) => ({
      ...currentData,
      appointments,
      patients,
    }))
  }

  async function refreshAppointments() {
    const appointments = await fetchWithAuth(apiBaseUrl, session.token, '/citas')

    setData((currentData) => ({
      ...currentData,
      appointments,
    }))
  }

  async function refreshCalendarItems() {
    if (!currentDoctor?.id) {
      return
    }

    const [calendarItems, dashboardCalendarItems] = await Promise.all([
      fetchCalendarWithAuth(
        apiBaseUrl,
        session.token,
        currentDoctor.id,
        calendarRange.start,
        calendarRange.end,
      ),
      fetchCalendarWithAuth(
        apiBaseUrl,
        session.token,
        currentDoctor.id,
        startOfDay(new Date()),
        endOfDay(addDays(new Date(), 30)),
      ),
    ])

    setData((currentData) => ({
      ...currentData,
      calendarItems,
      dashboardCalendarItems,
    }))
  }

  async function handleAppointmentSubmit(event) {
    event.preventDefault()
    setSavingAppointment(true)
    setAppointmentFeedback(null)

    try {
      const payload = {
        ...buildAppointmentPayload(appointmentForm),
        doctorId: appointmentForm.doctorId
          ? toNumericId(appointmentForm.doctorId)
          : toNumericId(currentDoctor?.id ?? ''),
      }
      const path = editingAppointment ? `/citas/${editingAppointment.id}` : '/citas'
      const method = editingAppointment ? 'PUT' : 'POST'

      await requestWithAuth(apiBaseUrl, session.token, path, {
        method,
        body: JSON.stringify(payload),
      })
      await refreshAppointments()
      await refreshCalendarItems()
      setAppointmentFeedback({
        type: 'success',
        message: editingAppointment ? 'Cita actualizada correctamente.' : 'Cita creada correctamente.',
      })
      closeAppointmentForm()
    } catch (error) {
      setAppointmentFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible guardar la cita.',
      })
    } finally {
      setSavingAppointment(false)
    }
  }

  async function handleCancelAppointment(appointment) {
    const confirmed = window.confirm(
      `¿Cancelar la cita de ${appointment.pacienteNombre} a las ${formatTime(appointment.fechaHora)}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await requestWithAuth(apiBaseUrl, session.token, `/citas/${appointment.id}/cancelar`, {
        method: 'PATCH',
      })
      await refreshAppointments()
      await refreshCalendarItems()
      setAppointmentFeedback({
        type: 'success',
        message: 'Cita cancelada correctamente.',
      })
    } catch (error) {
      setAppointmentFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible cancelar la cita.',
      })
    }
  }

  async function handleCalendarEventSubmit(event) {
    event.preventDefault()
    setSavingCalendarEvent(true)
    setCalendarFeedback(null)

    try {
      const payload = buildCalendarEventPayload(calendarEventForm, currentDoctor?.id ?? '')

      await requestWithAuth(apiBaseUrl, session.token, '/calendario/eventos', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await refreshCalendarItems()
      setCalendarFeedback({
        type: 'success',
        message: 'Evento agregado al calendario correctamente.',
      })
      closeCalendarEventForm()
    } catch (error) {
      setCalendarFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible crear el evento.',
      })
    } finally {
      setSavingCalendarEvent(false)
    }
  }

  async function handlePatientSubmit(event) {
    event.preventDefault()
    setSavingPatient(true)
    setPatientFeedback(null)

    try {
      const payload = buildPatientPayload(patientForm)
      const path = editingPatient ? `/pacientes/${editingPatient.id}` : '/pacientes'
      const method = editingPatient ? 'PUT' : 'POST'

      await requestWithAuth(apiBaseUrl, session.token, path, {
        method,
        body: JSON.stringify(payload),
      })
      await refreshPatients()
      setPatientFeedback({
        type: 'success',
        message: editingPatient
          ? 'Paciente actualizado correctamente.'
          : 'Paciente registrado correctamente.',
      })
      closePatientForm()
    } catch (error) {
      setPatientFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible guardar el paciente.',
      })
    } finally {
      setSavingPatient(false)
    }
  }

  async function handleClinicalRecordSubmit(event) {
    event.preventDefault()

    if (!selectedPatient) {
      return
    }

    setSavingClinicalRecord(true)
    setClinicalFeedback(null)

    try {
      await requestWithAuth(apiBaseUrl, session.token, '/historias-clinicas', {
        method: 'POST',
        body: JSON.stringify(buildClinicalRecordPayload(clinicalRecordForm)),
      })
      await refreshPatientClinicalHistory(selectedPatient.id)
      await refreshAppointments()
      await refreshCalendarItems().catch(() => null)
      setClinicalFeedback({
        type: 'success',
        message: 'Registro clinico agregado correctamente.',
      })
      closeClinicalRecordForm()
    } catch (error) {
      setClinicalFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible guardar el registro clinico.',
      })
    } finally {
      setSavingClinicalRecord(false)
    }
  }

  async function handleDeletePatient(patient) {
    const confirmed = window.confirm(
      `¿Eliminar a ${patient.nombreCompleto}? Esta acción no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await requestWithAuth(apiBaseUrl, session.token, `/pacientes/${patient.id}`, {
        method: 'DELETE',
      })
      await refreshPatients()
      setSelectedPatient(null)
      setPatientFeedback({
        type: 'success',
        message: 'Paciente eliminado correctamente.',
      })
    } catch (error) {
      setPatientFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible eliminar el paciente.',
      })
    }
  }

  function exportPatients() {
    const rows = [
      ['Nombre', 'Documento', 'Telefono', 'Email', 'Direccion'],
      ...visiblePatients.map((patient) => [
        patient.nombreCompleto,
        patient.documento,
        patient.telefono,
        patient.email,
        patient.direccion,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'pacientes-medflow.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function renderDashboardContent() {
    return (
      <>
        <section className="dashboard-intro">
          <div>
            <h2>Resumen clínico</h2>
            <p>
              Actividad sincronizada para hoy, {todayLabel}. Priorice citas,
              pacientes y disponibilidad del consultorio.
            </p>
          </div>
          <span className={loading ? 'sync-pill is-loading' : 'sync-pill'}>
            {loading ? 'Sincronizando' : 'Datos actualizados'}
          </span>
        </section>

        {syncError ? <p className="dashboard-notice">{syncError}</p> : null}
        {quickMessage ? <p className="dashboard-notice is-action">{quickMessage}</p> : null}

        <section className="metric-grid" aria-label="Métricas principales">
          <MetricCard
            icon={ClockIcon}
            label="Citas hoy"
            tone="blue"
            trend={`${metrics.upcomingAgendaItems.length} próximos en agenda`}
            value={metrics.appointmentsToday}
          />
          <MetricCard
            icon={UsersIcon}
            label="Pacientes totales"
            tone="green"
            trend={`${metrics.totalPatients} pacientes registrados`}
            value={metrics.totalPatients}
          />
          <MetricCard
            icon={ActivityIcon}
            label="Consultas completadas"
            tone="violet"
            trend={`${metrics.activeAppointments.length} citas registradas`}
            value={metrics.completedAppointments}
          />
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-column">
            <div className="quick-actions" aria-label="Accesos rápidos">
              <div className="section-heading">
                <h2>Accesos rápidos</h2>
                <p>Acciones frecuentes para mantener la operación al día.</p>
              </div>

              <div className="quick-grid">
                <button type="button" className="quick-action is-patient" onClick={openNewPatientForm}>
                  <span>
                    <UsersIcon />
                  </span>
                  <strong>Registrar paciente</strong>
                  <small>Añadir nuevo registro clínico</small>
                </button>
                <button
                  type="button"
                  className="quick-action is-appointment"
                  onClick={openNewAppointmentForm}
                >
                  <span>
                    <PlusCircleIcon />
                  </span>
                  <strong>Agendar cita</strong>
                  <small>Reservar un espacio disponible</small>
                </button>
              </div>
            </div>

            <section className="appointments-panel">
              <div className="section-heading is-row">
                <div>
                  <h2>Próximas citas</h2>
                  <p>Pacientes programados en las siguientes jornadas.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('calendario')}
                >
                  Ver todas
                </button>
              </div>

              <div className="appointment-list">
                {metrics.upcomingAppointments.slice(0, 4).map((appointment) => (
                  <article className="appointment-row" key={appointment.id}>
                    <span className="appointment-avatar">
                      {getInitials(appointment.pacienteNombre)}
                    </span>
                    <span className="appointment-patient">
                      <strong>{appointment.pacienteNombre}</strong>
                      <small>{appointment.procedimientoNombre}</small>
                    </span>
                    <span className="appointment-time">
                      <ClockIcon />
                      {formatTime(appointment.fechaHora)}
                    </span>
                    <span className={`status-badge ${getStatusClass(appointment.estado)}`}>
                      {formatStatus(appointment.estado)}
                    </span>
                  </article>
                ))}

                {metrics.upcomingAppointments.length === 0 ? (
                  <p className="empty-state">No hay citas activas próximas.</p>
                ) : null}
              </div>
            </section>
          </section>

          <aside className="dashboard-rail" aria-label="Indicadores secundarios">
            <WeeklyChart chart={chart} weeklyData={weeklyData} />

            <section className="reminders-panel">
              <div className="section-heading">
                <h2>Recordatorios</h2>
                <p>Eventos relevantes guardados en el calendario.</p>
              </div>
              {metrics.calendarEventReminders.length > 0 ? (
                <ul>
                  {metrics.calendarEventReminders.map((item) => (
                    <li key={`${item.tipo}-${item.id}`}>
                      <strong>{item.titulo}</strong>
                      <span>{formatShortDate(item.inicio)} · {formatCalendarItemRange(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-calendar-reminder">No hay nada relevante en el calendario.</p>
              )}
            </section>

            <section className="office-panel">
              <div className="section-heading">
                <h2>Estado del consultorio</h2>
                <p>Disponibilidad estimada para nuevas citas.</p>
              </div>
              <div className="office-meter">
                <span>Disponibilidad hoy</span>
                <strong>{metrics.availability}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${metrics.availability}%` }} />
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('calendario')}
              >
                Ver calendario completo
                <CalendarIcon />
              </button>
            </section>
          </aside>
        </div>
      </>
    )
  }

  function renderPatientsContent() {
    if (selectedPatient && !patientFormOpen) {
      return renderClinicalHistoryContent()
    }

    return (
      <>
        <section className="dashboard-intro patient-intro">
          <div>
            <h2>Gestión de pacientes</h2>
            <p>Administre el directorio, datos de contacto e historial de atención del consultorio.</p>
          </div>
          <div className="patient-toolbar">
            <button type="button" className="secondary-action" onClick={exportPatients}>
              <DownloadIcon />
              Exportar
            </button>
            <button type="button" className="primary-action" onClick={openNewPatientForm}>
              <PlusCircleIcon />
              Nuevo paciente
            </button>
          </div>
        </section>

        {patientFeedback ? (
          <p className={`dashboard-notice ${patientFeedback.type === 'success' ? 'is-action' : ''}`}>
            {patientFeedback.message}
          </p>
        ) : null}

        <section className="metric-grid patient-metrics" aria-label="Indicadores de pacientes">
          <MetricCard
            icon={UsersIcon}
            label="Total pacientes"
            tone="blue"
            trend="Directorio registrado"
            value={patientMetrics.totalPatients}
          />
          <MetricCard
            icon={ActivityIcon}
            label="Con cita activa"
            tone="green"
            trend="En seguimiento actual"
            value={patientMetrics.activePatients}
          />
          <MetricCard
            icon={ClockIcon}
            label="Pacientes atendidos"
            tone="violet"
            trend={`${patientMetrics.returnRate}% tasa de retorno`}
            value={patientMetrics.attendedPatients}
          />
        </section>

        <section className="patients-panel">
          <div className="patients-panel-toolbar">
            <label className="patient-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Buscar por nombre, documento, correo o teléfono..."
                value={patientSearch}
                onChange={(event) => setPatientSearch(event.target.value)}
              />
            </label>
            <div className="patient-table-status">
              <FilterIcon />
              <span>Mostrando {visiblePatients.length} de {data.patients.length}</span>
            </div>
          </div>

          <div className="patients-table-wrap">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Identificación</th>
                  <th>Contacto</th>
                  <th>Última cita</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((patient) => {
                  const lastAppointment = getPatientLastAppointment(patient.id, data.appointments)
                  const isActive = metrics.activeAppointments.some(
                    (appointment) => appointment.pacienteId === patient.id,
                  )

                  return (
                    <tr key={patient.id}>
                      <td>
                        <span className="patient-cell">
                          <span className="patient-avatar">{getInitials(patient.nombreCompleto)}</span>
                          <span>
                            <strong>{patient.nombreCompleto}</strong>
                            <small>{patient.email}</small>
                          </span>
                        </span>
                      </td>
                      <td>{patient.documento}</td>
                      <td>{patient.telefono}</td>
                      <td>{formatShortDate(lastAppointment)}</td>
                      <td>
                        <span className={`patient-state ${isActive ? 'is-active' : ''}`}>
                          {isActive ? 'Activo' : 'Sin cita activa'}
                        </span>
                      </td>
                      <td>
                        <span className="patient-actions">
                          <button
                            type="button"
                            aria-label={`Ver ${patient.nombreCompleto}`}
                            onClick={() => openPatientHistory(patient)}
                          >
                            <EyeIcon />
                          </button>
                          <button
                            type="button"
                            aria-label={`Editar ${patient.nombreCompleto}`}
                            onClick={() => openEditPatientForm(patient)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="is-danger"
                            aria-label={`Eliminar ${patient.nombreCompleto}`}
                            onClick={() => handleDeletePatient(patient)}
                          >
                            <TrashIcon />
                          </button>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {visiblePatients.length === 0 ? (
            <p className="empty-state">No encontramos pacientes con esos criterios.</p>
          ) : null}
        </section>

        {patientFormOpen ? (
          <section className="patient-detail-panel">
            <PatientForm
              editingPatient={editingPatient}
              formValues={patientForm}
              onCancel={closePatientForm}
              onChange={updatePatientForm}
              onSubmit={handlePatientSubmit}
              saving={savingPatient}
            />
          </section>
        ) : (
          <section className="patient-guidance">
            <span>
              <UsersIcon />
            </span>
            <div>
              <h3>Atención personalizada</h3>
              <p>
                Seleccione un paciente para revisar su información o registre uno nuevo
                para mantener actualizado el directorio clínico.
              </p>
            </div>
          </section>
        )}
      </>
    )
  }

  function renderClinicalHistoryContent() {
    const historyState = selectedPatientId ? patientHistories[selectedPatientId] : null
    const clinicalRecords = historyState?.records ?? []
    const loadingHistory = !historyState || historyState.status === 'loading'
    const availableAppointments = selectedPatient
      ? getAvailableAppointmentsForClinicalRecord(selectedPatient, data.appointments, clinicalRecords)
      : []
    const patientAppointments = selectedPatient
      ? data.appointments.filter((appointment) => String(appointment.pacienteId) === String(selectedPatient.id))
      : []
    const latestClinicalRecord = clinicalRecords[0]
    const latestClinicalDate = latestClinicalRecord
      ? getClinicalRecordDate(latestClinicalRecord)
      : getPatientLastAppointment(selectedPatient.id, data.appointments)
    const nextAppointment = getNextPatientAppointment(selectedPatient.id, data.appointments)
    const criticalAlertLabel = clinicalRecords.some((record) =>
      `${record.datosRelevantes ?? ''}`.toLowerCase().includes('alerg'),
    )
      ? 'Revisar alergias'
      : 'Sin alertas criticas'

    return (
      <>
        <section className="dashboard-intro clinical-history-intro">
          <button
            type="button"
            className="clinical-back-button"
            aria-label="Volver al listado de pacientes"
            onClick={closePatientHistory}
          >
            <ChevronLeftIcon />
          </button>
          <div>
            <h2>Historia clínica</h2>
            <p>Registro cronológico de atenciones, diagnósticos y seguimiento del paciente.</p>
          </div>
          <div className="patient-toolbar clinical-history-actions">
            <button type="button" className="secondary-action" onClick={exportClinicalHistory}>
              <DownloadIcon />
              Exportar PDF
            </button>
            <button
              type="button"
              className="primary-action"
              disabled={availableAppointments.length === 0}
              onClick={() => openClinicalRecordForm(availableAppointments)}
            >
              <PlusCircleIcon />
              Nuevo registro
            </button>
          </div>
        </section>

        {clinicalFeedback ? (
          <p className={`dashboard-notice ${clinicalFeedback.type === 'success' ? 'is-action' : ''}`}>
            {clinicalFeedback.message}
          </p>
        ) : null}

        <section className="clinical-history-layout">
          <aside className="clinical-profile-panel">
            <div className="clinical-profile-cover" />
            <div className="clinical-profile-heading">
              <span className="clinical-profile-avatar">
                {getInitials(selectedPatient.nombreCompleto)}
              </span>
              <h3>{selectedPatient.nombreCompleto}</h3>
              <p>ID: {selectedPatient.documento}</p>
            </div>

            <dl className="clinical-profile-list">
              <div>
                <dt>
                  <IdCardIcon />
                  Documento
                </dt>
                <dd>{selectedPatient.documento}</dd>
              </div>
              <div>
                <dt>
                  <PhoneIcon />
                  Teléfono
                </dt>
                <dd>{selectedPatient.telefono}</dd>
              </div>
              <div>
                <dt>
                  <MailIcon />
                  Correo
                </dt>
                <dd>{selectedPatient.email}</dd>
              </div>
              <div>
                <dt>
                  <CalendarIcon />
                  Citas
                </dt>
                <dd>{patientAppointments.length.toLocaleString('es-CO')}</dd>
              </div>
            </dl>

            <div className="clinical-alert-card">
              <span>
                <AlertIcon />
              </span>
              <div>
                <strong>Alertas clínicas</strong>
                <p>{criticalAlertLabel}</p>
              </div>
            </div>

            <div className="clinical-summary-card">
              <span>Último control</span>
              <strong>{latestClinicalDate ? formatShortDate(latestClinicalDate) : 'Sin registro'}</strong>
              <p>
                {nextAppointment
                  ? `Próxima cita: ${formatShortDate(nextAppointment.fechaHora)} · ${formatTime(nextAppointment.fechaHora)}`
                  : 'Sin seguimiento programado en agenda.'}
              </p>
            </div>

            <button type="button" className="secondary-action clinical-edit-patient" onClick={() => openEditPatientForm(selectedPatient)}>
              <EditIcon />
              Editar paciente
            </button>
          </aside>

          <section className="clinical-timeline-panel">
            <div className="clinical-timeline-heading">
              <div>
                <h3>Línea de tiempo clínica</h3>
                <p>{clinicalRecords.length.toLocaleString('es-CO')} registros vinculados al paciente.</p>
              </div>
              <div className="clinical-filter-pills" aria-label="Filtros de historia clínica">
                <span>Este año</span>
                <span>Todos los registros</span>
              </div>
            </div>

            {historyState?.error ? (
              <p className="dashboard-notice clinical-sync-note">{historyState.error}</p>
            ) : null}

            {clinicalRecordFormOpen ? (
              <ClinicalRecordForm
                appointments={availableAppointments}
                formValues={clinicalRecordForm}
                onCancel={closeClinicalRecordForm}
                onChange={updateClinicalRecordForm}
                onSubmit={handleClinicalRecordSubmit}
                saving={savingClinicalRecord}
              />
            ) : null}

            {loadingHistory ? (
              <div className="clinical-loading-state">
                <ActivityIcon />
                <span>Cargando historia clínica...</span>
              </div>
            ) : (
              <div className="clinical-timeline" aria-label="Línea de tiempo clínica">
                {clinicalRecords.map((record) => (
                  <ClinicalTimelineRecord key={record.id} record={record} />
                ))}
              </div>
            )}

            {!loadingHistory && clinicalRecords.length === 0 ? (
              <div className="clinical-empty-state">
                <FileTextIcon />
                <h3>Sin registros clínicos todavía</h3>
                <p>
                  El historial se construye con cada atención completada. Cuando exista una cita
                  disponible, podrá agregarse un nuevo registro clínico desde este panel.
                </p>
              </div>
            ) : null}
          </section>
        </section>
      </>
    )
  }

  function renderAppointmentsContent() {
    return (
      <>
        <section className="dashboard-intro appointments-intro">
          <div>
            <h2>Gestión de citas</h2>
            <p>Administre la agenda diaria, confirme estados y reserve nuevos espacios clínicos.</p>
          </div>
          <button type="button" className="primary-action" onClick={openNewAppointmentForm}>
            <PlusCircleIcon />
            Nueva cita
          </button>
        </section>

        {appointmentFeedback ? (
          <p className={`dashboard-notice ${appointmentFeedback.type === 'success' ? 'is-action' : ''}`}>
            {appointmentFeedback.message}
          </p>
        ) : null}

        <section className="appointments-filter-panel" aria-label="Filtros de citas">
          <label className="patient-search appointment-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Buscar paciente o motivo de consulta..."
              value={appointmentSearch}
              onChange={(event) => setAppointmentSearch(event.target.value)}
            />
          </label>

          <label className="appointment-field">
            <span>Fecha</span>
            <input
              type="date"
              value={appointmentDateFilter}
              onChange={(event) => setAppointmentDateFilter(event.target.value)}
            />
          </label>

          <label className="appointment-field">
            <span>Estado</span>
            <select
              value={appointmentStatusFilter}
              onChange={(event) => setAppointmentStatusFilter(event.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="PROGRAMADA">Programadas</option>
              <option value="COMPLETADA">Completadas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </label>
        </section>

        <section className="metric-grid appointment-metrics" aria-label="Indicadores de citas">
          <MetricCard
            icon={ClockIcon}
            label="Citas filtradas"
            tone="blue"
            trend={`${appointmentMetrics.activeVisibleAppointments.length} activas`}
            value={appointmentMetrics.totalVisible}
          />
          <MetricCard
            icon={ActivityIcon}
            label="Completadas"
            tone="green"
            trend="Pacientes atendidos"
            value={appointmentMetrics.completed}
          />
          <MetricCard
            icon={CalendarIcon}
            label="Agenda mañana"
            tone="violet"
            trend={`${appointmentMetrics.pending} pendientes hoy`}
            value={appointmentMetrics.tomorrow}
          />
        </section>

        <section className="appointments-manager">
          <div className="section-heading is-row">
            <div>
              <h2>Agenda del consultorio</h2>
              <p>Visualización de las consultas programadas según los filtros aplicados.</p>
            </div>
            <span className="count-pill">{visibleAppointments.length} citas</span>
          </div>

          <div className="appointments-table-wrap">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Motivo de consulta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <span className="appointment-hour">
                        <ClockIcon />
                        <strong>{formatTime(appointment.fechaHora)}</strong>
                      </span>
                    </td>
                    <td>
                      <span className="patient-cell">
                        <span className="patient-avatar">
                          {getInitials(appointment.pacienteNombre)}
                        </span>
                        <span>
                          <strong>{appointment.pacienteNombre}</strong>
                          <small>APT-{String(appointment.id).padStart(3, '0')}</small>
                        </span>
                      </span>
                    </td>
                    <td>{appointment.procedimientoNombre}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.estado)}`}>
                        {formatStatus(appointment.estado)}
                      </span>
                    </td>
                    <td>
                      <span className="patient-actions">
                        <button
                          type="button"
                          aria-label={`Editar cita de ${appointment.pacienteNombre}`}
                          onClick={() => openEditAppointmentForm(appointment)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="is-danger"
                          aria-label={`Cancelar cita de ${appointment.pacienteNombre}`}
                          disabled={appointment.estado === 'CANCELADA'}
                          onClick={() => handleCancelAppointment(appointment)}
                        >
                          <TrashIcon />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleAppointments.length === 0 ? (
            <p className="empty-state">No hay citas con los filtros seleccionados.</p>
          ) : null}
        </section>

        {appointmentFormOpen ? (
          <section className="appointment-detail-panel">
            <AppointmentForm
              editingAppointment={editingAppointment}
              formValues={appointmentForm}
              onCancel={closeAppointmentForm}
              onChange={updateAppointmentForm}
              onSubmit={handleAppointmentSubmit}
              patients={data.patients}
              procedures={data.procedures}
              saving={savingAppointment}
            />
          </section>
        ) : (
          <section className="appointment-summary-grid">
            <article className="appointment-summary-card">
              <span><ActivityIcon /></span>
              <div>
                <h3>Citas completadas</h3>
                <p>{appointmentMetrics.completed} pacientes ya fueron atendidos con éxito.</p>
              </div>
            </article>
            <article className="appointment-summary-card">
              <span><ClockIcon /></span>
              <div>
                <h3>En espera</h3>
                <p>{appointmentMetrics.pending} consultas permanecen pendientes en esta vista.</p>
              </div>
            </article>
            <article className="appointment-summary-card">
              <span><CalendarIcon /></span>
              <div>
                <h3>Cancelaciones</h3>
                <p>{appointmentMetrics.cancelled} registros figuran como cancelados.</p>
              </div>
            </article>
          </section>
        )}
      </>
    )
  }

  function renderCalendarContent() {
    const calendarItems = data.calendarItems
      .slice()
      .sort((first, second) => parseDate(first.inicio) - parseDate(second.inicio))
    const selectedDayItems = calendarItems.filter((item) => isCalendarItemOnDay(item, calendarDate))
    const selectedDayActiveItems = selectedDayItems.filter((item) => item.estado !== 'CANCELADA')
    const selectedDayCitas = selectedDayActiveItems.filter((item) => item.tipo === 'CITA')
    const selectedDayEvents = selectedDayActiveItems.filter((item) => item.tipo === 'EVENTO')
    const nextPatient = calendarItems.find((item) => {
      const startDate = parseDate(item.inicio)
      return item.tipo === 'CITA' && item.estado !== 'CANCELADA' && startDate && startDate >= new Date()
    })
    const nextEvent = calendarItems.find((item) => {
      const startDate = parseDate(item.inicio)
      return item.tipo === 'EVENTO' && startDate && startDate >= new Date()
    })

    return (
      <>
        <section className="calendar-workspace">
          <div className="calendar-toolbar">
            <div className="calendar-navigation" aria-label="Navegación de calendario">
              <button type="button" className="icon-action" aria-label="Semana anterior" onClick={() => moveCalendar(-1)}>
                ‹
              </button>
              <button type="button" className="icon-action" aria-label="Semana siguiente" onClick={() => moveCalendar(1)}>
                ›
              </button>
              <button type="button" className="secondary-action is-compact" onClick={goToTodayCalendar}>
                Hoy
              </button>
            </div>

            <h2>{calendarTitle}</h2>

            <div className="calendar-toolbar-actions">
              <div className="calendar-view-toggle" aria-label="Vista del calendario">
                {[
                  ['day', 'Día'],
                  ['week', 'Semana'],
                  ['month', 'Mes'],
                ].map(([view, label]) => (
                  <button
                    type="button"
                    className={calendarView === view ? 'is-active' : ''}
                    key={view}
                    onClick={() => changeCalendarView(view)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" className="secondary-action" onClick={openNewCalendarEventForm}>
                <CalendarIcon />
                Nuevo evento
              </button>
              <button type="button" className="primary-action" onClick={openNewAppointmentForm}>
                <PlusCircleIcon />
                Nueva cita
              </button>
            </div>
          </div>

          {calendarFeedback ? (
            <p className={`dashboard-notice ${calendarFeedback.type === 'success' ? 'is-action' : ''}`}>
              {calendarFeedback.message}
            </p>
          ) : null}

          {calendarEventFormOpen ? (
            <section className="calendar-form-panel">
              <CalendarEventForm
                formValues={calendarEventForm}
                onCancel={closeCalendarEventForm}
                onChange={updateCalendarEventForm}
                onSubmit={handleCalendarEventSubmit}
                saving={savingCalendarEvent}
              />
            </section>
          ) : null}

          <div className="calendar-layout">
            <section className="calendar-board-panel" aria-label="Calendario del médico">
              {calendarLoading ? <p className="calendar-loading">Sincronizando calendario...</p> : null}

              {calendarView === 'month' ? (
                <div className="calendar-month-grid">
                  {MONTH_WEEK_LABELS.map((label) => (
                    <span className="calendar-month-header" key={label}>{label}</span>
                  ))}
                  {monthCalendarDays.map((day) => {
                    const dayItems = calendarItems.filter((item) => isCalendarItemOnDay(item, day))
                    const isOutsideMonth = day.getMonth() !== calendarDate.getMonth()

                    return (
                      <button
                        type="button"
                        className={`calendar-month-cell ${isOutsideMonth ? 'is-muted' : ''}`}
                        key={day.toISOString()}
                        onClick={() => {
                          setCalendarDateTouched(true)
                          setCalendarDate(day)
                          setCalendarView('day')
                        }}
                      >
                        <strong>{day.getDate()}</strong>
                        <span>
                          {dayItems.slice(0, 3).map((item) => (
                            <em className={getCalendarItemClass(item)} key={`${item.tipo}-${item.id}`}>
                              {item.tipo === 'EVENTO' ? item.titulo : item.pacienteNombre}
                            </em>
                          ))}
                          {dayItems.length > 3 ? <small>+{dayItems.length - 3} más</small> : null}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div
                  className="calendar-grid"
                  style={{ '--calendar-days': calendarDays.length }}
                >
                  <div className="calendar-corner">
                    <ClockIcon />
                  </div>
                  {calendarDays.map((day) => (
                    <div className="calendar-day-heading" key={day.toISOString()}>
                      <span>{formatWeekdayLabel(day)}</span>
                      <strong className={isSameDay(day, new Date()) ? 'is-today' : ''}>
                        {day.getDate()}
                      </strong>
                    </div>
                  ))}

                  {CALENDAR_HOURS.map((hour) => (
                    <div className="calendar-row-fragment" key={hour}>
                      <div className="calendar-hour-label">{String(hour).padStart(2, '0')}:00</div>
                      {calendarDays.map((day) => {
                        const slotItems = getCalendarSlotItems(calendarItems, day, hour)

                        return (
                          <div className="calendar-slot" key={`${day.toISOString()}-${hour}`}>
                            {slotItems.map((item) => (
                              <article
                                className={`calendar-item ${getCalendarItemClass(item)}`}
                                key={`${item.tipo}-${item.id}`}
                              >
                                <span>{formatCalendarItemRange(item)}</span>
                                <strong>{item.tipo === 'EVENTO' ? item.titulo : item.pacienteNombre}</strong>
                                <small>
                                  {item.tipo === 'EVENTO'
                                    ? item.descripcion || 'Evento del calendario'
                                    : item.procedimientoNombre}
                                </small>
                              </article>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="calendar-side-panel" aria-label="Resumen del calendario">
              <section>
                <div className="section-heading">
                  <h2>Resumen del día</h2>
                  <p>{formatShortDate(calendarDate)}</p>
                </div>
                <dl className="calendar-summary-list">
                  <div>
                    <dt>Agenda total</dt>
                    <dd>{selectedDayActiveItems.length}</dd>
                  </div>
                  <div>
                    <dt>Citas</dt>
                    <dd>{selectedDayCitas.length}</dd>
                  </div>
                  <div>
                    <dt>Eventos</dt>
                    <dd>{selectedDayEvents.length}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <div className="section-heading">
                  <h2>Próximo paciente</h2>
                </div>
                {nextPatient ? (
                  <article className="calendar-next-card">
                    <span>{getInitials(nextPatient.pacienteNombre)}</span>
                    <div>
                      <strong>{nextPatient.pacienteNombre}</strong>
                      <small>{formatTime(nextPatient.inicio)} · {nextPatient.procedimientoNombre}</small>
                    </div>
                  </article>
                ) : (
                  <p className="calendar-empty-copy">No hay pacientes próximos en esta vista.</p>
                )}
              </section>

              <section>
                <div className="section-heading">
                  <h2>Próximo evento</h2>
                </div>
                {nextEvent ? (
                  <article className="calendar-next-card is-event">
                    <span><CalendarIcon /></span>
                    <div>
                      <strong>{nextEvent.titulo}</strong>
                      <small>{formatShortDate(nextEvent.inicio)} · {formatTime(nextEvent.inicio)}</small>
                    </div>
                  </article>
                ) : (
                  <p className="calendar-empty-copy">No hay eventos próximos guardados.</p>
                )}
              </section>

              <section className="calendar-legend">
                <h2>Leyenda</h2>
                <span><i className="is-scheduled" /> Cita programada</span>
                <span><i className="is-completed" /> Cita completada</span>
                <span><i className="is-event" /> Evento</span>
                <span><i className="is-cancelled" /> Cancelada</span>
              </section>
            </aside>
          </div>
        </section>
      </>
    )
  }

  return (
    <main className={`dashboard-shell${isDarkMode ? ' is-dark' : ''}`}>
      <aside className="dashboard-sidebar" aria-label="Navegación principal">
        <button
          type="button"
          className="dashboard-brand"
          onClick={() => handleNavClick('dashboard')}
          aria-label="Ir al dashboard principal"
        >
          <img src={logoDashboard} alt="" />
          <span>MedFlow</span>
        </button>

        <nav className="dashboard-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <button
                type="button"
                className={activeNav === item.id ? 'is-active' : ''}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button type="button" className="dashboard-logout" onClick={onLogout}>
          <LogoutIcon />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-eyebrow">Panel de control</p>
            <h1>Hola de nuevo, {greetingName}</h1>
          </div>

          <div className="dashboard-actions" aria-label="Acciones de cuenta">
            <button type="button" aria-label="Notificaciones">
              <BellIcon />
            </button>
            <button
              type="button"
              className="theme-toggle"
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-pressed={isDarkMode}
              onClick={toggleTheme}
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>
            <div className="profile-chip">
              <span className="profile-copy">
                <strong>{doctorLabel}</strong>
                <small>{specialtyLabel}</small>
              </span>
              <span className="profile-avatar">{getInitials(session.email)}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeNav === 'pacientes'
            ? renderPatientsContent()
            : activeNav === 'citas'
              ? renderAppointmentsContent()
              : activeNav === 'calendario'
                ? renderCalendarContent()
                : renderDashboardContent()}
        </div>

        <footer className="dashboard-footer">
          <span>© 2026 MedFlow - Gestión médica integral</span>
          <span>Soporte · Privacidad</span>
        </footer>
      </section>
    </main>
  )
}

function MetricCard({ icon, label, tone, trend, value }) {
  return (
    <article className={`metric-card is-${tone}`}>
      <span className="metric-copy">
        <small>{label}</small>
        <strong>{value.toLocaleString('es-CO')}</strong>
        <em>{trend}</em>
      </span>
      <span className="metric-icon">
        {icon()}
      </span>
    </article>
  )
}

function PatientForm({ editingPatient, formValues, onCancel, onChange, onSubmit, saving }) {
  return (
    <form className="patient-form" onSubmit={onSubmit}>
      <div className="section-heading is-row">
        <div>
          <h2>{editingPatient ? 'Editar paciente' : 'Nuevo paciente'}</h2>
          <p>
            {editingPatient
              ? 'Actualice los datos administrativos del paciente.'
              : 'Complete la información básica para crear el registro.'}
          </p>
        </div>
        <button type="button" className="text-action" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      <div className="patient-form-grid">
        <label>
          <span>Nombre completo</span>
          <input
            type="text"
            value={formValues.nombreCompleto}
            onChange={(event) => onChange('nombreCompleto', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Documento</span>
          <input
            type="text"
            value={formValues.documento}
            onChange={(event) => onChange('documento', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Teléfono</span>
          <input
            type="tel"
            value={formValues.telefono}
            onChange={(event) => onChange('telefono', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Correo electrónico</span>
          <input
            type="email"
            value={formValues.email}
            onChange={(event) => onChange('email', event.target.value)}
            required
          />
        </label>
        <label className="is-wide">
          <span>Dirección</span>
          <input
            type="text"
            value={formValues.direccion}
            onChange={(event) => onChange('direccion', event.target.value)}
            required
          />
        </label>
      </div>

      <div className="patient-form-actions">
        <button type="button" className="secondary-action" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary-action" disabled={saving}>
          {saving ? 'Guardando...' : editingPatient ? 'Guardar cambios' : 'Registrar paciente'}
        </button>
      </div>
    </form>
  )
}

function AppointmentForm({
  editingAppointment,
  formValues,
  onCancel,
  onChange,
  onSubmit,
  patients,
  procedures,
  saving,
}) {
  return (
    <form className="patient-form appointment-form" onSubmit={onSubmit}>
      <div className="section-heading is-row">
        <div>
          <h2>{editingAppointment ? 'Editar cita' : 'Nueva cita'}</h2>
          <p>
            {editingAppointment
              ? 'Ajuste la programación, el estado o los datos clínicos de la cita.'
              : 'Seleccione paciente, médico y procedimiento para reservar el espacio.'}
          </p>
        </div>
        <button type="button" className="text-action" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      <div className="patient-form-grid">
        <label>
          <span>Paciente</span>
          <select
            value={formValues.pacienteId}
            onChange={(event) => onChange('pacienteId', event.target.value)}
            required
          >
            <option value="">Seleccione paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.nombreCompleto}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Procedimiento</span>
          <select
            value={formValues.procedimientoId}
            onChange={(event) => onChange('procedimientoId', event.target.value)}
            required
          >
            <option value="">Seleccione procedimiento</option>
            {procedures.map((procedure) => (
              <option key={procedure.id} value={procedure.id}>
                {procedure.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Fecha y hora</span>
          <input
            type="datetime-local"
            value={formValues.fechaHora}
            onChange={(event) => onChange('fechaHora', event.target.value)}
            required
          />
        </label>
        <label className="is-wide">
          <span>Estado</span>
          <select
            value={formValues.estado}
            onChange={(event) => onChange('estado', event.target.value)}
            required
          >
            <option value="PROGRAMADA">Programada</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </label>
      </div>

      <div className="patient-form-actions">
        <button type="button" className="secondary-action" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary-action" disabled={saving}>
          {saving ? 'Guardando...' : editingAppointment ? 'Guardar cambios' : 'Crear cita'}
        </button>
      </div>
    </form>
  )
}

function CalendarEventForm({ formValues, onCancel, onChange, onSubmit, saving }) {
  return (
    <form className="patient-form calendar-event-form" onSubmit={onSubmit}>
      <div className="section-heading is-row">
        <div>
          <h2>Nuevo evento</h2>
          <p>Reserve un bloque visible en el calendario del médico.</p>
        </div>
        <button type="button" className="text-action" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      <div className="patient-form-grid">
        <label>
          <span>Título</span>
          <input
            type="text"
            value={formValues.titulo}
            onChange={(event) => onChange('titulo', event.target.value)}
            maxLength="150"
            required
          />
        </label>
        <label>
          <span>Inicio</span>
          <input
            type="datetime-local"
            value={formValues.inicio}
            onChange={(event) => onChange('inicio', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Fin</span>
          <input
            type="datetime-local"
            value={formValues.fin}
            onChange={(event) => onChange('fin', event.target.value)}
            required
          />
        </label>
        <label className="is-wide">
          <span>Descripción</span>
          <textarea
            value={formValues.descripcion}
            onChange={(event) => onChange('descripcion', event.target.value)}
            maxLength="5000"
            rows="3"
          />
        </label>
      </div>

      <div className="patient-form-actions">
        <button type="button" className="secondary-action" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary-action" disabled={saving}>
          {saving ? 'Guardando...' : 'Agregar evento'}
        </button>
      </div>
    </form>
  )
}

function ClinicalRecordForm({ appointments, formValues, onCancel, onChange, onSubmit, saving }) {
  return (
    <form className="patient-form clinical-record-form" onSubmit={onSubmit}>
      <div className="section-heading is-row">
        <div>
          <h2>Nuevo registro clínico</h2>
          <p>Asocie la nota a una cita y consolide la información médica relevante.</p>
        </div>
        <button type="button" className="text-action" onClick={onCancel}>
          Cerrar
        </button>
      </div>

      <div className="patient-form-grid">
        <label className="is-wide">
          <span>Cita asociada</span>
          <select
            value={formValues.citaId}
            onChange={(event) => onChange('citaId', event.target.value)}
            required
          >
            <option value="">Seleccione una cita</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {formatShortDate(appointment.fechaHora)} · {formatTime(appointment.fechaHora)} · {appointment.procedimientoNombre}
              </option>
            ))}
          </select>
        </label>
        <label className="is-wide">
          <span>Diagnóstico</span>
          <textarea
            value={formValues.diagnostico}
            onChange={(event) => onChange('diagnostico', event.target.value)}
            maxLength="5000"
            rows="3"
            required
          />
        </label>
        <label className="is-wide">
          <span>Observaciones</span>
          <textarea
            value={formValues.observaciones}
            onChange={(event) => onChange('observaciones', event.target.value)}
            maxLength="5000"
            rows="4"
            required
          />
        </label>
        <label className="is-wide">
          <span>Datos relevantes</span>
          <textarea
            value={formValues.datosRelevantes}
            onChange={(event) => onChange('datosRelevantes', event.target.value)}
            maxLength="5000"
            rows="3"
            required
          />
        </label>
      </div>

      <div className="patient-form-actions">
        <button type="button" className="secondary-action" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary-action" disabled={saving || appointments.length === 0}>
          {saving ? 'Guardando...' : 'Guardar registro'}
        </button>
      </div>
    </form>
  )
}

function ClinicalTimelineRecord({ record }) {
  const kind = getClinicalRecordKind(record)
  const recordTitle = record.diagnostico?.trim() || record.procedimientoNombre || 'Registro clínico'
  const recordNotes = record.observaciones?.trim() || 'Sin observaciones registradas.'
  const relevantData = record.datosRelevantes?.trim() || 'Sin datos relevantes registrados.'

  return (
    <article className={`clinical-record is-${kind}`}>
      <span className="clinical-record-node">
        {renderClinicalRecordIcon(kind)}
      </span>
      <div className="clinical-record-card">
        <div className="clinical-record-meta">
          <span>{formatClinicalDate(record.fechaRegistro ?? record.citaFechaHora)}</span>
          <strong>{getClinicalKindLabel(kind)}</strong>
          <span className="clinical-record-menu" aria-hidden="true">
            <MoreVerticalIcon />
          </span>
        </div>
        <h4>{recordTitle}</h4>
        <p>{recordNotes}</p>
        <div className="clinical-record-footer">
          <span className="clinical-doctor-avatar">{getInitials(record.doctorNombre)}</span>
          <span>
            <strong>{record.doctorNombre}</strong>
            <small>{record.doctorEspecialidad ?? record.procedimientoNombre}</small>
          </span>
          <details className="clinical-record-details">
            <summary>Ver informe completo</summary>
            <dl>
              <div>
                <dt>Procedimiento</dt>
                <dd>{record.procedimientoNombre}</dd>
              </div>
              <div>
                <dt>Datos relevantes</dt>
                <dd>{relevantData}</dd>
              </div>
              <div>
                <dt>Estado de la cita</dt>
                <dd>{formatStatus(record.citaEstado)}</dd>
              </div>
            </dl>
          </details>
        </div>
      </div>
    </article>
  )
}

function WeeklyChart({ chart, weeklyData }) {
  return (
    <section className="chart-panel">
      <div className="section-heading">
        <h2>Afluencia semanal</h2>
        <p>Citas activas registradas por día.</p>
      </div>
      <svg viewBox="0 0 280 160" role="img" aria-label="Gráfica de afluencia semanal">
        <path className="chart-area" d={chart.area} />
        <path className="chart-line" d={chart.line} />
        {weeklyData.map((value, index) => {
          const x = (280 / (weeklyData.length - 1)) * index
          const y = 132 - (value / chart.maxValue) * 96 - 18

          return (
            <circle className="chart-dot" cx={x} cy={y} key={WEEK_LABELS[index]} r="3.5" />
          )
        })}
      </svg>
      <div className="chart-labels">
        {WEEK_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  )
}

function renderClinicalRecordIcon(kind) {
  if (kind === 'lab') {
    return <FlaskIcon />
  }

  if (kind === 'medication') {
    return <PillIcon />
  }

  if (kind === 'control') {
    return <ActivityIcon />
  }

  return <StethoscopeIcon />
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-6 4 10 2-4h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.4 21 19H3L12 4.4Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M12 9.2v4.4M12 16.8h.01" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5v9m0 0 3.5-3.5M12 13.5 8.5 10M5 15.5v2A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16.7V19h2.3L17.8 8.5l-2.3-2.3L5 16.7Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m14.4 7.3 2.3 2.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14l-5.2 6.1v4.8l-3.6 1.8v-6.6L5 6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.8h7.2L19 8.6v11.6H7A2 2 0 0 1 5 18.2V5.8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M14 4v5h5M8.5 13h7M8.5 16h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 4.5h6M10 4.5v5.2l-4.1 7.7A2 2 0 0 0 7.7 20h8.6a2 2 0 0 0 1.8-2.6L14 9.7V4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M8.2 15h7.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function IdCardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 6.5h14.4v11H4.8v-11Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M8 10h3.2M8 13h5.3M15.8 10.4h1.8M15.8 13.4h1.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 7h13A1.5 1.5 0 0 1 20 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 15.5v-7A1.5 1.5 0 0 1 5.5 7Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function MoreVerticalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="6.5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.8 5.2 10 9.1l-1.4 1.4a10.2 10.2 0 0 0 4.9 4.9l1.4-1.4 3.9 2.2-.7 2.6c-.2.7-.9 1.1-1.6 1A14.8 14.8 0 0 1 4.2 7.5c-.1-.7.3-1.4 1-1.6l2.6-.7Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function PillIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.1 18.2a4.2 4.2 0 0 1-5.9-5.9l4.1-4.1a4.2 4.2 0 0 1 5.9 5.9l-4.1 4.1Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m8.2 10.2 5.6 5.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.1 15.1 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8.5v10m4-10v10m4-10v10M5.5 6h13M9 6V4.5h6V6m-8.5 2.5.7 10.5h9.6l.7-10.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 10.5a5.5 5.5 0 0 1 11 0v3.2l1.4 2.3H5.1l1.4-2.3v-3.2Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M10 18.5a2.2 2.2 0 0 0 4 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 4.5v3m11-3v3M4.75 8.5h14.5M5.5 6h13a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-10A1.5 1.5 0 0 1 5.5 6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.8v4.6l3 1.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h5v5h-5v-5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 6H6.5A1.5 1.5 0 0 0 5 7.5v9A1.5 1.5 0 0 0 6.5 18H10m4.5-3.5L17 12l-2.5-2.5M9 12h8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8.5v7M8.5 12h7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 3.8v2.1m0 12.2v2.1m5.8-14-1.5 1.5M7.7 16.3l-1.5 1.5m14-5.8h-2.1M5.9 12H3.8m14 5.8-1.5-1.5M7.7 7.7 6.2 6.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 15.1A7.5 7.5 0 0 1 8.9 5a7.6 7.6 0 1 0 10.1 10.1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 5v4.2a4.2 4.2 0 1 0 8.4 0V5M5 5h3M13.4 5h3M10.7 13.1v1.8a4.1 4.1 0 0 0 4.1 4.1h.7a3.1 3.1 0 0 0 3.1-3.1v-1.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="18.6" cy="13" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.8 11.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Zm6.4 1.2a2.7 2.7 0 1 0 0-5.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M3.8 19c.5-3.2 2.2-5 5-5s4.5 1.8 5 5m1.1-4.8c2.4.3 3.9 1.9 4.3 4.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

export default Dashboard
