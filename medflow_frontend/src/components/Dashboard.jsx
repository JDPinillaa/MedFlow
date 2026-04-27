import { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import logoDashboard from '../assets/logoDashboard.png'

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
  { id: 'doctor-1', nombreCompleto: 'Dra. Laura Gomez', especialidad: 'Medicina General' },
  { id: 'doctor-2', nombreCompleto: 'Dr. Andres Ruiz', especialidad: 'Dermatologia' },
]

const FALLBACK_PROCEDURES = [
  { id: 'procedure-1', nombre: 'Consulta General', duracionMinutos: 30 },
  { id: 'procedure-2', nombre: 'Control Dermatologico', duracionMinutos: 45 },
  { id: 'procedure-3', nombre: 'Resultados de Laboratorio', duracionMinutos: 25 },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'pacientes', label: 'Pacientes', icon: UsersIcon },
  { id: 'citas', label: 'Citas', icon: ClockIcon },
  { id: 'calendario', label: 'Calendario', icon: CalendarIcon },
]

const WEEK_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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

function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
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

function Dashboard({ apiBaseUrl, onLogout, session }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [data, setData] = useState({
    appointments: [],
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

        setData({ appointments, patients, doctors, procedures })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setData({
            appointments: FALLBACK_APPOINTMENTS,
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

  const metrics = useMemo(() => {
    const now = new Date()
    const activeAppointments = data.appointments.filter(
      (appointment) => appointment.estado !== 'CANCELADA',
    )
    const appointmentsToday = activeAppointments.filter((appointment) => {
      const date = parseDate(appointment.fechaHora)
      return date ? isSameDay(date, now) : false
    }).length
    const upcomingAppointments = activeAppointments
      .filter((appointment) => {
        const date = parseDate(appointment.fechaHora)
        return date ? date >= now : false
      })
      .sort((first, second) => parseDate(first.fechaHora) - parseDate(second.fechaHora))
    const completedAppointments = data.appointments.filter(
      (appointment) => appointment.estado === 'COMPLETADA',
    ).length
    const scheduleLoad = Math.min(100, Math.round((upcomingAppointments.length / 12) * 100))
    const availability = Math.max(25, 100 - scheduleLoad)

    return {
      activeAppointments,
      appointmentsToday,
      completedAppointments,
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
  const currentDoctor =
    data.doctors.find((doctor) => doctor.email === session.email) ?? data.doctors[0]
  const doctorLabel = currentDoctor?.nombreCompleto ?? greetingName
  const specialtyLabel = currentDoctor?.especialidad ?? session.rol
  const todayLabel = formatDateLabel(new Date())

  function handleQuickAction(message) {
    setQuickMessage(message)
  }

  function handleNavClick(itemId) {
    if (itemId === 'dashboard' || itemId === 'pacientes' || itemId === 'citas') {
      setActiveNav(itemId)
      setQuickMessage(null)
      setPatientFeedback(null)
      setAppointmentFeedback(null)
      return
    }

    setActiveNav('dashboard')
    setQuickMessage(`El módulo ${itemId} quedará integrado en la siguiente fase.`)
  }

  function openNewPatientForm() {
    setEditingPatient(null)
    setSelectedPatient(null)
    setPatientFeedback(null)
    setPatientForm(getEmptyPatientForm())
    setPatientFormOpen(true)
    setActiveNav('pacientes')
  }

  function openNewAppointmentForm() {
    setEditingAppointment(null)
    setAppointmentFeedback(null)
    setAppointmentForm(getEmptyAppointmentForm(currentDoctor?.id ? String(currentDoctor.id) : ''))
    setAppointmentFormOpen(true)
    setActiveNav('citas')
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
            trend={`${metrics.upcomingAppointments.length} próximas`}
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
                  onClick={() => handleQuickAction('La agenda completa se conectará desde el módulo Calendario.')}
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
                <p>Seguimientos sugeridos para la jornada.</p>
              </div>
              <ul>
                <li>Confirmar asistencia de pacientes con cita programada.</li>
                <li>Revisar historias clínicas pendientes antes del cierre.</li>
                <li>Validar disponibilidad del consultorio para la tarde.</li>
              </ul>
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
                onClick={() => handleQuickAction('Calendario marcado como siguiente vista prioritaria.')}
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
                            onClick={() => {
                              setSelectedPatient(patient)
                              setPatientFormOpen(false)
                            }}
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

        {(patientFormOpen || selectedPatient) ? (
          <section className="patient-detail-panel">
            {patientFormOpen ? (
              <PatientForm
                editingPatient={editingPatient}
                formValues={patientForm}
                onCancel={closePatientForm}
                onChange={updatePatientForm}
                onSubmit={handlePatientSubmit}
                saving={savingPatient}
              />
            ) : (
              <PatientDetail
                appointments={data.appointments}
                onClose={() => setSelectedPatient(null)}
                onEdit={() => openEditPatientForm(selectedPatient)}
                patient={selectedPatient}
              />
            )}
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
              placeholder="Buscar paciente, médico o motivo de consulta..."
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

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="Navegación principal">
        <div className="dashboard-brand">
          <img src={logoDashboard} alt="" />
          <span>MedFlow</span>
        </div>

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
            <button type="button" aria-label="Configuración">
              <SettingsIcon />
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

function PatientDetail({ appointments, onClose, onEdit, patient }) {
  const patientAppointments = appointments
    .filter((appointment) => appointment.pacienteId === patient.id)
    .sort((first, second) => parseDate(second.fechaHora) - parseDate(first.fechaHora))

  return (
    <div className="patient-detail">
      <div className="section-heading is-row">
        <div>
          <h2>Ficha del paciente</h2>
          <p>Información disponible en el directorio clínico.</p>
        </div>
        <button type="button" className="text-action" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <div className="patient-profile">
        <span className="patient-profile-avatar">{getInitials(patient.nombreCompleto)}</span>
        <div>
          <h3>{patient.nombreCompleto}</h3>
          <p>{patient.email}</p>
        </div>
        <button type="button" className="secondary-action" onClick={onEdit}>
          <EditIcon />
          Editar
        </button>
      </div>

      <dl className="patient-detail-list">
        <div>
          <dt>Documento</dt>
          <dd>{patient.documento}</dd>
        </div>
        <div>
          <dt>Teléfono</dt>
          <dd>{patient.telefono}</dd>
        </div>
        <div>
          <dt>Dirección</dt>
          <dd>{patient.direccion}</dd>
        </div>
        <div>
          <dt>Citas registradas</dt>
          <dd>{patientAppointments.length}</dd>
        </div>
      </dl>

      <div className="patient-history">
        <h3>Historial reciente</h3>
        {patientAppointments.slice(0, 3).map((appointment) => (
          <article key={appointment.id}>
            <span>
              <strong>{appointment.procedimientoNombre}</strong>
              <small>{formatShortDate(appointment.fechaHora)} · {formatTime(appointment.fechaHora)}</small>
            </span>
            <span className={`status-badge ${getStatusClass(appointment.estado)}`}>
              {formatStatus(appointment.estado)}
            </span>
          </article>
        ))}
        {patientAppointments.length === 0 ? (
          <p className="empty-state">Este paciente aún no tiene citas registradas.</p>
        ) : null}
      </div>
    </div>
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

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-6 4 10 2-4h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 3.8v2.1m0 12.2v2.1m5.8-14-1.5 1.5M7.7 16.3l-1.5 1.5m14-5.8h-2.1M5.9 12H3.8m14 5.8-1.5-1.5M7.7 7.7 6.2 6.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
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
