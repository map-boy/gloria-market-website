import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { isFirebaseConfigured } from './lib/firebase'
import { ToastProvider } from './admin/Toast'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminApp from './admin/AdminApp'
import ShopLayout from './components/ShopLayout'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import SetupNotice from './pages/SetupNotice'
import NotFound from './pages/NotFound'

export default function App() {
  if (!isFirebaseConfigured) return <SetupNotice />

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ShopLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminApp />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
