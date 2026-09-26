import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Admin.css'

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const nav = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function logout() {
    await signOut()
    nav('/admin/login')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="admin-layout" dir="rtl" lang="ar">
      <header className="admin-topbar">
        <div className="admin-topbar-right">
          <button
            type="button"
            className="admin-menu-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
          >
            <span className={`admin-menu-icon ${menuOpen ? 'open' : ''}`} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <Link to="/admin" className="admin-brand" onClick={closeMenu}>
            <span className="admin-brand-mark">ر</span>
            <span className="admin-brand-text">رامي سعيد عيد <em>لوحة التحكم</em></span>
          </Link>
        </div>
        <div className="admin-top-actions">
          <span className="admin-user" title={user?.email}>{user?.email}</span>
          <Link to="/" className="admin-link">عرض الموقع</Link>
          <button onClick={logout} className="admin-btn small">تسجيل الخروج</button>
        </div>
      </header>

      <div className="admin-main">
        {/* خلفية معتمة للموبايل عند فتح القائمة */}
        <div
          className={`admin-sidenav-backdrop ${menuOpen ? 'show' : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />
        <nav className={`admin-sidenav ${menuOpen ? 'open' : ''}`} aria-label="لوحة التحكم">
          <NavLink to="/admin" end onClick={closeMenu} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            <span className="admin-nav-ico" aria-hidden="true">◈</span> الرئيسية
          </NavLink>
          <NavLink to="/admin/projects" onClick={closeMenu} className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            <span className="admin-nav-ico" aria-hidden="true">▦</span> المشاريع
          </NavLink>
          <Link to="/admin/projects/new" onClick={closeMenu} className="admin-btn small primary admin-new-btn">+ مشروع جديد</Link>
          <div className="admin-sidenav-foot">
            <Link to="/" className="admin-link" onClick={closeMenu}>عرض الموقع ←</Link>
          </div>
        </nav>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {/* شريط سفلي سريع للموبايل */}
      <nav className="admin-bottombar" aria-label="تنقل سريع">
        <NavLink to="/admin" end className={({ isActive }) => `admin-bottom-link${isActive ? ' active' : ''}`}>
          <span aria-hidden="true">◈</span>الرئيسية
        </NavLink>
        <NavLink to="/admin/projects" className={({ isActive }) => `admin-bottom-link${isActive ? ' active' : ''}`}>
          <span aria-hidden="true">▦</span>المشاريع
        </NavLink>
        <Link to="/admin/projects/new" className="admin-bottom-link admin-bottom-add" aria-label="مشروع جديد">
          <span aria-hidden="true">+</span>جديد
        </Link>
      </nav>
    </div>
  )
}
