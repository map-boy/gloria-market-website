import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { isFirebaseConfigured } from './lib/firebase'
import { ToastProvider } from './admin/Toast'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminApp from './admin/AdminApp'
import Home from './pages/Home'
import SetupNotice from './pages/SetupNotice'

export default function App() {
  if (!isFirebaseConfigured) return <SetupNotice />

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminApp />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
