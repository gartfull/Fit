import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Users, Settings, LogOut, Menu, Dumbbell, MessageSquare, Bell, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Layout = () => {
  const { role, logout, notifications, markNotificationRead, currentClientId, clients, trainerProfile } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = role === 'trainer' 
    ? [
        { name: 'Дашборд', path: '/app', icon: Activity },
        { name: 'Клиенты', path: '/app/clients', icon: Users },
        { name: 'База блюд', path: '/app/meals', icon: Settings },
        { name: 'Упражнения', path: '/app/exercises', icon: Dumbbell },
        { name: 'Конструктор анкет', path: '/app/forms', icon: Settings },
        { name: 'Профиль', path: '/app/profile', icon: User },
      ]
    : [
        { name: 'Мой прогресс', path: '/app', icon: Activity },
        { name: 'План питания', path: '/app/menu', icon: Users },
        { name: 'Тренировки', path: '/app/workouts', icon: Dumbbell },
        { name: 'Заполнить форму', path: '/app/log', icon: Settings },
        { name: 'Чат с тренером', path: '/app/chat', icon: MessageSquare },
        { name: 'Профиль', path: '/app/profile', icon: User },
      ];

  const client = role === 'client' ? clients.find(c => c.id === currentClientId) : null;
  const avatar = role === 'trainer' ? trainerProfile.avatar : client?.avatar;
  const name = role === 'trainer' ? trainerProfile.name : client?.name || 'User';
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7] text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/70 backdrop-blur-md border-r border-[#E2B49A]/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-20 border-b border-[#E2B49A]/10 px-4">
          <Activity className="h-6 w-6 text-[#E2B49A] mr-2 stroke-[1.5]" />
          <span className="text-xl font-serif font-medium tracking-wide text-slate-800">NutriFit</span>
        </div>
        
        <div className="p-6">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Меню ({role === 'trainer' ? 'Тренер' : 'Клиент'})
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
                    isActive 
                      ? "bg-[#F4E7E1] text-[#E2B49A] shadow-sm" 
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
                  )}
                >
                  <Icon className={cn("mr-3 h-5 w-5 stroke-[1.5]", isActive ? "text-[#E2B49A]" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-[#E2B49A]/10 bg-white/30">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              {role === 'trainer' ? 'Тренерский аккаунт' : 'Клиентский аккаунт'}
            </div>
            <div className="flex items-center space-x-2">
              {role === 'trainer' && (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5 text-slate-500" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </Button>
                  
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-900">Уведомления</h3>
                        <span className="text-xs text-slate-500">{unreadCount} новых</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-slate-500">Нет уведомлений</div>
                        ) : (
                          <div className="divide-y divide-slate-100">
                            {notifications.map(notif => (
                              <div 
                                key={notif.id} 
                                className={cn("p-4 text-sm transition-colors hover:bg-slate-50 cursor-pointer", !notif.read ? "bg-emerald-50/30" : "")}
                                onClick={() => markNotificationRead(notif.id)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className={cn("font-medium", !notif.read ? "text-slate-900" : "text-slate-600")}>
                                    {notif.type === 'workout_completed' ? '🏋️ Тренировка' : notif.type === 'new_message' ? '💬 Сообщение' : '🔔 Уведомление'}
                                  </span>
                                  <span className="text-xs text-slate-400">{format(parseISO(notif.date), 'HH:mm', { locale: ru })}</span>
                                </div>
                                <p className={cn("text-slate-600 line-clamp-2", !notif.read ? "font-medium" : "")}>{notif.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Выйти"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#E2B49A]/10 flex items-center justify-between px-6 lg:px-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 stroke-[1.5]" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <Link to="/app/profile">
              <div className="h-10 w-10 rounded-full bg-[#F4E7E1] flex items-center justify-center text-[#E2B49A] font-serif font-medium text-lg shadow-sm overflow-hidden border-2 border-white hover:border-[#E2B49A] transition-colors cursor-pointer">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(name)
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
