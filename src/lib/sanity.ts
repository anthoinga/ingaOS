import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder, { type ImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

// Lazy — only created when VITE_SANITY_PROJECT_ID is present.
// Without it the module still imports cleanly and query functions return []/null.
let _client: SanityClient | null = null
let _builder: ImageUrlBuilder | null = null

function getClient(): SanityClient | null {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  if (!projectId) return null
  if (!_client) {
    _client = createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    })
    _builder = imageUrlBuilder(_client)
  }
  return _client
}

export function urlFor(source: SanityImageSource): ReturnType<ImageUrlBuilder['image']> {
  const c = getClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!c || !_builder) return { url: () => '' } as any
  return _builder.image(source)
}

// --- Query types ---

export interface CaseStudy {
  _id: string
  title: string
  slug: { current: string }
  year: number
  role?: string
  tags?: string[]
  coverImage?: SanityImageSource
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
}

export interface Photo {
  _id: string
  image: SanityImageSource
  caption?: string
  location?: string
  date?: string
  tags?: string[]
}

export interface Talk {
  _id: string
  title: string
  event?: string
  date?: string
  location?: string
  pdf: { asset: { url: string } }
  coverImage?: SanityImageSource
}

// --- Queries ---

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const c = getClient()
  if (!c) return []
  return c.fetch(
    `*[_type == "caseStudy"] | order(year desc) {
      _id, title, slug, year, role, tags, coverImage
    }`,
  )
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const c = getClient()
  if (!c) return null
  return c.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]`,
    { slug },
  )
}

export async function getPhotos(): Promise<Photo[]> {
  const c = getClient()
  if (!c) return []
  return c.fetch(
    `*[_type == "photo"] | order(date desc) {
      _id, image, caption, location, date, tags
    }`,
  )
}

export async function getTalks(): Promise<Talk[]> {
  const c = getClient()
  if (!c) return []
  return c.fetch(
    `*[_type == "talk"] | order(date desc) {
      _id, title, event, date, location,
      pdf { asset->{ url } },
      coverImage
    }`,
  )
}
