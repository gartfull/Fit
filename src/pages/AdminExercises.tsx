import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PlayCircle, Plus } from 'lucide-react';

export const AdminExercises = () => {
  const { exercises, addExercise } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExercise({ title, videoUrl, description });
    setTitle('');
    setVideoUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Библиотека упражнений</h1>
        <p className="text-slate-500">Управление базой упражнений для тренировок</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Exercise Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Добавить упражнение</CardTitle>
            <CardDescription>Заполните данные для новой карточки</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Название</label>
                <Input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  placeholder="Например: Приседания" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ссылка на видео (YouTube)</label>
                <Input 
                  type="url"
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)} 
                  required 
                  placeholder="https://youtube.com/..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Описание / Техника</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Опишите технику выполнения..."
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {exercises.map(exercise => (
            <Card key={exercise.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {exercise.description && (
                  <p className="text-sm text-slate-600 mb-4 flex-1">{exercise.description}</p>
                )}
                <a 
                  href={exercise.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-auto"
                >
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Смотреть видео
                </a>
              </CardContent>
            </Card>
          ))}
          {exercises.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
              Библиотека пуста. Добавьте первое упражнение.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
