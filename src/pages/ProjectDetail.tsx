import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPublishedProjectBySlug } from '../services/projects'
import type { ProjectWithImages } from '../types/project'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ProjectWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    fetchPublishedProjectBySlug(slug)
      .then(data => { if (!cancelled) { setProject(data as ProjectWithImages); setLoading(false) } })
      .catch(err => { if (!cancelled) { setError((err as Error).message); setLoading(false) } })
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="work-detail loading-state container">
        <span className="work-loader" aria-hidden="true" />
        <p>Loading project…</p>
      </div>
    )
  }
  if (error || !project) {
    return (
      <div className="work-detail error-state container">
        <p>Project not found.</p>
        <Link to="/#work" className="detail-back">← Back to work</Link>
      </div>
    )
  }

  return (
    <article className="work-detail">
      <div className="container detail-container">
        <nav className="detail-nav" aria-label="Breadcrumb">
          <Link to="/#work" className="detail-back">← Back to work</Link>
        </nav>

        <header className="detail-header">
          <div className="detail-meta">
            <span className="detail-cat">{project.category ?? '—'}</span>
            <span className="detail-dot" aria-hidden="true">·</span>
            <span className="detail-year">{project.year ?? ''}</span>
            {project.featured && <span className="detail-featured">Featured</span>}
          </div>
          <h1 className="detail-title">{project.title}</h1>
          {project.short_description && <p className="detail-short">{project.short_description}</p>}
        </header>

        {project.cover_image && (
          <div className="detail-cover-wrap">
            <img src={project.cover_image} alt={project.title} className="detail-cover" loading="eager" decoding="async" />
          </div>
        )}

        {project.description && (
          <div className="detail-desc">
            <p>{project.description}</p>
          </div>
        )}

        {project.project_images?.length > 0 && (
          <section className="detail-gallery" aria-label="Project images">
            <ul className="gallery-grid" role="list">
              {project.project_images.map(img => (
                <li key={img.id} className="gallery-item">
                  <img src={img.image_url} alt={img.alt_text || project.title} loading="lazy" decoding="async" className="gallery-img" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
