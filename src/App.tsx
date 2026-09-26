import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import AdminGuard from './components/admin/AdminGuard'

// Admin pages load on demand so the public site stays light
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ProjectsList = lazy(() => import('./pages/admin/ProjectsList'))
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'))

function AdminFallback() {
  return <div className="admin-loading" dir="rtl">جارٍ تحميل لوحة التحكم…</div>
}

export default function App() {
  return (
    <>
      <a href="#home" className="skip">Skip to content</a>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <>
              <Navbar />
              <main>
                <ProjectDetail />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            </AdminGuard>
          }
        >
          <Route index element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
          <Route path="projects" element={<Suspense fallback={<AdminFallback />}><ProjectsList /></Suspense>} />
          <Route path="projects/new" element={<Suspense fallback={<AdminFallback />}><ProjectForm mode="new" /></Suspense>} />
          <Route path="projects/:id/edit" element={<Suspense fallback={<AdminFallback />}><ProjectForm mode="edit" /></Suspense>} />
        </Route>
      </Routes>
    </>
  )
}
