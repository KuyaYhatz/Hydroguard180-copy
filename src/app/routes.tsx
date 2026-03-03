import { createBrowserRouter, Navigate } from 'react-router';
import { PublicLayout } from './components/PublicLayout';
import { DashboardLayout } from './components/DashboardLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Training } from './pages/Training';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { UserManagement } from './pages/dashboard/UserManagement';
import { ResidentDirectory } from './pages/dashboard/ResidentDirectory';
import { WaterMonitoring } from './pages/dashboard/WaterMonitoring';
import { AlertLevels } from './pages/dashboard/AlertLevels';
import { Analytics } from './pages/dashboard/Analytics';
import { Settings } from './pages/dashboard/Settings';
import { FAQManagement } from './pages/dashboard/FAQManagement';
import { Inquiries } from './pages/dashboard/Inquiries';
import { useAuth, type UserRole } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router';

// Root layout that provides AuthContext to entire app
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Protected Route - requires authentication
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Redirect away from login if already authenticated
function LoginGuard() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: PublicLayout,
        children: [
          { index: true, Component: Home },
          { path: 'about', Component: About },
          { path: 'faq', Component: FAQ },
          { path: 'training', Component: Training },
          { path: 'contact', Component: Contact },
        ],
      },
      {
        path: '/login',
        Component: LoginGuard,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Analytics },
          { path: 'monitoring', Component: WaterMonitoring },
          { path: 'residents', Component: ResidentDirectory },
          { path: 'faq-management', Component: FAQManagement },
          { path: 'alerts', Component: AlertLevels },
          {
            path: 'settings',
            element: (
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <Settings />
              </ProtectedRoute>
            ),
          },
          { path: 'inquiries', Component: Inquiries },
          {
            path: 'users',
            element: (
              <ProtectedRoute allowedRoles={['Super Admin', 'Admin']}>
                <UserManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <a href="/" className="px-6 py-3 bg-[#FF6A00] text-white rounded-md hover:bg-[#E55F00] transition-colors">
                Go Home
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]);