import React, { useState } from 'react';
import { UserProfile, NotificationItem } from '@/types/helpdesk';
import { NotificationPopover } from '@/components/employee/Notifications/NotificationPopover';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  ShieldCheck,
  LayoutDashboard,
  Ticket as TicketIcon,
  Users,
  Building,
  Layers,
  Clock,
  BarChart3,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  user: UserProfile;
  activeNav:
    | 'dashboard'
    | 'tickets'
    | 'users'
    | 'departments'
    | 'categories'
    | 'sla'
    | 'reports'
    | 'notifications'
    | 'profile';
  breadcrumbTitle?: string;
  onNavigate: (
    tab:
      | 'dashboard'
      | 'tickets'
      | 'users'
      | 'departments'
      | 'categories'
      | 'sla'
      | 'reports'
      | 'notifications'
      | 'profile'
  ) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeNav,
  breadcrumbTitle,
  onNavigate,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onSelectNotification,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'tickets', label: 'Manajemen Tiket (All)', icon: TicketIcon },
    { id: 'users', label: 'Manajemen User & Role', icon: Users },
    { id: 'departments', label: 'Master Departemen', icon: Building },
    { id: 'categories', label: 'Kategori & Subkategori', icon: Layers },
    { id: 'sla', label: 'Kebijakan SLA (Policy)', icon: Clock },
    { id: 'reports', label: 'Laporan & Analytics', icon: BarChart3 },
    {
      id: 'notifications',
      label: 'Pusat Notifikasi',
      icon: Bell,
      badgeCount: unreadNotifCount,
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    },
    { id: 'profile', label: 'Profil Administrator', icon: User },
  ] as const;

  const handleNavClick = (id: typeof navItems[number]['id']) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const getBreadcrumbTitle = () => {
    if (breadcrumbTitle) return breadcrumbTitle;
    switch (activeNav) {
      case 'dashboard':
        return 'System & Operations Overview';
      case 'tickets':
        return 'Manajemen Seluruh Tiket';
      case 'users':
        return 'Manajemen Akun & Otoritas';
      case 'departments':
        return 'Master Struktur Departemen';
      case 'categories':
        return 'Taksonomi Kategori & Subkategori';
      case 'sla':
        return 'Konfigurasi Kebijakan SLA';
      case 'reports':
        return 'Laporan Kinerja & CSAT';
      case 'notifications':
        return 'Pusat Notifikasi';
      case 'profile':
        return 'Profil Administrator';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-purple-600 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-xl shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Plis<span className="text-purple-400">Help</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-400">
                IT Admin Console
              </div>
            </div>
          </div>

          {/* Department Unit Tag */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-3">
            <div className="text-[11px] font-medium text-zinc-400">Otoritas Sistem</div>
            <div className="text-xs font-bold text-zinc-200 mt-0.5">{user.department}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-purple-400">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
              <span>Super Administrator</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Menu Pengelolaan
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-purple-400' : 'text-zinc-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {'badgeCount' in item && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-850/40 p-2.5 border border-zinc-800/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 text-purple-300 font-bold text-xs border border-purple-500/20">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-200 truncate">{user.name}</div>
              <div className="text-[11px] text-zinc-500 truncate">{user.email}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-rose-950/30 hover:border-rose-800/50 hover:text-rose-300 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  Plis<span className="text-purple-400">Help</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  IT Admin Console
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-md'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {'badgeCount' in item && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-850 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300 font-bold text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-200 truncate">{user.name}</div>
              <div className="text-[11px] text-zinc-400 truncate">{user.department}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsLogoutConfirmOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-medium text-rose-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 sm:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span className="text-purple-400">Admin Console</span>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-zinc-100 font-semibold">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationPopover(!showNotificationPopover)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                  showNotificationPopover
                    ? 'bg-purple-600/15 border-purple-500/40 text-purple-400'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <NotificationPopover
                isOpen={showNotificationPopover}
                onClose={() => setShowNotificationPopover(false)}
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onSelectNotification={(notif) => {
                  setShowNotificationPopover(false);
                  onSelectNotification(notif);
                }}
              />
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Full System Authority</span>
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Keluar (Logout)"
        description={
          <div>
            <p>Apakah Anda yakin ingin keluar dari sesi Admin <strong>{user.name}</strong>?</p>
            <p className="mt-2 text-zinc-400 text-xs">Pastikan Anda telah menyimpan seluruh konfigurasi sistem yang sedang diubah.</p>
          </div>
        }
        confirmText="Ya, Keluar Akun"
        cancelText="Batal"
        variant="danger"
        icon={<LogOut className="h-6 w-6 text-rose-400" />}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          onLogout();
        }}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
};
