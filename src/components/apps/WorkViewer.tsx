import { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { useTranslation } from 'react-i18next'
import { getCaseStudies, getCaseStudy, urlFor, type CaseStudy } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url'

interface Props {
  onClose: () => void
}

export function WorkViewer({ onClose: _onClose }: Props) {
  const { t } = useTranslation()
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [selected, setSelected] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCaseStudies()
      .then(setStudies)
      .finally(() => setLoading(false))
  }, [])

  const openStudy = (slug: string) => {
    getCaseStudy(slug).then((s) => { if (s) setSelected(s) })
  }

  if (loading) return <Centered>{t('apps.loading')}</Centered>

  if (selected) {
    return (
      <div className="h-full overflow-y-auto px-6 py-4">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
        >
          ← Back
        </button>
        {selected.coverImage && (
          <img
            src={urlFor(selected.coverImage as SanityImageSource).width(900).url()}
            alt={selected.title}
            className="w-full rounded-lg mb-6 object-cover max-h-64"
          />
        )}
        <h1 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-1">
          {selected.title}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          {selected.year}{selected.role ? ` · ${selected.role}` : ''}
        </p>
        {selected.tags && selected.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selected.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--bg-raised)] text-[var(--text-muted)]">
                {tag}
              </span>
            ))}
          </div>
        )}
        {selected.body && (
          <div className="prose prose-invert max-w-none text-[var(--text-primary)]">
            <PortableText
              value={selected.body}
              components={portableComponents}
            />
          </div>
        )}
      </div>
    )
  }

  if (studies.length === 0) return <Centered>No case studies yet.</Centered>

  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      <h2 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-4">Work</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {studies.map((s) => (
          <button
            key={s._id}
            onClick={() => openStudy(s.slug.current)}
            className="text-left rounded-lg overflow-hidden bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-colors"
          >
            {s.coverImage && (
              <img
                src={urlFor(s.coverImage as SanityImageSource).width(600).height(300).url()}
                alt={s.title}
                className="w-full h-36 object-cover"
              />
            )}
            <div className="p-3">
              <p className="font-medium text-sm text-[var(--text-primary)]">{s.title}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.year}</p>
            </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portableComponents: any = {
  types: {
    imageBlock: ({ value }: { value: { image: SanityImageSource; caption?: string } }) => (
      <figure className="my-4">
        <img
          src={urlFor(value.image).width(900).url()}
          alt={value.caption ?? ''}
          className="w-full rounded-lg"
        />
        {value.caption && (
          <figcaption className="text-xs text-center text-[var(--text-muted)] mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
    videoBlock: ({ value }: { value: { embedUrl?: string } }) =>
      value.embedUrl ? (
        <div className="relative pb-[56.25%] my-4">
          <iframe
            src={value.embedUrl}
            className="absolute inset-0 w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      ) : null,
    pullQuote: ({ value }: { value: { text: string } }) => (
      <blockquote className="border-l-2 border-[var(--accent)] pl-4 my-4 text-[var(--text-muted)] italic">
        {value.text}
      </blockquote>
    ),
    twoColumn: ({ value }: { value: { leftImage: SanityImageSource; rightImage: SanityImageSource; caption?: string } }) => (
      <figure className="my-4">
        <div className="grid grid-cols-2 gap-2">
          <img src={urlFor(value.leftImage).width(450).url()} alt="" className="rounded-lg w-full" />
          <img src={urlFor(value.rightImage).width(450).url()} alt="" className="rounded-lg w-full" />
        </div>
        {value.caption && (
          <figcaption className="text-xs text-center text-[var(--text-muted)] mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
}
