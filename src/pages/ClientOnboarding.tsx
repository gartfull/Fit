import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const ClientOnboarding = () => {
  const { currentClientId, onboardClient, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    startWeight: '',
    goalWeight: '',
    startChest: '',
    startWaist: '',
    startHips: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClientId) return;

    onboardClient(currentClientId, {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age) || 0,
      height: parseFloat(formData.height) || 0,
      startWeight: parseFloat(formData.startWeight) || 0,
      goalWeight: parseFloat(formData.goalWeight) || 0,
      startChest: parseFloat(formData.startChest) || 0,
      startWaist: parseFloat(formData.startWaist) || 0,
      startHips: parseFloat(formData.startHips) || 0,
    });

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={handleLogout} className="text-slate-500">
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Добро пожаловать в NutriFit!</h1>
          <p className="text-slate-500 mt-2">Пожалуйста, заполните начальную анкету, чтобы мы могли настроить ваш личный кабинет.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Личные данные и параметры</CardTitle>
              <CardDescription>Эти данные помогут вашему тренеру составить оптимальный план</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Имя</label>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Фамилия</label>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Электронная Почта</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Номер телефона</label>
                  <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Возраст</label>
                  <Input name="age" type="number" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Рост (см)</label>
                  <Input name="height" type="number" value={formData.height} onChange={handleChange} required />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Цели и замеры</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Текущий вес (кг)</label>
                    <Input name="startWeight" type="number" step="0.1" value={formData.startWeight} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Желаемый вес (кг)</label>
                    <Input name="goalWeight" type="number" step="0.1" value={formData.goalWeight} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Обхват груди (см)</label>
                    <Input name="startChest" type="number" step="0.1" value={formData.startChest} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Обхват талии (см)</label>
                    <Input name="startWaist" type="number" step="0.1" value={formData.startWaist} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Обхват бёдер (см)</label>
                    <Input name="startHips" type="number" step="0.1" value={formData.startHips} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg">Начать работу</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
