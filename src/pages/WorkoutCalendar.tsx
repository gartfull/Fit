import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, PlayCircle, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const WorkoutCalendar = ({ clientId }: { clientId?: string }) => {
  const { role, currentClientId, clients, exercises, toggleWorkoutExercise, markWorkoutCompleted } = useAppContext();
  const targetClientId = clientId || currentClientId;
  const client = clients.find(c => c.id === targetClientId);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!client) return <div>Клиент не найден</div>;

  const nextMonth = () => setCurrentMonth(addDays(currentMonth, 30));
  const prevMonth = () => setCurrentMonth(addDays(currentMonth, -30));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm text-slate-500 py-2">
          {format(addDays(startDate, i), 'EEEEEE', { locale: ru })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateStr = format(day, 'yyyy-MM-dd');
        const plan = client.workoutPlans.find(p => p.date === dateStr);
        const hasWorkout = plan && plan.exerciseIds.length > 0;
        const isCompleted = plan?.completed;

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={cn(
              "min-h-[80px] p-2 border border-slate-100 transition-colors cursor-pointer relative",
              !isSameMonth(day, monthStart) ? "bg-slate-50 text-slate-400" : "bg-white text-slate-800",
              isSameDay(day, new Date()) ? "bg-emerald-50" : "",
              selectedDate && isSameDay(day, selectedDate) ? "ring-2 ring-emerald-500 ring-inset" : "hover:bg-slate-50"
            )}
          >
            <span className={cn(
              "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
              isSameDay(day, new Date()) ? "bg-emerald-600 text-white" : ""
            )}>
              {formattedDate}
            </span>
            
            {hasWorkout && (
              <div className="mt-1 flex flex-col gap-1">
                <div className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-sm truncate",
                  isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                )}>
                  {plan.exerciseIds.length} упр.
                </div>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute bottom-2 right-2" />}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">{rows}</div>;
  };

  const renderSelectedDayPanel = () => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const plan = client.workoutPlans.find(p => p.date === dateStr);
    const plannedExercises = plan?.exerciseIds.map(id => exercises.find(e => e.id === id)).filter(Boolean) as typeof exercises || [];

    return (
      <Card className="mt-6 border-emerald-200 shadow-md">
        <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Тренировка на {format(selectedDate, 'dd MMMM', { locale: ru })}</CardTitle>
              <CardDescription>
                {plannedExercises.length > 0 ? `${plannedExercises.length} упражнений запланировано` : 'Нет запланированных тренировок'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {role === 'trainer' ? (
            <div className="space-y-6">
              {/* Trainer View: Edit Plan */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Выбранные упражнения</h4>
                {plannedExercises.length > 0 ? (
                  <div className="space-y-2">
                    {plannedExercises.map(ex => (
                      <div key={ex.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span className="font-medium">{ex.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => toggleWorkoutExercise(client.id, dateStr, ex.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Пока ничего не добавлено</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Библиотека упражнений</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {exercises.filter(ex => !plan?.exerciseIds.includes(ex.id)).map(ex => (
                    <div key={ex.id} className="flex flex-col p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => toggleWorkoutExercise(client.id, dateStr, ex.id)}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{ex.title}</span>
                        <Plus className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs text-slate-500 truncate">{ex.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Client View: View and Complete */}
              {plannedExercises.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {plannedExercises.map((ex, idx) => (
                      <div key={ex.id} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg text-slate-800">{idx + 1}. {ex.title}</h4>
                          <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full">
                            <PlayCircle className="w-5 h-5" />
                          </a>
                        </div>
                        {ex.description && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{ex.description}</p>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <Button 
                      className={cn("w-full h-14 text-lg", plan?.completed ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-emerald-600 hover:bg-emerald-700")}
                      onClick={() => markWorkoutCompleted(client.id, dateStr, !plan?.completed)}
                    >
                      {plan?.completed ? (
                        <><CheckCircle2 className="w-5 h-5 mr-2" /> Тренировка выполнена</>
                      ) : (
                        <><Circle className="w-5 h-5 mr-2" /> Отметить как выполненное</>
                      )}
                    </Button>
                    {!plan?.completed && (
                      <p className="text-center text-xs text-slate-500 mt-2">Тренер получит уведомление о выполнении</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  На этот день тренировок не запланировано. Отдыхайте! 🧘‍♀️
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Календарь тренировок</h1>
        <p className="text-slate-500">
          {role === 'trainer' ? `Планирование тренировок для: ${client.name}` : 'Ваш план тренировок'}
        </p>
      </div>

      <div className="max-w-4xl">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        {renderSelectedDayPanel()}
      </div>
    </div>
  );
};
