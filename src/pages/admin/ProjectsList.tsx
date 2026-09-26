import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProject, deleteStorageByUrl, fetchAllProjectsAdmin, togglePublished } from '../../services/projects'
import type { Project } from '../../types/project'

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    try {
      const data = await fetchAllProjectsAdmin()
      setProjects(data)
    } catch (e) { setError((e as Error).message) }
  }
  useEffect(() => { load() }, [])

  async function onDelete(p: Project) {
    if (!confirm(`حذف "${p.title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return
    try {
      setBusyId(p.id)
      if (p.cover_image) await deleteStorageByUrl(p.cover_image)
      await deleteProject(p.id)
      setProjects(prev => prev ? prev.filter(x=>x.id!==p.id) : prev)
    } catch (e) { alert((e as Error).message) }
    finally { setBusyId(null) }
  }

  async function onTogglePub(p: Project) {
    setBusyId(p.id)
    try { await togglePublished(p.id, p.published); await load() }
    catch (e) { alert((e as Error).message) }
    finally { setBusyId(null) }
  }

  if (error) return <p className="admin-error">{error}</p>
  if (!projects) return <p className="admin-loading-text">جارٍ تحميل المشاريع…</p>

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title" style={{ margin: 0 }}>المشاريع</h1>
          <p className="admin-page-sub">{projects.length === 0 ? 'لم تُضف أي مشروع بعد.' : `لديك ${projects.length} ${projects.length === 1 ? 'مشروع' : 'مشاريع'}`}</p>
        </div>
        <Link to="/admin/projects/new" className="admin-btn primary">+ مشروع جديد</Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-ico" aria-hidden="true">▦</div>
          <p>لا توجد مشاريع بعد. أنشئ مشروعك الأول واعرضه في موقعك.</p>
          <Link to="/admin/projects/new" className="admin-btn primary">+ إنشاء أول مشروع</Link>
        </div>
      ) : (
        <>
          {/* جدول الشاشات الكبيرة */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>الغلاف</th><th>العنوان</th><th>التصنيف</th><th>السنة</th><th>الحالة</th><th>الترتيب</th><th>إجراءات</th></tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>{p.cover_image ? <img src={p.cover_image} alt="" loading="lazy" /> : <span className="admin-no-cover">—</span>}</td>
                    <td className="admin-cell-title">{p.title}<br /><span className="admin-cell-slug">{p.slug}</span></td>
                    <td>{p.category ?? '—'}</td>
                    <td>{p.year ?? '—'}</td>
                    <td>
                      <span className={`admin-badge ${p.published ? 'published' : 'draft'}`}>{p.published ? 'منشور' : 'مسودة'}</span>
                    </td>
                    <td>{p.sort_order}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/projects/${p.id}/edit`} className="admin-btn small">تعديل</Link>
                        <button onClick={() => onTogglePub(p)} disabled={busyId === p.id} className="admin-btn small">{p.published ? 'إخفاء' : 'نشر'}</button>
                        <button onClick={() => onDelete(p)} disabled={busyId === p.id} className="admin-btn small danger">حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* بطاقات الموبايل / التابلت */}
          <div className="admin-cards">
            {projects.map(p => (
              <article key={p.id} className="admin-card">
                <div className="admin-card-top">
                  {p.cover_image
                    ? <img src={p.cover_image} alt="" loading="lazy" className="admin-card-cover" />
                    : <div className="admin-card-cover admin-card-cover-empty" aria-hidden="true">▦</div>}
                  <div className="admin-card-info">
                    <h3>{p.title}</h3>
                    <span className="admin-cell-slug">{p.slug}</span>
                    <div className="admin-card-meta">
                      <span>{p.category ?? 'بدون تصنيف'}</span>
                      <span>•</span>
                      <span>{p.year ?? '—'}</span>
                    </div>
                    <div className="admin-card-badges">
                      <span className={`admin-badge ${p.published ? 'published' : 'draft'}`}>{p.published ? 'منشور' : 'مسودة'}</span>
                    </div>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <Link to={`/admin/projects/${p.id}/edit`} className="admin-btn small">تعديل</Link>
                  <button onClick={() => onTogglePub(p)} disabled={busyId === p.id} className="admin-btn small">{p.published ? 'إخفاء' : 'نشر'}</button>
                  <button onClick={() => onDelete(p)} disabled={busyId === p.id} className="admin-btn small danger">حذف</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
