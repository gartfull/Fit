import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Camera, Save, Shield, User } from 'lucide-react';

export const ProfilePage = () => {
  const { role, currentClientId, clients, trainerProfile, updateTrainerProfile, updateClientProfile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const client = role === 'client' ? clients.find(c => c.id === currentClientId) : null;

  const [formData, setFormData] = useState({
    name: role === 'trainer' ? trainerProfile.name : client?.name || '',
    email: role === 'trainer' ? trainerProfile.email : client?.email || '',
    phone: role === 'trainer' ? trainerProfile.phone : client?.phone || '',
    avatar: role === 'trainer' ? trainerProfile.avatar : client?.avatar || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64 }));
        // Сразу сохраняем фото в профиль
        if (role === 'trainer') {
          updateTrainerProfile({ avatar: base64 });
        } else if (currentClientId) {
          updateClientProfile(currentClientId, { avatar: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Имитация задержки для UI
    setTimeout(() => {
      if (role === 'trainer') {
        updateTrainerProfile(formData);
      } else if (currentClientId) {
        updateClientProfile(currentClientId, formData);
      }
      setIsSaving(false);
      alert('Данные профиля обновлены в базе!');
    }, 500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Проверка текущего пароля
    const actualCurrentPassword = role === 'trainer' ? (trainerProfile.password || 'admin') : client?.password;
    
    if (passwords.current !== actualCurrentPassword) {
      alert('Текущий пароль введен неверно!');
      return;
    }

    // 2. Проверка совпадения новых
    if (passwords.new !== passwords.confirm) {
      alert('Новые пароли не совпадают!');
      return;
    }

    if (passwords.new.length < 4) {
      alert('Пароль слишком короткий!');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      if (role === 'trainer') {
        updateTrainerProfile({ password: passwords.new });
      } else if (currentClientId) {
        updateClientProfile(currentClientId, { password: passwords.new });
      }
      
      setPasswords({ current: '', new: '', confirm: '' });
      setIsSaving(false);
      alert('Пароль успешно изменен и сохранен в базе!');
    }, 500);
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-serif font-medium tracking-wide text-slate-800">Профиль</h1>
        <p className="text-slate-500 mt-2">Настройки аккаунта и безопасность</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-white/50 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#F4E7E1] flex items-center justify-center mb-4">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-serif font-medium text-[#E2B49A]">
                      {getInitials(formData.name)}
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handlePhotoClick}
                  className="rounded-full bg-white text-slate-600 border-slate-200"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Фото
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <h3 className="text-xl font-serif font-medium text-slate-800">{formData.name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-wider">
                {role === 'trainer' ? 'Личный тренер' : 'Клиент'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* ФОРМА ЛИЧНЫХ ДАННЫХ */}
          <Card className="border-white/50 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-50 pb-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-emerald-500" />
                <CardTitle className="text-lg">Личные данные</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Имя и фамилия</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Телефон</label>
                    <Input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить профиль
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ФОРМА СМЕНЫ ПАРОЛЯ */}
          <Card className="border-white/50 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-50 pb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg">Безопасность</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Текущий пароль</label>
                  <Input 
                    type="password" 
                    value={passwords.current} 
                    onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))} 
                    required 
                    placeholder="Введите старый пароль"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Новый пароль</label>
                    <Input 
                      type="password" 
                      value={passwords.new} 
                      onChange={e => setPasswords(prev => ({ ...prev, new: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Повторите новый</label>
                    <Input 
                      type="password" 
                      value={passwords.confirm} 
                      onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="outline" disabled={isSaving} className="border-amber-200 hover:bg-amber-50 text-amber-700">
                    Обновить пароль
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
