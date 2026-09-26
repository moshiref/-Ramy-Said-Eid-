import './Footer.css'

const WHATSAPP_URL = 'https://wa.me/201274776417'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-bottom">
          <p className="footer-copy">© {year} Ramy Said Eid — All rights reserved.</p>
          <p className="footer-credit">
            Designed &amp; built by{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-name"
              aria-label="Chat with Mohamed Sherif on WhatsApp (opens in a new tab)"
            >
              MOHAMED SHERIF
            </a>
          </p>
          <a href="#home" className="footer-top-btn" aria-label="Back to top">
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
