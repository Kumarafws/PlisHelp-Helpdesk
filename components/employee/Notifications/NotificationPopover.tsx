import React from 'react';
import { NotificationItem } from '@/types/helpdesk';
import {
  Bell,
  CheckCheck,
  Clock,
  HelpCircle,
  CheckCircle2,
  MessageSquare,
  UserCheck,
  X,
  ArrowRight,
} from 'lucide-react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notification: NotificationItem) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'action_required':
        return <HelpCircle className="h-4 w-4 text-orange-400" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'assigned':
        return <UserCheck className="h-4 w-4 text-indigo-400" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-400" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diffSec < 60) return 'Baru saja';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit yang lalu`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam yang lalu`;
      return `${Math.floor(diffSec / 86400)} hari yang lalu`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/30">
              {unreadCount} baru
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Tandai dibaca</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-zinc-800/80 p-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            Tidak ada notifikasi baru untuk Anda
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkAsRead(notif.id);
                onSelectNotification(notif);
              }}
              className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                !notif.isRead
                  ? 'bg-blue-950/20 border-l-2 border-l-blue-500 hover:bg-blue-950/30'
                  : 'hover:bg-zinc-800/50 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/60 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>

                {notif.ticketNumber && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-blue-400">{notif.ticketNumber}</span>
                    <span className="text-zinc-400 inline-flex items-center gap-0.5 group-hover:text-blue-300">
                      Buka Tiket <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
