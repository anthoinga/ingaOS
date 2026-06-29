import { useState } from 'react'
import { MusicProvider } from './contexts/MusicContext'
import { LandingPage, REVEAL_MS } from './components/LandingPage'
import { XMBShell } from './components/xmb/XMBShell'
import { playSound, setMuffled } from './effects/soundEngine'
import './lib/i18n'

export default function App() {
  const [view, setView] = useState<'landing' | 'reveal' | 'shell'>('landing')
  const [landingHovered, setLandingHovered] = useState(false)

  const handleOpen = () => {
    playSound('boot_up')
    setMuffled(false) // Open master filter
    setLandingHovered(false)
    setView('reveal')
    setTimeout(() => {
      setView('shell')
    }, REVEAL_MS)
  }

  return (
    <MusicProvider>
      <div className="relative w-full h-full">
        <XMBShell
          onExit={() => {
            setMuffled(true) // Muffle master filter when returning to landing page
            setView('landing')
          }}
          isActive={view === 'shell'}
        />
        {view !== 'shell' && (
          <>
            <LandingPage
              isRevealing={view === 'reveal'}
              isHovered={landingHovered}
            />
            <div
              onMouseEnter={() => view === 'landing' && setLandingHovered(true)}
              onMouseLeave={() => setLandingHovered(false)}
              onClick={handleOpen}
              className={`absolute top-0 right-0 w-64 h-64 z-[60] bg-transparent transition-all ${
                view === 'reveal' ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
              }`}
            />
          </>
        )}
      </div>
    </MusicProvider>
  )
}
