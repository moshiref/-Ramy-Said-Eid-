import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Admin.css'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError('بيانات الدخول غير صحيحة، تحقق من البريد وكلمة المرور وحاول مجددًا.')
    else nav('/admin', { replace: true })
  }

  return (
    <div className="admin-auth" dir="rtl" lang="ar">
      <div className="admin-auth-card">
        <div className="admin-auth-logo" aria-hidden="true">ر</div>
        <h1 className="admin-auth-title">تسجيل الدخول</h1>
        <p className="admin-auth-sub">مرحبًا بعودتك — سجّل الدخول لإدارة مشاريعك.</p>
        <form onSubmit={onSubmit} className="admin-form">
          <label className="admin-label">البريد الإلكتروني
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="admin-input" autoComplete="email" placeholder="name@email.com" inputMode="email" />
          </label>
          <label className="admin-label">كلمة المرور
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="admin-input" autoComplete="current-password" placeholder="••••••••" />
          </label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn primary admin-submit">
            {loading ? 'جارٍ تسجيل الدخول…' : 'دخول لوحة التحكم'}
          </button>
        </form>
        <p className="admin-hint">يتم إنشاء حساب المدير من Supabase ← Authentication ← Users</p>
      </div>
    </div>
  )
}
