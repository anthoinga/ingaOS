import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? '',
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
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
  return client.fetch(
    `*[_type == "caseStudy"] | order(year desc) {
      _id, title, slug, year, role, tags, coverImage
    }`,
  )
}

export async function getCaseStudy(slug: string): Promise<CaseStudy> {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]`,
    { slug },
  )
}

export async function getPhotos(): Promise<Photo[]> {
  return client.fetch(
    `*[_type == "photo"] | order(date desc) {
      _id, image, caption, location, date, tags
    }`,
  )
}

export async function getTalks(): Promise<Talk[]> {
  return client.fetch(
    `*[_type == "talk"] | order(date desc) {
      _id, title, event, date, location,
      pdf { asset->{ url } },
      coverImage
    }`,
  )
}
