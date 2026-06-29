import { type ComponentType } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { CategoryKey, XMBItem, AppProps } from '@/types'
import { WorkViewer } from '../apps/WorkViewer'
import { FilesViewer } from '../apps/FilesViewer'
import { SettingsPanel } from '../apps/SettingsPanel'
import { BuiltPlaceholder } from '../apps/BuiltPlaceholder'
import { BrowserApp } from '../apps/BrowserApp'
import { PhotoViewer } from '../apps/PhotoViewer'
import { MusicPlayer } from '../apps/MusicPlayer'
import { ContactsView } from '../apps/ContactsView'
import { GalagaDemo } from '../apps/GalagaDemo'

const APP_REGISTRY: Partial<Record<string, ComponentType<AppProps>>> = {
  work:     WorkViewer,
  files:    FilesViewer,
  settings: SettingsPanel,
  built:    BuiltPlaceholder,
  browser:  BrowserApp,
  photos:   PhotoViewer,
  music:    MusicPlayer,
  contacts: ContactsView,
  games:    GalagaDemo,
}

const SIDEBAR_APPS = new Set<string>(['settings', 'contacts'])

interface Props {
  openApp: CategoryKey | null
  activeItem: XMBItem | null
  onClose: () => void
}

export function ContentPanel({ openApp, activeItem, onClose }: Props) {
  const { t } = useTranslation()
  const Component = openApp ? APP_REGISTRY[openApp] : null
  const isSidebar = openApp ? SIDEBAR_APPS.has(openApp) : false

  return (
    <AnimatePresence>
      {openApp && Component && (
        isSidebar ? (
          <>
            {/* Click-to-close backdrop overlay */}
            <motion.div
              key={`${openApp}-backdrop`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 z-20 bg-black/60 cursor-pointer"
            />
            {/* Sidebar panel */}
            <motion.div
              key={openApp}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] max-w-[85vw] z-30 flex flex-col glass-sidebar"
            >
              <header className="flex items-center justify-between px-5 py-4 shrink-0">
                <button
                  onClick={onClose}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ← {t('apps.back')}
                </button>
              </header>
              <div className="flex-1 overflow-hidden">
                <Component onClose={onClose} item={activeItem ?? undefined} />
              </div>
            </motion.div>
          </>
        ) : (
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
              <Component onClose={onClose} item={activeItem ?? undefined} />
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}
