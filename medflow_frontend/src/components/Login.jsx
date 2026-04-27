import { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png'

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.8v5.2m0 3.2h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.75 7.25h14.5a1.5 1.5 0 0 1 1.5 1.5v6.5a1.5 1.5 0 0 1-1.5 1.5H4.75a1.5 1.5 0 0 1-1.5-1.5v-6.5a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 8 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15.5 5.5 9 12l6.5 6.5M9.5 12H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.75 18.75 6v5.35c0 4.05-2.65 7.72-6.75 8.9-4.1-1.18-6.75-4.85-6.75-8.9V6L12 3.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.25 12.1 1.75 1.75 3.9-4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.25 10.25h9.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 10.25V8.5a3.5 3.5 0 1 1 7 0v1.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.7 9.4a2.62 2.62 0 1 1 4.04 2.2c-.93.62-1.48 1.04-1.48 2.16m-.01 2.15h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PulseMark() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <path
        d="M12 95h38l18-52 31 102 31-81 22 31h56"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AuthLayout({ children }) {
  return (
    <main className="login-page">
      <section className="brand-panel">
        <header className="brand-header">
          <img src={logo} alt="MedFlow" className="brand-logo" />
        </header>

        <div className="brand-copy">
          <h1>Optimice la gestión de su consultorio médico.</h1>
          <p>
            Acceda a su historial de pacientes, agenda de citas y reportes clínicos
            en una sola plataforma segura e intuitiva.
          </p>
        </div>
      </section>

      <section className="form-panel">{children}</section>
    </main>
  )
}

function Login({ apiBaseUrl, onForgotPassword, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberSession, setRememberSession] = useState(false)
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setStatus(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.mensaje ?? 'No fue posible iniciar sesion.')
      }

      onLogin(payload, rememberSession)
      setStatus({
        type: 'success',
        message: 'Sesion iniciada correctamente.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible iniciar sesion.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
        <div className="form-shell">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingrese sus credenciales para acceder al sistema.</p>
          </div>

          {status ? (
            <div
              className={`alert-banner is-${status.type}`}
              role={status.type === 'error' ? 'alert' : 'status'}
            >
              <span className="alert-icon">
                <AlertIcon />
              </span>
              <p>{status.message}</p>
            </div>
          ) : null}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Correo Electrónico</span>
              <span className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <div className="field-group">
              <div className="field-head">
                <span className="field-label">Contraseña</span>
                <button type="button" className="text-link-button" onClick={onForgotPassword}>
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <label className="field">
                <span className="input-wrap">
                  <span className="input-icon">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </span>
              </label>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(event) => setRememberSession(event.target.checked)}
              />
              <span>Recordar mi sesión en este dispositivo</span>
            </label>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="form-footer">
            <div className="support-link">
              <HelpIcon />
              <span>¿Necesita ayuda técnica?</span>
            </div>
            <nav className="footer-links" aria-label="Enlaces secundarios">
              <a href="/">Privacidad</a>
              <a href="/">Términos</a>
            </nav>
          </div>

          <div className="pulse-mark">
            <PulseMark />
          </div>
        </div>
    </AuthLayout>
  )
}

export function PasswordRecovery({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
      setStatus({
        type: 'success',
        message:
        'Si el correo pertenece a una cuenta activa, enviaremos un código de verificación para continuar con el cambio de contraseña.',
    })
  }

  return (
    <AuthLayout>
      <div className="form-shell recovery-shell">
        <button type="button" className="back-button" onClick={onBackToLogin}>
          <span className="back-icon">
            <ArrowLeftIcon />
          </span>
          Volver al inicio de sesión
        </button>

        <div className="form-header">
          <h2>Recuperar contraseña</h2>
          <p>
            Ingrese el correo electrónico asociado a su cuenta para recibir el código
            de verificación.
          </p>
        </div>

        <div className="info-panel">
          <span className="info-icon">
            <ShieldIcon />
          </span>
          <p>
            El código será enviado a su bandeja de entrada. Si no reconoce o no
            tiene acceso a ese correo, comuníquese con el administrador del sistema.
          </p>
        </div>

        {status ? (
          <div className="alert-banner is-success" role="status">
            <span className="alert-icon">
              <AlertIcon />
            </span>
            <p>{status.message}</p>
          </div>
        ) : null}

        <form className="login-form recovery-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Correo Electrónico</span>
            <span className="input-wrap">
              <span className="input-icon">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <button type="submit" className="submit-button">
            Enviar código
          </button>
        </form>

        <div className="recovery-support">
          <HelpIcon />
          <p>
            Si necesita ayuda para confirmar su correo institucional, contacte al
            administrador antes de solicitar un nuevo código.
          </p>
        </div>

        <div className="pulse-mark">
          <PulseMark />
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
