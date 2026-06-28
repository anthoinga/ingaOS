import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getPhotos, urlFor, type Photo } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url'

interface Props { onClose: () => void }

export function PhotoViewer({ onClose: _onClose }: Props) {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPhotos()
      .then(setPhotos)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">{t('apps.loading')}</p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">No photos yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="h-full overflow-y-auto px-4 py-4">
        <div className="columns-2 sm:columns-3 gap-2">
          {photos.map((photo) => (
            <button
              key={photo._id}
              onClick={() => setLightbox(photo)}
              className="block w-full mb-2 rounded-lg overflow-hidden"
            >
              <img
                src={urlFor(photo.image as SanityImageSource).width(400).url()}
                alt={photo.caption ?? ''}
                className="w-full object-cover hover:scale-[1.02] transition-transform duration-200"
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="absolute inset-0 z-10 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={urlFor(lightbox.image as SanityImageSource).width(1200).url()}
            alt={lightbox.caption ?? ''}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/70">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}
