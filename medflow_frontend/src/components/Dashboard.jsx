import { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import logoDashboard from '../assets/logoDashboard.png'

const FALLBACK_APPOINTMENTS = [
  {
    id: 'fallback-1',
    fechaHora: '2026-05-10T09:00:00',
    estado: 'COMPLETADA',
    pacienteNombre: 'Ana Perez',
    procedimientoNombre: 'Consulta General',
    doctorNombre: 'Dra. Laura Gomez',
  },
  {
    id: 'fallback-2',
    fechaHora: '2026-05-12T09:00:00',
    estado: 'PROGRAMADA',
    pacienteNombre: 'Carlos Ramirez',
    procedimientoNombre: 'Consulta General',
    doctorNombre: 'Dra. Laura Gomez',
  },
  {
    id: 'fallback-3',
    fechaHora: '2026-05-12T11:00:00',
    estado: 'PROGRAMADA',
    pacienteNombre: 'Maria Torres',
    procedimientoNombre: 'Control Dermatologico',
    doctorNombre: 'Dr. Andres Ruiz',
  },
]

const FALLBACK_PATIENTS = [
  { id: 'patient-1', nombreCompleto: 'Ana Perez' },
  { id: 'patient-2', nombreCompleto: 'Carlos Ramirez' },
  { id: 'patient-3', nombreCompleto: 'Maria Torres' },
]

const FALLBACK_DOCTORS = [
  { id: 'doctor-1', nombreCompleto: 'Dra. Laura Gomez', especialidad: 'Medicina General' },
  { id: 'doctor-2', nombreCompleto: 'Dr. Andres Ruiz', especialidad: 'Dermatologia' },
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

function Dashboard({ apiBaseUrl, onLogout, session }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [data, setData] = useState({
    appointments: [],
    doctors: [],
    patients: [],
  })
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState(null)
  const [quickMessage, setQuickMessage] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      setLoading(true)
      setSyncError(null)

      try {
        const [appointments, patients, doctors] = await Promise.all([
          fetchWithAuth(apiBaseUrl, session.token, '/citas', controller.signal),
          fetchWithAuth(apiBaseUrl, session.token, '/pacientes', controller.signal),
          fetchWithAuth(apiBaseUrl, session.token, '/doctores', controller.signal),
        ])

        setData({ appointments, patients, doctors })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setData({
            appointments: FALLBACK_APPOINTMENTS,
            patients: FALLBACK_PATIENTS,
            doctors: FALLBACK_DOCTORS,
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

  const weeklyData = useMemo(
    () => buildWeeklyData(metrics.activeAppointments),
    [metrics.activeAppointments],
  )
  const chart = useMemo(() => buildChartPath(weeklyData), [weeklyData])
  const greetingName = getGreetingName(session)
  const currentDoctor = data.doctors[0]
  const doctorLabel = currentDoctor?.nombreCompleto ?? greetingName
  const specialtyLabel = currentDoctor?.especialidad ?? session.rol
  const todayLabel = formatDateLabel(new Date())

  function handleQuickAction(message) {
    setQuickMessage(message)
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
                onClick={() => setActiveNav(item.id)}
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
              trend={`${metrics.totalDoctors} doctores activos`}
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
                  <button
                    type="button"
                    className="quick-action is-patient"
                    onClick={() =>
                      handleQuickAction('El módulo de pacientes quedó listo para conectarse al formulario de registro.')
                    }
                  >
                    <span>
                      <UsersIcon />
                    </span>
                    <strong>Registrar paciente</strong>
                    <small>Añadir nuevo registro clínico</small>
                  </button>
                  <button
                    type="button"
                    className="quick-action is-appointment"
                    onClick={() =>
                      handleQuickAction('El módulo de citas quedó señalado para la siguiente pantalla del flujo.')
                    }
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

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-6 4 10 2-4h4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
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
