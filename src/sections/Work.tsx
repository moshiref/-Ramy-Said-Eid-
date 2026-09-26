import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPublishedProjects } from '../services/projects'
import type { Project } from '../types/project'
import './Work.css'

export default function Work() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState<string>('All')

  useEffect(() => {
    let cancelled = false
    fetchPublishedProjects()
      .then(data => { if (!cancelled) setProjects(data) })
      .catch(err => { if (!cancelled) setError((err as Error).message ?? 'Failed to load work') })
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    if (!projects) return []
    const set = new Set<string>()
    projects.forEach(p => { if (p.category) set.add(p.category) })
    return ['All', ...Array.from(set).sort()]
  }, [projects])

  const filtered = useMemo(() => {
    if (!projects) return []
    if (activeCat === 'All') return projects
    return projects.filter(p => p.category === activeCat)
  }, [projects, activeCat])

  return (
    <section id="work" className="work" aria-labelledby="work-heading">
      <div className="container work-container">
        <div className="work-header">
          <div className="work-eyebrow">
            <span className="work-eyebrow-line" aria-hidden="true" />
            <span className="work-eyebrow-text">Selected work</span>
          </div>
          <div className="work-head-row">
            <h2 id="work-heading" className="work-headline">
              <span className="hl">Identities built</span>
              <span className="hl serif italic">for ambitious</span>
              <span className="hl">brands.</span>
            </h2>
            <p className="work-intro">
              A focused selection of published identities — logos, systems and applications crafted for clarity and longevity.
            </p>
          </div>

          {categories.length > 2 && (
            <div className="work-filters" role="tablist" aria-label="Filter projects by category">
              {categories.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCat === cat}
                  className={`filter-btn ${activeCat === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="work-body">
          {error && (
            <div className="work-state error" role="alert">
              <p>Couldn’t load work. {error}</p>
              <p className="work-state-hint">Check your Supabase env & migration have been applied.</p>
            </div>
          )}

          {projects === null && !error && (
            <div className="work-state loading" aria-busy="true">
              <span className="work-loader" aria-hidden="true" />
              <p>Loading work…</p>
            </div>
          )}

          {projects !== null && filtered.length === 0 && !error && (
            <div className="work-state empty">
              <p>No published projects yet.</p>
              <p className="work-state-hint">Publish a project from the admin dashboard to see it here.</p>
            </div>
          )}

          {filtered.length > 0 && (
            <ul className="work-grid" role="list">
              {filtered.map(p => (
                <li key={p.id} className="work-card">
                  <Link to={`/work/${p.slug}`} className="work-card-link" aria-label={`${p.title} — ${p.category ?? ''}`}>
                    <div className="work-cover-wrap">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          className="work-cover"
                        />
                      ) : (
                        <div className="work-cover placeholder" aria-hidden="true">
                          <span>No cover</span>
                        </div>
                      )}
                      {p.featured && <span className="work-featured">Featured</span>}
                    </div>
                    <div className="work-meta">
                      <h3 className="work-title">{p.title}</h3>
                      <div className="work-sub">
                        <span className="work-cat">{p.category ?? '—'}</span>
                        <span className="work-dot" aria-hidden="true">·</span>
                        <span className="work-year">{p.year ?? '—'}</span>
                      </div>
                      {p.short_description && <p className="work-short">{p.short_description}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
