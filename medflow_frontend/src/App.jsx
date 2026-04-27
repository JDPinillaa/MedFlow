import { useState } from 'react'
import './App.css'
import Login, { PasswordRecovery } from './components/Login'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'
const SESSION_STORAGE_KEY = 'medflow.session'

function getStoredSession() {
  const storedSession =
    localStorage.getItem(SESSION_STORAGE_KEY) ??
    sessionStorage.getItem(SESSION_STORAGE_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession)
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

function App() {
  const [session, setSession] = useState(getStoredSession)
  const [authView, setAuthView] = useState('login')

  function handleLogin(loginData, rememberSession) {
    const nextSession = {
      token: loginData.token,
      usuarioId: loginData.usuarioId,
      email: loginData.email,
      rol: loginData.rol,
    }
    const storage = rememberSession ? localStorage : sessionStorage

    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    setSession(null)
    setAuthView('login')
  }

  if (session) {
    return (
      <main className="session-page">
        <section className="session-card" aria-live="polite">
          <p className="session-kicker">MedFlow</p>
          <h1>Sesión iniciada</h1>
          <dl>
            <div>
              <dt>Usuario</dt>
              <dd>{session.email}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{session.rol}</dd>
            </div>
          </dl>
          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  if (authView === 'recovery') {
    return <PasswordRecovery onBackToLogin={() => setAuthView('login')} />
  }

  return (
    <Login
      apiBaseUrl={API_BASE_URL}
      onForgotPassword={() => setAuthView('recovery')}
      onLogin={handleLogin}
    />
  )
}

export default App
