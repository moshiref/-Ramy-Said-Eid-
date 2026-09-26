import { supabase } from '../lib/supabase'
import type { Project, ProjectImage } from '../types/project'

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // keep latin + arabic letters, numbers, spaces and hyphens
    .replace(/[^a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Project[]
}

export async function fetchPublishedProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) throw error
  // sort images by sort_order
  if (data?.project_images) {
    data.project_images.sort((a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order)
  }
  return data
}

export async function fetchAllProjectsAdmin(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Project[]
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  if (data?.project_images) {
    data.project_images.sort((a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order)
  }
  return data
}

export async function createProject(input: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('projects').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id: string, patch: Partial<Project>) {
  const { data, error } = await supabase.from('projects').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  // delete storage files first if needed by caller, then delete row (cascade deletes images)
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublished(id: string, current: boolean) {
  return updateProject(id, { published: !current })
}
export async function toggleFeatured(id: string, current: boolean) {
  return updateProject(id, { featured: !current })
}

// Images
export async function addProjectImage(project_id: string, image_url: string, alt_text: string | null, sort_order = 0) {
  const { data, error } = await supabase
    .from('project_images')
    .insert({ project_id, image_url, alt_text, sort_order })
    .select()
    .single()
  if (error) throw error
  return data
}
export async function deleteProjectImage(id: string) {
  const { error } = await supabase.from('project_images').delete().eq('id', id)
  if (error) throw error
}
export async function updateProjectImage(id: string, patch: Partial<ProjectImage>) {
  const { data, error } = await supabase.from('project_images').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

// Storage helpers
const BUCKET = 'portfolio-images'

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadImage(file: File, projectSlug: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const allowed = ['jpg', 'jpeg', 'png', 'webp']
  if (!allowed.includes(ext)) throw new Error('Unsupported format. Use JPG, PNG or WEBP.')
  if (file.size > 8 * 1024 * 1024) throw new Error('File too large. Max 8MB.')
  const raw = slugify(projectSlug || 'project') || 'project'
  // storage paths: ascii-only to stay safe (slugs may contain Arabic)
  const ascii = raw.replace(/[^\x00-\x7F]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  const safeSlug = ascii || 'project'
  const name = `${safeSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  return getPublicUrl(name)
}

// Try to delete from storage if image_url contains bucket path; best-effort
export async function deleteStorageByUrl(url: string) {
  try {
    const marker = `/portfolio-images/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length)
    // url may contain query params, strip
    const clean = path.split('?')[0]
    await supabase.storage.from(BUCKET).remove([clean])
  } catch {
    // ignore
  }
}
