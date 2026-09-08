import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import AdminLogin from './admin/AdminLogin'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminLayout from './admin/AdminLayout'
import SiteSettingsForm from './admin/SiteSettingsForm'
import SectionsManager from './admin/SectionsManager'
import SectionEditor from './admin/SectionEditor'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SiteSettingsForm />} />
            <Route path="sections" element={<SectionsManager />} />
            <Route path="sections/:id" element={<SectionEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
