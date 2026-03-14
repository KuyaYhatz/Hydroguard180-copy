import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Logo } from './Logo';
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AlertSystem } from './AlertSystem';
import { useAuth } from '../context/AuthContext';
import { ScrollManager } from './ScrollManager';
import { ConfirmModal } from './ConfirmModal';

export function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
    { path: '/training', label: 'Training' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-100 text-red-700';
      case 'Admin': return 'bg-blue-100 text-blue-700';
      case 'Staff': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollManager />
      <AlertSystem />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="font-semibold text-[#26343A]">Hydro Guard 180</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition-colors ${
                    isActive(item.path)
                      ? 'text-[#FF6A00] font-medium'
                      : 'text-[#1F2937] hover:text-[#FF6A00]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="relative ml-4" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#E55F00] flex items-center justify-center text-xs font-semibold text-white shadow-sm">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.fullName}</span>
                    <ChevronDown size={14} className={`transition-transform text-gray-500 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 bg-[#FF6A00] text-white rounded-md text-sm hover:bg-[#E55F00] transition-colors"
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#26343A]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm ${
                    isActive(item.path)
                      ? 'text-[#FF6A00] font-medium bg-orange-50'
                      : 'text-[#1F2937]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="mt-4 mx-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#FF6A00] flex items-center justify-center text-white text-sm font-medium">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#26343A] hover:bg-gray-50 rounded-md"
                  >
                    <LayoutDashboard size={16} />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-4 mt-4 px-4 py-2 bg-[#FF6A00] text-white rounded-md text-sm text-center"
                >
                  Login
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#26343A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <span className="font-semibold">Hydro Guard 180</span>
              </div>
              <p className="text-gray-400 text-sm">
                Flood monitoring and emergency response system for Barangay 180, Caloocan City.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Barangay 180</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/training" className="hover:text-white transition-colors">Emergency Training</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Barangay Hall: (02) 8123-4567</li>
                <li>Emergency Hotline: 911</li>
                <li>Caloocan DRRMO: (02) 8288-8150</li>
                <li>NDRRMC: 911-1406</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Hydro Guard 180. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={executeLogout}
        title="Logout"
        description="Are you sure you want to log out? You will need to sign in again to access the dashboard."
        confirmLabel="Logout"
        variant="logout"
      />
    </div>
  );
}
