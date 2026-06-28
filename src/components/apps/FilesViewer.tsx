import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useTranslation } from 'react-i18next'
import { getTalks, urlFor, type Talk } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface Props {
  onClose: () => void
}

export function FilesViewer({ onClose: _onClose }: Props) {
  const { t } = useTranslation()
  const [talks, setTalks] = useState<Talk[]>([])
  const [selected, setSelected] = useState<Talk | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTalks()
      .then(setTalks)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Centered>{t('apps.loading')}</Centered>

  if (selected) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b border-[var(--bg-raised)]">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Back
          </button>
          <span className="text-sm text-[var(--text-muted)]">{numPages} pages</span>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-4 px-2">
          <Document
            file={selected.pdf.asset.url}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<p className="text-sm text-[var(--text-muted)]">{t('apps.loading')}</p>}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={Math.min(window.innerWidth - 32, 800)}
                className="mb-2 shadow-lg"
              />
            ))}
          </Document>
        </div>
      </div>
    )
  }

  if (talks.length === 0) return <Centered>No talks uploaded yet.</Centered>

  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      <h2 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-4">Talks & Files</h2>
      <div className="flex flex-col gap-3">
        {talks.map((talk) => (
          <button
            key={talk._id}
            onClick={() => setSelected(talk)}
            className="flex items-center gap-4 rounded-lg p-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-colors text-left"
          >
            {talk.coverImage ? (
              <img
                src={urlFor(talk.coverImage as SanityImageSource).width(80).height(80).url()}
                alt=""
                className="w-12 h-12 rounded object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded bg-[var(--bg-raised)] flex items-center justify-center shrink-0 text-xl">
                📄
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-sm text-[var(--text-primary)] truncate">{talk.title}</p>
              {talk.event && <p className="text-xs text-[var(--text-muted)] truncate">{talk.event}</p>}
              {talk.date && <p className="text-xs text-[var(--text-muted)]">{talk.date}</p>}
            </div>
            <span className="ml-auto text-[var(--accent)] text-xs shrink-0">PDF ▶</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-sm text-[var(--text-muted)]">{children}</p>
    </div>
  )
}
