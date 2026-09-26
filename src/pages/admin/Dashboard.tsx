import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProjectsAdmin } from '../../services/projects'

export default function Dashboard() {
  const [count, setCount] = useState<number | null>(null)
  const [published, setPublished] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<number | null>(null)

  useEffect(() => {
    fetchAllProjectsAdmin()
      .then(d => {
        setCount(d.length)
        setPublished(d.filter(p => p.published).length)
        setDrafts(d.filter(p => !p.published).length)
      })
      .catch(() => { setCount(0); setPublished(0); setDrafts(0) })
  }, [])

  const cards = [
    { label: 'إجمالي المشاريع', value: count, cls: '' },
    { label: 'مشاريع منشورة', value: published, cls: 'ok' },
    { label: 'مسودات', value: drafts, cls: 'warn' },
  ]

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">لوحة التحكم</h1>
          <p className="admin-page-sub">نظرة سريعة على مشاريعك وإدارتها من مكان واحد.</p>
        </div>
        <Link to="/admin/projects/new" className="admin-btn primary">+ مشروع جديد</Link>
      </div>

      <div className="admin-stats">
        {cards.map(c => (
          <div key={c.label} className={`admin-stat ${c.cls}`}>
            <span className="admin-stat-label">{c.label}</span>
            <span className="admin-stat-value">{c.value ?? '…'}</span>
          </div>
        ))}
      </div>

      <div className="admin-quick">
        <Link to="/admin/projects" className="admin-btn">إدارة المشاريع</Link>
        <Link to="/admin/projects/new" className="admin-btn primary">+ مشروع جديد</Link>
      </div>
    </div>
  )
}
