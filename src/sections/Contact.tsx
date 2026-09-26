import { useEffect, useRef } from 'react'
import './Contact.css'

const FACEBOOK_URL = 'https://www.facebook.com/share/1K6CDb4SGp/'
const WHATSAPP_URL = 'https://wa.me/201119812996'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

export default function Contact() {
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
    <section id="contact" className="contact" ref={sectionRef} aria-labelledby="contact-heading">
      <div className="container contact-container">
        <div className="contact-eyebrow reveal" style={{ '--d': '0ms' } as React.CSSProperties}>
          <span className="contact-eyebrow-line" aria-hidden="true" />
          <span className="contact-eyebrow-text">Contact</span>
        </div>

        <div className="contact-head-row">
          <h2 id="contact-heading" className="contact-headline reveal" style={{ '--d': '70ms' } as React.CSSProperties}>
            <span className="hl-line">Let&rsquo;s build an identity</span>
            <span className="hl-line serif italic">worth remembering.</span>
          </h2>
          <p className="contact-intro reveal" style={{ '--d': '140ms' } as React.CSSProperties}>
            Have a project in mind? Reach out directly — I&rsquo;d love to hear about your brand.
          </p>
        </div>

        <div className="contact-grid">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card reveal"
            style={{ '--d': '180ms' } as React.CSSProperties}
            aria-label="Contact via Facebook (opens in a new tab)"
          >
            <span className="contact-icon is-facebook" aria-hidden="true">
              <FacebookIcon />
            </span>
            <span className="contact-card-text">
              <span className="contact-card-name">Facebook</span>
              <span className="contact-card-sub">Follow &amp; send a message</span>
            </span>
            <span className="contact-card-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card reveal"
            style={{ '--d': '240ms' } as React.CSSProperties}
            aria-label="Chat on WhatsApp at +20 11 198 12996 (opens in a new tab)"
          >
            <span className="contact-icon is-whatsapp" aria-hidden="true">
              <WhatsAppIcon />
            </span>
            <span className="contact-card-text">
              <span className="contact-card-name">WhatsApp</span>
              <span className="contact-card-sub" dir="ltr">+20 11 198 12996</span>
            </span>
            <span className="contact-card-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
