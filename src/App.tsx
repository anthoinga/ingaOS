import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MusicProvider } from './contexts/MusicContext'
import { LandingPage } from './components/LandingPage'
import { XMBShell } from './components/xmb/XMBShell'
import './lib/i18n'

type View = 'landing' | 'shell'

export default function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <MusicProvider>
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage key="landing" onOpen={() => setView('shell')} />
        ) : (
          <XMBShell key="shell" onExit={() => setView('landing')} />
        )}
      </AnimatePresence>
    </MusicProvider>
  )
}
