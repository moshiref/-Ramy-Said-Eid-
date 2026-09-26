export type Project = {
  id: string
  title: string
  slug: string
  category: string | null
  short_description: string | null
  description: string | null
  year: number | null
  cover_image: string | null
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProjectImage = {
  id: string
  project_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export type ProjectWithImages = Project & {
  project_images: ProjectImage[]
}
