import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Building2, FileText, ShoppingCart, CheckCircle,
  BarChart3, ChevronLeft, ChevronRight, LogOut, Menu, X, User, Shield
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-violet-500 to-purple-600', roles: ['ROLE_EMPLOYEE', 'ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
  { to: '/vendors', icon: Building2, label: 'Vendors', color: 'from-blue-500 to-cyan-500', roles: ['ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
  { to: '/requisitions', icon: FileText, label: 'Requisitions', color: 'from-amber-500 to-orange-500', roles: ['ROLE_EMPLOYEE', 'ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
  { to: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders', color: 'from-emerald-500 to-teal-500', roles: ['ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
  { to: '/approvals', icon: CheckCircle, label: 'Approvals', color: 'from-rose-500 to-pink-500', roles: ['ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', color: 'from-indigo-500 to-violet-500', roles: ['ROLE_PROCUREMENT_MANAGER', 'ROLE_ADMIN'] },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const auth = useAuth();
  const { logout, username, roles: userRoles } = auth;
  const navigate = useNavigate();

  // Filter nav items by current user's roles
  const visibleNavItems = navItems.filter(item =>
    item.roles.some(r => (userRoles || []).includes(r))
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%) 0%, hsl(265,85%,60%) 100%)', boxShadow: '0 4px 15px hsla(252,87%,67%,0.4)' }}
        >
          <ShoppingCart className="w-5 h-5 text-white" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <span className="text-sm font-bold whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #fff 0%, hsl(252,87%,80%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Procurement Manager
              </span>
              <p className="text-[10px] whitespace-nowrap" style={{ color: 'hsl(215,20%,45%)' }}>Vendor Management System</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${isActive ? `bg-gradient-to-br ${color}` : 'bg-white/5'}`}
                  style={isActive ? { boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } : {}}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

        {/* Admin Link */}
        {useAuth().isAdmin() && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${isActive ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' : 'bg-white/5'}`}
                  style={isActive ? { boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } : {}}>
                  <Shield className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      Admin Panel
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="sidebar-link cursor-default">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
            <User className="w-4 h-4" />
          </div>
          {!collapsed && <span className="text-xs truncate opacity-70">{username}</span>}
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={handleLogout}
          className="sidebar-link w-full"
          style={{ color: 'hsl(0,84%,65%)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/10">
            <LogOut className="w-4 h-4" />
          </div>
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col relative shrink-0"
        style={{
          background: 'linear-gradient(180deg, hsl(220,35%,9%) 0%, hsl(222,40%,7%) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {sidebarContent}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-8 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%) 0%, hsl(265,85%,60%) 100%)', boxShadow: '0 4px 12px hsla(252,87%,67%,0.4)' }}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white" /> : <ChevronLeft className="w-3.5 h-3.5 text-white" />}
        </motion.button>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-[256px] z-50 lg:hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(220,35%,9%) 0%, hsl(222,40%,7%) 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'hsl(220,35%,9%)' }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}>
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><X className="w-5 h-5" /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><Menu className="w-5 h-5" /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
          <span className="font-bold text-sm" style={{ background: 'linear-gradient(135deg, #fff, hsl(252,87%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Procurement</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
