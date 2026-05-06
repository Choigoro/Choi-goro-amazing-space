export interface Profile {
  imageUrl: string
  bio: string
}

export interface Webtoon {
  id: string
  title: string
  thumbnail: string
  images: string[]
  endCharacterImage?: string
  createdAt: string
}

export interface Illustration {
  id: string
  title: string
  description: string
  images: string[]
  createdAt: string
}

export interface LinkItem {
  id: string
  type: "blog" | "instagram" | "email" | "twitter" | "youtube" | "other"
  label: string
  url: string
}

export interface CategoryImage {
  id: "profile" | "webtoon" | "illustration" | "linktree"
  title: string
  grayscaleImage: string
  colorImage: string
  href: string
  isModal?: boolean
}

export interface SiteData {
  profile: Profile
  webtoons: Webtoon[]
  illustrations: Illustration[]
  linktree: LinkItem[]
  categories: CategoryImage[]
}
