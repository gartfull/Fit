import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MealType } from '../types';

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Завтрак',
  snack1: 'Перекус 1',
  lunch: 'Обед',
  snack2: 'Перекус 2',
  dinner: 'Ужин',
};

export const AdminMeals = () => {
  const { meals, addMeal } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    ingredients: '',
    protein: '',
    fat: '',
    carbs: '',
    calories: '',
    mealType: 'breakfast' as MealType,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeal({
      name: formData.name,
      photoUrl: formData.photoUrl || `https://picsum.photos/seed/${formData.name}/400/300`,
      ingredients: formData.ingredients,
      protein: parseFloat(formData.protein) || 0,
      fat: parseFloat(formData.fat) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      calories: parseInt(formData.calories) || 0,
      mealType: formData.mealType,
    });
    
    // Reset form
    setFormData({
      name: '',
      photoUrl: '',
      ingredients: '',
      protein: '',
      fat: '',
      carbs: '',
      calories: '',
      mealType: 'breakfast',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">База блюд</h1>
        <p className="text-slate-500">Управление доступными блюдами для планов питания клиентов</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Добавить новое блюдо</CardTitle>
            <CardDescription>Заполните информацию о блюде, чтобы клиенты могли добавлять его в свой план</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Название</label>
                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Например: Овсянка с ягодами" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Категория (Прием пищи)</label>
                <select 
                  name="mealType" 
                  value={formData.mealType} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  {Object.entries(MEAL_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Ссылка на фото (необязательно)</label>
                <Input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Состав (ингредиенты)</label>
                <textarea 
                  name="ingredients" 
                  value={formData.ingredients} 
                  onChange={handleChange} 
                  required 
                  placeholder="Овсяные хлопья 50г, молоко 150мл..."
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Белки (г)</label>
                <Input name="protein" type="number" step="0.1" value={formData.protein} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Жиры (г)</label>
                <Input name="fat" type="number" step="0.1" value={formData.fat} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Углеводы (г)</label>
                <Input name="carbs" type="number" step="0.1" value={formData.carbs} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Калории (ккал)</label>
                <Input name="calories" type="number" value={formData.calories} onChange={handleChange} required />
              </div>
            </div>
            <Button type="submit" className="mt-4">Добавить блюдо</Button>
          </CardContent>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meals.map(meal => (
          <Card key={meal.id} className="overflow-hidden flex flex-col">
            <img src={meal.photoUrl} alt={meal.name} className="h-48 w-full object-cover" referrerPolicy="no-referrer" />
            <CardHeader className="pb-2">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                {MEAL_TYPE_LABELS[meal.mealType]}
              </div>
              <CardTitle className="text-lg">{meal.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-slate-600 space-y-2">
              <p className="line-clamp-2">{meal.ingredients}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                <div className="font-medium text-slate-900">{meal.calories} ккал</div>
                <div className="text-xs text-slate-500">Б: {meal.protein} Ж: {meal.fat} У: {meal.carbs}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
