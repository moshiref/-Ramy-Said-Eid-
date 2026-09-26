import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* Ambient gradients */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="ambient a1" />
        <div className="ambient a2" />
        <div className="ambient a3" />
      </div>

      {/* Ghost typography */}
      <div className="hero-ghost" aria-hidden="true">
        <span className="ghost-line">BRAND</span>
        <span className="ghost-line outline">IDENTITY</span>
      </div>

      {/* Fine grid */}
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-container container">
        {/* Left content */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="t-line"><span className="t-inner">Designing</span></span>
            <span className="t-line"><span className="t-inner serif">identities</span> <span className="t-inner serif italic">that</span></span>
            <span className="t-line"><span className="t-inner serif italic">make brands</span></span>
            <span className="t-line"><span className="t-inner">memorable.</span></span>
          </h1>

          <p className="hero-desc">
            I’m <strong>Ramy Said Eid</strong> — a logo &amp; visual identity designer crafting
            distinctive brand systems for ambitious companies. Strategy, symbol, and
            system — designed to endure.
          </p>

          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">
              <span>View selected work</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="#about" className="btn btn-ghost">
              About the studio
            </a>
          </div>
        </div>

        {/* Right visual - Portrait stage */}
        <div className="hero-visual">
          {/* Depth layers behind portrait */}
          <div className="portrait-stage">
            {/* Pulse rings */}
            <div className="pulse-wrap" aria-hidden="true">
              <span className="pulse p1" />
              <span className="pulse p2" />
              <span className="pulse p3" />
              <span className="pulse-core" />
            </div>

            {/* Layered cards for depth */}
            <div className="layer l-back" aria-hidden="true" />
            <div className="layer l-mid" aria-hidden="true" />
            <div className="layer l-front">
              {/* subtle inner vignette */}
              <div className="portrait-frame">
                <picture>
                  <source
                    srcSet="/img/portrait-sm.webp 640w, /img/portrait.webp 1000w"
                    sizes="(max-width: 860px) 92vw, 560px"
                    type="image/webp"
                  />
                  <img
                    src="/img/portrait.png"
                    alt="Portrait of Ramy Said Eid — Logo and Visual Identity Designer"
                    width={1178}
                    height={1335}
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
                {/* soft ground shadow under feet */}
                <div className="ground-shadow" aria-hidden="true" />
              </div>

              {/* Floating labels */}
              <div className="float-card fc-2" aria-hidden="true">
                <span className="fc-dot" />
                <span className="fc-value">Visual System • Since 2021</span>
              </div>
            </div>

            {/* Light reflection */}
            <div className="portrait-highlight" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Decorative rule */}
      <div className="hero-rule" aria-hidden="true" />
    </section>
  )
}
