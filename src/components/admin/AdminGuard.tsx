import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading" dir="rtl">جارٍ التحقق من الجلسة…</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
