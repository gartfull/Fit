import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientDashboard } from './ClientDashboard';
import { ClientMenu } from './ClientMenu';
import { WorkoutCalendar } from './WorkoutCalendar';
import { ChatSystem } from './ChatSystem';
import { Button } from '../components/ui/button';
import { ArrowLeft, Activity, Utensils, Dumbbell, MessageSquare, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'workouts' | 'chat' | 'forms'>('dashboard');

  const client = clients.find(c => c.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/app/clients')} className="-ml-4 text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку
        </Button>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'dashboard' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Activity className="w-4 h-4 mr-2" />
            Обзор
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'menu' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Utensils className="w-4 h-4 mr-2" />
            План питания
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'workouts' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Тренировки
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'chat' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Чат
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'forms' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <FileText className="w-4 h-4 mr-2" />
            Анкеты
          </button>
        </div>
      </div>
      
      {activeTab === 'dashboard' && <ClientDashboard clientId={id} />}
      {activeTab === 'menu' && <ClientMenu clientId={id} />}
      {activeTab === 'workouts' && <WorkoutCalendar clientId={id} />}
      {activeTab === 'chat' && <ChatSystem clientId={id} />}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-slate-800">Заполненные анкеты</h2>
          {client?.formResponses && client.formResponses.length > 0 ? (
            client.formResponses.map(response => (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Анкета от {format(parseISO(response.date), 'dd MMMM yyyy, HH:mm', { locale: ru })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    {Object.entries(response.answers).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 p-4 rounded-xl">
                        <dt className="text-sm font-medium text-slate-500 mb-1">{key}</dt>
                        <dd className="text-slate-900">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
              У клиента пока нет заполненных анкет
            </div>
          )}
        </div>
      )}
    </div>
  );
};
