export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface ItineraryDay {
  _key: string
  dayNumber: number
  title: string
  description: string
}

export interface SanityPackageSummary {
  _id: string
  title: string
  slug: string
  price: number
  duration?: string
  shortDescription?: string
  mainImage?: SanityImage
  destination?: string
  category?: string
  featured?: boolean
}

export interface SanityPackage extends SanityPackageSummary {
  gallery?: SanityImage[]
  itinerary?: ItineraryDay[]
  inclusions?: string[]
  exclusions?: string[]
}
