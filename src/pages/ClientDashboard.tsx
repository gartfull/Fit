import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Activity, Droplets, Flame, Moon, Target, MessageSquare, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { Mood } from '../types';
import { ClientFormViewer } from '../components/ClientFormViewer';

const MOOD_EMOJIS: Record<Mood, string> = {
  great: '🤩',
  good: '🙂',
  neutral: '😐',
  bad: '🙁',
  terrible: '😫',
};

export const ClientDashboard = ({ clientId }: { clientId?: string }) => {
  const { clients, currentClientId } = useAppContext();
  
  const idToUse = clientId || currentClientId;
  const client = clients.find(c => c.id === idToUse);

  if (!client) {
    return <div className="p-8 text-center text-slate-500">Клиент не найден</div>;
  }

  const sortedLogs = [...client.logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const chartData = sortedLogs.map(log => ({
    ...log,
    formattedDate: format(parseISO(log.date), 'dd MMM', { locale: ru }),
  }));

  const latestLog = sortedLogs[sortedLogs.length - 1];
  const startWeight = client.startWeight || sortedLogs[0]?.weight || 0;
  const currentWeight = latestLog?.weight || startWeight;
  const goalWeight = client.goalWeight;

  // Calculate progress %
  const totalDiff = Math.abs(startWeight - goalWeight);
  const currentDiff = Math.abs(startWeight - currentWeight);
  const isGaining = goalWeight > startWeight;
  
  let progressPercent = 0;
  if (totalDiff > 0) {
    if ((!isGaining && currentWeight <= goalWeight) || (isGaining && currentWeight >= goalWeight)) {
      progressPercent = 100;
    } else if ((!isGaining && currentWeight > startWeight) || (isGaining && currentWeight < startWeight)) {
      progressPercent = 0;
    } else {
      progressPercent = Math.min(100, Math.max(0, (currentDiff / totalDiff) * 100));
    }
  }

  // Find latest measurements
  const latestChest = [...sortedLogs].reverse().find(l => l.chest)?.chest || client.startChest || '--';
  const latestWaist = [...sortedLogs].reverse().find(l => l.waist)?.waist || client.startWaist || '--';
  const latestHips = [...sortedLogs].reverse().find(l => l.hips)?.hips || client.startHips || '--';

  if (client.assignedForm && !clientId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-slate-800">
            Новая анкета
          </h1>
          <p className="text-slate-500 mt-2">
            Тренер назначил вам новую анкету для заполнения.
          </p>
        </div>
        <ClientFormViewer form={client.assignedForm} />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-[#F4E7E1] flex items-center justify-center text-[#E2B49A] font-serif font-medium text-2xl shadow-sm overflow-hidden border-2 border-white">
          {client.avatar ? (
            <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(client.name)
          )}
        </div>
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-slate-800">
            Прогресс: {client.name}
          </h1>
          <p className="text-slate-500">
            Целевой вес: {client.goalWeight} кг • Норма калорий: {client.dailyCalorieTarget} ккал
          </p>
        </div>
      </div>

      {/* Progress & Motivation Widget */}
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-emerald-100" />
              <h3 className="text-lg font-semibold">Прогресс к цели</h3>
            </div>
            <div className="text-2xl font-bold">{progressPercent.toFixed(0)}%</div>
          </div>
          
          <div className="relative h-4 bg-emerald-900/30 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm font-medium text-emerald-100">
            <div>Старт: {startWeight} кг</div>
            <div>Текущий: {currentWeight} кг</div>
            <div>Цель: {goalWeight} кг</div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Текущий вес</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestLog?.weight.toFixed(1) || '--'} кг</div>
            <p className="text-xs text-slate-500">
              {latestLog ? `Обновлено ${format(parseISO(latestLog.date), 'dd.MM.yyyy')}` : 'Нет данных'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Калории (последние)</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestLog?.calories || '--'} ккал</div>
            <p className="text-xs text-slate-500">
              Цель: {client.dailyCalorieTarget} ккал
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Вода</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestLog?.water.toFixed(1) || '--'} л</div>
            <p className="text-xs text-slate-500">
              Рекомендация: 2.0 л
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сон</CardTitle>
            <Moon className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestLog?.sleep.toFixed(1) || '--'} ч</div>
            <p className="text-xs text-slate-500">
              Рекомендация: 7-8 ч
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Silhouette & Measurements */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Замеры тела</CardTitle>
            <CardDescription>Текущие параметры</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col justify-between h-48 py-4 text-right text-sm font-medium text-slate-600">
                <div>Грудь<br/><span className="text-lg text-slate-900">{latestChest} см</span></div>
                <div>Бедра<br/><span className="text-lg text-slate-900">{latestHips} см</span></div>
              </div>
              <div className="w-24 h-48 bg-slate-50 rounded-full flex items-center justify-center relative border border-slate-100">
                {/* Abstract body shape */}
                <div className="w-12 h-36 bg-emerald-100 rounded-[40px] relative">
                  <div className="absolute top-6 -left-4 w-20 h-[1px] border-t border-emerald-300 border-dashed"></div>
                  <div className="absolute top-16 -left-4 w-20 h-[1px] border-t border-emerald-300 border-dashed"></div>
                  <div className="absolute top-26 -left-4 w-20 h-[1px] border-t border-emerald-300 border-dashed"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center h-48 py-4 text-left text-sm font-medium text-slate-600">
                <div>Талия<br/><span className="text-lg text-slate-900">{latestWaist} см</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Динамика веса</CardTitle>
            <CardDescription>Изменение веса за последнее время</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="weight" name="Вес (кг)" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mood & Notes History */}
      <Card>
        <CardHeader>
          <CardTitle>Дневник самочувствия</CardTitle>
          <CardDescription>Последние записи и комментарии</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...sortedLogs].reverse().filter(log => log.mood || log.notes).slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex-shrink-0 text-3xl">
                  {log.mood ? MOOD_EMOJIS[log.mood] : '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    {format(parseISO(log.date), 'dd MMMM yyyy', { locale: ru })}
                  </div>
                  {log.notes ? (
                    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{log.notes}</p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-400 italic">Без комментария</p>
                  )}
                </div>
              </div>
            ))}
            {[...sortedLogs].filter(log => log.mood || log.notes).length === 0 && (
              <div className="text-center text-slate-500 py-4">Нет записей в дневнике</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
