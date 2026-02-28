import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MealType, Meal } from '../types';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Check, Utensils } from 'lucide-react';
import { cn } from '../lib/utils';

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Завтрак',
  snack1: 'Перекус 1',
  lunch: 'Обед',
  snack2: 'Перекус 2',
  dinner: 'Ужин',
};

const MEAL_TYPES: MealType[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];

export const ClientMenu = ({ clientId }: { clientId?: string }) => {
  const { clients, currentClientId, meals, toggleMealSelection, role } = useAppContext();
  const idToUse = clientId || currentClientId;
  const client = clients.find(c => c.id === idToUse);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [addingForType, setAddingForType] = useState<MealType | null>(null);

  if (!client) {
    return <div className="p-8 text-center text-slate-500">Клиент не найден</div>;
  }

  // Generate 7 days calendar (3 days ago, today, 3 days ahead)
  const calendarDays = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 3 - i));
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const currentPlan = client.mealPlans.find(p => p.date === selectedDateStr) || {
    date: selectedDateStr,
    selections: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] }
  };

  // Calculate totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  const selectedMealsByType: Record<MealType, Meal[]> = {
    breakfast: [], snack1: [], lunch: [], snack2: [], dinner: []
  };

  MEAL_TYPES.forEach(type => {
    const ids = currentPlan.selections[type] || [];
    const selectedMealsForType = ids.map(id => meals.find(m => m.id === id)).filter(Boolean) as Meal[];
    selectedMealsByType[type] = selectedMealsForType;

    selectedMealsForType.forEach(meal => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalFat += meal.fat;
      totalCarbs += meal.carbs;
    });
  });

  const macroData = [
    { name: 'Белки', value: totalProtein, color: '#3b82f6' }, // blue
    { name: 'Жиры', value: totalFat, color: '#f59e0b' },    // amber
    { name: 'Углеводы', value: totalCarbs, color: '#10b981' }, // emerald
  ];

  const handleToggleMeal = (mealType: MealType, mealId: string) => {
    toggleMealSelection(client.id, selectedDateStr, mealType, mealId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          План питания: {client.name}
        </h1>
        <p className="text-slate-500">
          Цель: {client.dailyCalorieTarget} ккал в день
        </p>
      </div>

      {/* 7-Day Calendar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center overflow-x-auto pb-2 space-x-2">
            {calendarDays.map(day => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => { setSelectedDate(day); setAddingForType(null); }}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl transition-colors",
                    isSelected 
                      ? "bg-emerald-600 text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                    isToday && !isSelected && "ring-2 ring-emerald-200"
                  )}
                >
                  <span className="text-xs font-medium uppercase">{format(day, 'E', { locale: ru })}</span>
                  <span className="text-lg font-bold">{format(day, 'd')}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meal Plan List */}
        <div className="lg:col-span-2 space-y-6">
          {MEAL_TYPES.map(type => (
            <Card key={type} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Utensils className="h-4 w-4 mr-2 text-emerald-600" />
                  {MEAL_TYPE_LABELS[type]}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setAddingForType(addingForType === type ? null : type)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {/* Selected Meals */}
                <div className="divide-y divide-slate-100">
                  {selectedMealsByType[type].length === 0 ? (
                    <div className="p-4 text-sm text-slate-500 text-center italic">
                      Блюда не выбраны
                    </div>
                  ) : (
                    selectedMealsByType[type].map(meal => (
                      <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                          <img src={meal.photoUrl} alt={meal.name} className="h-12 w-12 rounded-md object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-medium text-slate-900">{meal.name}</div>
                            <div className="text-xs text-slate-500">{meal.calories} ккал • Б: {meal.protein} Ж: {meal.fat} У: {meal.carbs}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleToggleMeal(type, meal.id)}>
                          Удалить
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Meal Dropdown/List */}
                {addingForType === type && (
                  <div className="bg-slate-50 p-4 border-t border-slate-200">
                    <div className="text-sm font-medium text-slate-700 mb-3">Выберите блюдо из базы:</div>
                    <div className="grid gap-2 max-h-64 overflow-y-auto pr-2">
                      {meals.filter(m => m.mealType === type).map(meal => {
                        const isSelected = currentPlan.selections[type]?.includes(meal.id);
                        return (
                          <div 
                            key={meal.id} 
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                              isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300"
                            )}
                            onClick={() => handleToggleMeal(type, meal.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <img src={meal.photoUrl} alt={meal.name} className="h-10 w-10 rounded-md object-cover" referrerPolicy="no-referrer" />
                              <div>
                                <div className="font-medium text-sm text-slate-900">{meal.name}</div>
                                <div className="text-xs text-slate-500">{meal.calories} ккал</div>
                              </div>
                            </div>
                            {isSelected && <Check className="h-5 w-5 text-emerald-600" />}
                          </div>
                        );
                      })}
                      {meals.filter(m => m.mealType === type).length === 0 && (
                        <div className="text-sm text-slate-500 text-center py-2">
                          Нет доступных блюд в этой категории. {role === 'trainer' && 'Добавьте их в Базе блюд.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сводка за день</CardTitle>
              <CardDescription>{format(selectedDate, 'dd MMMM yyyy', { locale: ru })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900">{totalCalories}</div>
                <div className="text-sm text-slate-500 mt-1">из {client.dailyCalorieTarget} ккал</div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div 
                    className={cn(
                      "h-2.5 rounded-full",
                      totalCalories > client.dailyCalorieTarget ? "bg-red-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.min((totalCalories / client.dailyCalorieTarget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} г`, '']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Белки</div>
                  <div className="font-medium text-slate-900">{totalProtein.toFixed(1)} г</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Жиры</div>
                  <div className="font-medium text-slate-900">{totalFat.toFixed(1)} г</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Углеводы</div>
                  <div className="font-medium text-slate-900">{totalCarbs.toFixed(1)} г</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
