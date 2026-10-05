import { groq } from 'next-sanity'

export const ALL_PACKAGES_QUERY = groq`
  *[_type == "package"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    shortDescription,
    mainImage,
    destination,
    category,
    featured
  }
`

export const PACKAGE_BY_SLUG_QUERY = groq`
  *[_type == "package" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    shortDescription,
    mainImage,
    gallery,
    destination,
    category,
    itinerary,
    inclusions,
    exclusions,
    featured
  }
`

export const FEATURED_PACKAGES_QUERY = groq`
  *[_type == "package" && featured == true] {
    _id,
    title,
    "slug": slug.current,
    price,
    duration,
    shortDescription,
    mainImage,
    destination,
    category,
    featured
  }
`

export const PACKAGES_BY_IDS_QUERY = groq`
  *[_type == "package" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    price,
    mainImage
  }
`
