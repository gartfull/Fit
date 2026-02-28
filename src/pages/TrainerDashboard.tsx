import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, TrendingUp, Activity, Bell } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const TrainerDashboard = () => {
  const { clients, notifications } = useAppContext();

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.isOnboarded).length;

  const recentNotifications = [...notifications].slice(0, 5);

  const conversionData = [
    { name: 'Активные', value: activeClients, color: '#E2B49A' },
    { name: 'Ожидают', value: totalClients - activeClients, color: '#F4E7E1' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-medium tracking-wide text-slate-800">Обзорная панель</h1>
        <p className="text-slate-500 mt-2">Статистика и последние события</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider">Всего клиентов</CardTitle>
            <Users className="h-5 w-5 text-[#E2B49A] stroke-[1.5]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-slate-800">{totalClients}</div>
            <p className="text-xs text-slate-400 mt-1">+2 за этот месяц</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider">Активные (в работе)</CardTitle>
            <Activity className="h-5 w-5 text-[#94A3B8] stroke-[1.5]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-slate-800">{activeClients}</div>
            <p className="text-xs text-slate-400 mt-1">Заполнили анкету</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider">Конверсия</CardTitle>
            <TrendingUp className="h-5 w-5 text-[#E2B49A] stroke-[1.5]" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-slate-800">{Math.round((activeClients / (totalClients || 1)) * 100)}%</div>
            <p className="text-xs text-slate-400 mt-1">Из лида в активного</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Воронка клиентов</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              {conversionData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Последние события</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentNotifications.length > 0 ? (
                recentNotifications.map(notif => (
                  <div key={notif.id} className="flex items-start space-x-4">
                    <div className="mt-0.5 bg-[#F4E7E1] p-2 rounded-full shrink-0">
                      <Bell className="w-4 h-4 text-[#E2B49A] stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{format(parseISO(notif.date), 'dd MMM, HH:mm', { locale: ru })}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">Нет недавних событий</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
