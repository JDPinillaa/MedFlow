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

function Login() {
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

      <section className="form-panel">
        <div className="form-shell">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingrese sus credenciales para acceder al sistema.</p>
          </div>

          <div className="alert-banner" role="alert">
            <span className="alert-icon">
              <AlertIcon />
            </span>
            <p>
              Credenciales no válidas. Por favor, verifique su usuario y
              contraseña.
            </p>
          </div>

          <form className="login-form">
            <label className="field">
              <span className="field-label">Correo Electrónico</span>
              <span className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input type="email" defaultValue="" />
              </span>
            </label>

            <div className="field-group">
              <div className="field-head">
                <span className="field-label">Contraseña</span>
                <a href="/">¿Olvidó su contraseña?</a>
              </div>
              <label className="field">
                <span className="input-wrap">
                  <span className="input-icon">
                    <LockIcon />
                  </span>
                  <input type="password" defaultValue="" />
                </span>
              </label>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Recordar mi sesión en este dispositivo</span>
            </label>

            <button type="submit" className="submit-button">
              Ingresar
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
      </section>
    </main>
  )
}

export default Login
