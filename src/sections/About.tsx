import { useEffect, useRef } from 'react'
import './About.css'

type Cap = { n: string; title: string; desc: string }

const caps: Cap[] = [
  { n: '01', title: 'Logos & Symbols', desc: 'Distinct marks built for recall and reduction.' },
  { n: '02', title: 'Typography', desc: 'Type systems that carry voice and hierarchy.' },
  { n: '03', title: 'Color Palettes', desc: 'Restrained palettes engineered for legibility.' },
  { n: '04', title: 'Icons', desc: 'Minimal sets aligned to the brand language.' },
  { n: '05', title: 'Social Media Covers', desc: 'Cohesive covers for digital presence.' },
  { n: '06', title: 'Print Materials', desc: 'Tangible touchpoints with editorial precision.' },
  { n: '07', title: 'Mockups', desc: 'Contextual presentation that proves the system.' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.querySelectorAll('.reveal').forEach(r => r.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    )
    el.querySelectorAll('.reveal').forEach(r => io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef} aria-labelledby="about-heading">
      <div className="about-rule-top" aria-hidden="true" />
      <div className="container about-container">
        {/* Header row */}
        <div className="about-header">
          <div className="about-eyebrow reveal" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="about-eyebrow-line" aria-hidden="true" />
            <span className="about-eyebrow-text">About the designer</span>
          </div>

          <div className="about-headline-row">
            <h2 id="about-heading" className="about-headline reveal" style={{ '--d': '70ms' } as React.CSSProperties}>
              <span className="hl-line">Building identities</span>
              <span className="hl-line serif italic">that are made</span>
              <span className="hl-line">to be remembered.</span>
            </h2>

            <div className="about-stat reveal" style={{ '--d': '140ms' } as React.CSSProperties} aria-label="10 plus projects completed">
              <div className="stat-number">
                <span className="stat-num">10+</span>
                <span className="stat-label">Projects</span>
              </div>
              <p className="stat-desc">Complete identities delivered — from concept to final system.</p>
            </div>
          </div>

          <div className="about-intro-grid">
            <p className="about-intro reveal" style={{ '--d': '190ms' } as React.CSSProperties}>
              I’m <strong>Ramy Said Eid</strong>, a logo and visual identity designer. I craft complete brand
              systems that are clear, distinctive and built to last — balancing strategy with precise visual execution
              across every touchpoint.
            </p>

            <aside className="about-note reveal" style={{ '--d': '250ms' } as React.CSSProperties}>
              <span className="note-k">Selected distinction</span>
              <p className="note-v">
                Among the 10+ identities crafted, one project was developed in the context of a competition
                organized by the <em>Ministry of Finance</em> — reflecting the ability to work within formal,
                institutional frameworks while keeping the identity contemporary.
              </p>
            </aside>
          </div>
        </div>

        {/* Capabilities */}
        <div className="about-caps-wrap">
          <div className="caps-head reveal" style={{ '--d': '120ms' } as React.CSSProperties}>
            <h3 className="caps-title">Capabilities</h3>
            <span className="caps-sub">A complete visual identity — end to end.</span>
          </div>

          <ul className="caps-grid" role="list">
            {caps.map((c, i) => (
              <li
                key={c.title}
                className="cap-item reveal"
                style={{ '--d': `${160 + i * 55}ms` } as React.CSSProperties}
              >
                <span className="cap-n" aria-hidden="true">{c.n}</span>
                <h4 className="cap-title">{c.title}</h4>
                <p className="cap-desc">{c.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
