import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { CategoryKey } from '@/types'
import { WorkViewer } from '../apps/WorkViewer'
import { FilesViewer } from '../apps/FilesViewer'
import { SettingsPanel } from '../apps/SettingsPanel'
import { BuiltPlaceholder } from '../apps/BuiltPlaceholder'
import { BrowserApp } from '../apps/BrowserApp'
import { PhotoViewer } from '../apps/PhotoViewer'
import { MusicPlayer } from '../apps/MusicPlayer'
import { ContactsView } from '../apps/ContactsView'
import { GalagaDemo } from '../apps/GalagaDemo'

interface Props {
  openApp: CategoryKey | null
  onClose: () => void
}

function AppContent({ appKey, onClose }: { appKey: CategoryKey; onClose: () => void }) {
  switch (appKey) {
    case 'work':     return <WorkViewer onClose={onClose} />
    case 'files':    return <FilesViewer onClose={onClose} />
    case 'settings': return <SettingsPanel onClose={onClose} />
    case 'built':    return <BuiltPlaceholder onClose={onClose} />
    case 'browser':  return <BrowserApp onClose={onClose} />
    case 'photos':   return <PhotoViewer onClose={onClose} />
    case 'music':    return <MusicPlayer onClose={onClose} />
    case 'contacts': return <ContactsView onClose={onClose} />
    case 'games':    return <GalagaDemo onClose={onClose} />
    default:         return null
  }
}

export function AppMount({ openApp, onClose }: Props) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {openApp && (
        <motion.div
          key={openApp}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 z-20 flex flex-col bg-[var(--bg-primary)]"
        >
          <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--bg-raised)] shrink-0">
            <button
              onClick={onClose}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← {t('apps.back')}
            </button>
          </header>
          <div className="flex-1 overflow-hidden">
            <AppContent appKey={openApp} onClose={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
