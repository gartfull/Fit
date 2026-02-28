import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Mood } from '../types';
import { cn } from '../lib/utils';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '🤩', label: 'Отлично' },
  { value: 'good', emoji: '🙂', label: 'Хорошо' },
  { value: 'neutral', emoji: '😐', label: 'Нормально' },
  { value: 'bad', emoji: '🙁', label: 'Плохо' },
  { value: 'terrible', emoji: '😫', label: 'Ужасно' },
];

export const LogForm = () => {
  const { currentClientId, addLog } = useAppContext();
  const navigate = useNavigate();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    date: today,
    weight: '',
    calories: '',
    water: '',
    sleep: '',
    notes: '',
    chest: '',
    waist: '',
    hips: '',
  });
  
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const [showMeasurements, setShowMeasurements] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClientId) return;

    addLog(currentClientId, {
      date: formData.date,
      weight: parseFloat(formData.weight) || 0,
      calories: parseInt(formData.calories) || 0,
      water: parseFloat(formData.water) || 0,
      sleep: parseFloat(formData.sleep) || 0,
      mood: selectedMood,
      notes: formData.notes,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
    });

    navigate('/app');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Заполнить форму</h1>
        <p className="text-slate-500">Внесите свои данные за день для отслеживания прогресса</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Ежедневный отчет</CardTitle>
            <CardDescription>Пожалуйста, заполняйте форму каждый день в одно и то же время</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium leading-none text-slate-700">Дата</label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium leading-none text-slate-700">Вес (кг)</label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  placeholder="Например: 70.5"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium leading-none text-slate-700">Калории (ккал)</label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  placeholder="Например: 1800"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="water" className="text-sm font-medium leading-none text-slate-700">Вода (литры)</label>
                <Input
                  id="water"
                  name="water"
                  type="number"
                  step="0.1"
                  placeholder="Например: 2.0"
                  value={formData.water}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sleep" className="text-sm font-medium leading-none text-slate-700">Сон (часы)</label>
                <Input
                  id="sleep"
                  name="sleep"
                  type="number"
                  step="0.5"
                  placeholder="Например: 7.5"
                  value={formData.sleep}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-sm font-medium leading-none text-slate-700">Настроение и самочувствие</label>
              <div className="flex justify-between sm:justify-start sm:space-x-4">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMood(m.value)}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-xl transition-all",
                      selectedMood === m.value ? "bg-emerald-100 scale-110 shadow-sm ring-2 ring-emerald-500" : "hover:bg-slate-100 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
                    )}
                    title={m.label}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-[10px] mt-1 font-medium text-slate-600">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium leading-none text-slate-700">Комментарий (необязательно)</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Как прошла тренировка? Были ли срывы в питании?"
                value={formData.notes}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mb-4"
                onClick={() => setShowMeasurements(!showMeasurements)}
              >
                {showMeasurements ? 'Скрыть замеры тела' : 'Добавить замеры тела (опционально)'}
              </Button>

              {showMeasurements && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="space-y-2">
                    <label htmlFor="chest" className="text-sm font-medium leading-none text-slate-700">Грудь (см)</label>
                    <Input id="chest" name="chest" type="number" step="0.1" value={formData.chest} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="waist" className="text-sm font-medium leading-none text-slate-700">Талия (см)</label>
                    <Input id="waist" name="waist" type="number" step="0.1" value={formData.waist} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hips" className="text-sm font-medium leading-none text-slate-700">Бёдра (см)</label>
                    <Input id="hips" name="hips" type="number" step="0.1" value={formData.hips} onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Сохранить данные</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
