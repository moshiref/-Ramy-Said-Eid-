import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

type NavItem = { label: string; href: string; active?: boolean }

const items: NavItem[] = [
  { label: 'Home', href: '#home', active: true },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when menu open on mobile
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // close on resize to desktop + ESC
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 900px)')
    const handler = () => { if (mql.matches) setOpen(false) }
    mql.addEventListener('change', handler)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      mql.removeEventListener('change', handler)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <nav className="nav" aria-label="Primary">
        {/* Brand */}
        <a href="#home" className="brand" aria-label="Ramy Said Eid — Home">
          <span className="brand-text">
            <span className="brand-name">Ramy Said Eid</span>
          </span>
        </a>

        {/* Desktop links - visually centered */}
        <ul className="nav-links" role="list">
          {items.map(i => (
            <li key={i.label}>
              <a
                href={i.href}
                className={`nav-link ${i.active ? 'is-active' : ''}`}
                aria-current={i.active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="nav-link-text">{i.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <a href="#contact" className="nav-cta">
            <span>Start a project</span>
            <span className="nav-cta-arrow" aria-hidden="true">→</span>
          </a>

          <button
            ref={btnRef}
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span className="nav-toggle-box" aria-hidden="true">
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className="mobile-panel"
        aria-hidden={!open}
      >
        <div className="mobile-inner container">
          <ul className="mobile-links" role="list">
            {items.map((i, idx) => (
              <li key={i.label} style={{ '--i': idx } as React.CSSProperties}>
                <a href={i.href} className={`mobile-link ${i.active ? 'is-active' : ''}`} onClick={() => setOpen(false)}>
                  <span className="mobile-link-label">{i.label}</span>
                  <span className="mobile-link-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-foot">
            <a href="#contact" className="mobile-cta" onClick={() => setOpen(false)}>
              Start a project <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="nav-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
    </header>
  )
}
