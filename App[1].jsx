/**
 * App.jsx
 * Root component with error boundary + context providers.
 */
import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { GameProvider, useGame, PHASE } from './context/GameContext'
import Navbar from './components/Navbar'
import ParticlesBg from './components/ParticlesBg'
import Home from './pages/Home'
import Game from './pages/Game'
import GameOver from './components/GameOver'

/* ── Error Boundary ───────────────────────────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#060611', color: '#00f5ff', fontFamily: 'monospace',
          padding: '2rem', textAlign: 'center', gap: '1rem'
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.2em' }}>RENDER ERROR</h2>
          <p style={{ color: '#94a3b8', maxWidth: 400 }}>
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
            style={{
              marginTop: '1rem', padding: '0.75rem 2rem', borderRadius: 12,
              background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
              color: '#000', fontWeight: 'bold', cursor: 'pointer',
              border: 'none', fontSize: '0.9rem', letterSpacing: '0.15em'
            }}
          >
            RELOAD GAME
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/* ── Inner app ─────────────────────────────────────────────── */
function AppInner() {
  const { state } = useGame()
  const phase = state?.phase

  const showGame     = phase && phase !== PHASE.IDLE
  const showGameOver = phase === PHASE.GAME_OVER

  return (
    <div className="relative min-h-screen grid-bg">
      <ParticlesBg />
      <Navbar />

      <AnimatePresence mode="wait">
        {!showGame
          ? <Home key="home" />
          : <Game key="game" />
        }
      </AnimatePresence>

      <AnimatePresence>
        {showGameOver && <GameOver key="gameover" />}
      </AnimatePresence>
    </div>
  )
}

/* ── Root export ──────────────────────────────────────────── */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GameProvider>
          <ErrorBoundary>
            <AppInner />
          </ErrorBoundary>
        </GameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
