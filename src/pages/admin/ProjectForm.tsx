import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addProjectImage, createProject, deleteProjectImage, deleteStorageByUrl, fetchProjectById, slugify, updateProject, uploadImage } from '../../services/projects'
import type { ProjectImage } from '../../types/project'

type Mode = 'new' | 'edit'

export default function ProjectForm({ mode }: { mode: Mode }) {
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState<string>('')
  const [published, setPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState('0')

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [existingCover, setExistingCover] = useState<string | null>(null)

  const [existingImages, setExistingImages] = useState<ProjectImage[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  // الرابط (slug) يُولَّد تلقائيًا من العنوان — hidden field removed
  useEffect(() => {
    if (mode === 'new' && title) setSlug(slugify(title))
  }, [title, mode])

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchProjectById(id).then(data => {
        setTitle(data.title); setSlug(data.slug); setCategory(data.category ?? ''); setShortDesc(data.short_description ?? ''); setDescription(data.description ?? ''); setYear(data.year?.toString() ?? ''); setPublished(data.published); setSortOrder(String(data.sort_order)); setExistingCover(data.cover_image); setExistingImages(data.project_images ?? []); setLoading(false)
      }).catch(e => { setError((e as Error).message); setLoading(false) })
    }
  }, [mode, id])

  function onCoverChange(file: File | null) {
    setCoverFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverPreview(url)
    } else setCoverPreview(null)
  }
  function onNewFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files)
    setNewFiles(prev => [...prev, ...arr])
    const urls = arr.map(f => URL.createObjectURL(f))
    setNewPreviews(prev => [...prev, ...urls])
  }
  function removeNewAt(idx: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== idx))
    setNewPreviews(prev => {
      URL.revokeObjectURL(prev[idx])
      return prev.filter((_, i) => i !== idx)
    })
  }
  async function removeExistingImage(img: ProjectImage) {
    if (!confirm('حذف هذه الصورة؟')) return
    try {
      await deleteStorageByUrl(img.image_url)
      await deleteProjectImage(img.id)
      setExistingImages(prev => prev.filter(x => x.id !== img.id))
    } catch (e) { alert((e as Error).message) }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) return setError('عنوان المشروع مطلوب')
    // الرابط يُولَّد تلقائيًا من العنوان (وضع جديد) أو يُحافَظ عليه (وضع التعديل)
    let finalSlug = mode === 'new'
      ? (slugify(title) || `project-${Date.now().toString(36)}`)
      : (slug || slugify(title) || `project-${Date.now().toString(36)}`)
    setSaving(true)
    try {
      let coverUrl = existingCover
      if (coverFile) {
        coverUrl = await uploadImage(coverFile, finalSlug)
      }
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category: category.trim() || null,
        short_description: shortDesc.trim() || null,
        description: description.trim() || null,
        year: year ? parseInt(year, 10) : null,
        cover_image: coverUrl,
        published,
        sort_order: parseInt(sortOrder, 10) || 0,
      } as any

      let projectId = id
      if (mode === 'new') {
        try {
          const created = await createProject(payload)
          projectId = created.id
        } catch (err) {
          // slug مكرر (unique) — إعادة المحاولة بلاحقة مميزة
          const msg = (err as Error).message ?? ''
          if (msg.includes('duplicate') || (err as { code?: string }).code === '23505') {
            finalSlug = `${finalSlug}-${Date.now().toString(36)}`
            const created = await createProject({ ...payload, slug: finalSlug })
            projectId = created.id
          } else throw err
        }
      } else if (id) {
        await updateProject(id, payload)
      }

      // upload new gallery images
      for (let i = 0; i < newFiles.length; i++) {
        const url = await uploadImage(newFiles[i], finalSlug)
        await addProjectImage(projectId!, url, null, existingImages.length + i)
      }

      nav('/admin/projects')
    } catch (err) {
      setError((err as Error).message)
    } finally { setSaving(false) }
  }

  if (loading) return <p className="admin-loading-text">جارٍ تحميل بيانات المشروع…</p>

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{mode === 'new' ? 'مشروع جديد' : 'تعديل المشروع'}</h1>
          <p className="admin-page-sub">{mode === 'new' ? 'أضف مشروعًا جديدًا واعرضه في موقعك.' : 'عدّل بيانات المشروع وصوره.'}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="admin-form-grid">
        <label className="admin-label">عنوان المشروع *
          <input className="admin-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="مثال: هوية مقهى دال" />
        </label>
        <div className="admin-form-row">
          <label className="admin-label">التصنيف
            <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="تصميم شعار، هوية بصرية..." />
          </label>
          <label className="admin-label">السنة
            <input className="admin-input" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2024" inputMode="numeric" />
          </label>
        </div>
        <label className="admin-label">وصف مختصر
          <input className="admin-input" value={shortDesc} onChange={e => setShortDesc(e.target.value)} maxLength={160} placeholder="سطر واحد يظهر في بطاقة المشروع" />
        </label>
        <label className="admin-label">الوصف الكامل
          <textarea className="admin-input admin-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="احكِ قصة المشروع، الفكرة، الألوان، النتيجة..." />
        </label>
        <div className="admin-form-row">
          <label className="admin-label">ترتيب العرض
            <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} inputMode="numeric" />
          </label>
          <div className="admin-checks">
            <label className="admin-check"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> منشور</label>
          </div>
        </div>

        <label className="admin-label">صورة الغلاف
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e => onCoverChange(e.target.files?.[0] ?? null)} className="admin-file" />
        </label>
        {(coverPreview || existingCover) && (
          <div className="admin-preview">
            <img src={coverPreview ?? existingCover ?? ''} alt="معاينة الغلاف" />
          </div>
        )}

        <label className="admin-label">صور إضافية <span className="admin-label-hint">(JPG / PNG / WEBP — بحد أقصى 8MB للصورة)</span>
          <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={e => onNewFiles(e.target.files)} className="admin-file" />
        </label>
        {existingImages.length > 0 && (
          <div>
            <p className="admin-mini-title">الصور الحالية — اضغط × للحذف</p>
            <div className="admin-preview">
              {existingImages.map(img => (
                <div key={img.id} className="admin-preview-item">
                  <img src={img.image_url} alt={img.alt_text ?? ''} loading="lazy" />
                  <button type="button" className="admin-preview-remove" onClick={() => removeExistingImage(img)} aria-label="حذف الصورة">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {newPreviews.length > 0 && (
          <div className="admin-preview">
            {newPreviews.map((url, i) => (
              <div key={url} className="admin-preview-item">
                <img src={url} alt={`صورة جديدة ${i + 1}`} />
                <button type="button" className="admin-preview-remove" onClick={() => removeNewAt(i)} aria-label="إزالة الصورة">×</button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" disabled={saving} className="admin-btn primary">{saving ? 'جارٍ الحفظ…' : 'حفظ المشروع'}</button>
          <button type="button" onClick={() => nav('/admin/projects')} className="admin-btn">إلغاء</button>
        </div>
      </form>
    </div>
  )
}
