import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { UserPlus, Eye, Trash2, Search, Lock } from 'lucide-react'; // Добавил иконку Lock
import { useNavigate } from 'react-router-dom';

export const AdminClients = () => {
  const { clients, setCurrentClientId, createClient, deleteClient } = useAppContext();
  const navigate = useNavigate();
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPassword, setNewClientPassword] = useState(''); // Новое состояние для пароля
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Теперь передаем 3 параметра: Имя, Почта, Пароль
    createClient(newClientName, newClientEmail, newClientPassword);
    
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPassword('');
    
    alert(`Аккаунт для ${newClientName} успешно создан!\nПароль: ${newClientPassword}`);
  };

  const handleViewClient = (id: string) => {
    setCurrentClientId(id);
    navigate(`/app/clients/${id}`);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить клиента ${name}? Это действие нельзя отменить.`)) {
      deleteClient(id);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Управление клиентами</h1>
        <p className="text-slate-500">Создание, удаление и просмотр профилей клиентов</p>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="text-lg text-emerald-800">Создать аккаунт клиента</CardTitle>
          <CardDescription className="text-emerald-600/80">
            Добавьте нового клиента и установите ему пароль для первого входа.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Форма стала более гибкой для мобильных устройств */}
          <form onSubmit={handleCreateClient} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-emerald-900">Имя и Фамилия</label>
                <Input 
                  value={newClientName} 
                  onChange={e => setNewClientName(e.target.value)} 
                  required 
                  placeholder="Иван Иванов" 
                  className="bg-white border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-emerald-900">Email (логин)</label>
                <Input 
                  type="email" 
                  value={newClientEmail} 
                  onChange={e => setNewClientEmail(e.target.value)} 
                  required 
                  placeholder="client@example.com" 
                  className="bg-white border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-emerald-900">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-500" />
                  <Input 
                    type="password" 
                    value={newClientPassword} 
                    onChange={e => setNewClientPassword(e.target.value)} 
                    required 
                    placeholder="Придумайте пароль" 
                    className="pl-9 bg-white border-emerald-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md">
                <UserPlus className="w-4 h-4 mr-2" />
                Создать аккаунт
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Список клиентов</CardTitle>
              <CardDescription>Все зарегистрированные клиенты</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Поиск..." 
                className="pl-9" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Имя</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 text-right font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-900">{client.name}</td>
                      <td className="px-4 py-4 text-slate-500">{client.email}</td>
                      <td className="px-4 py-4">
                        {client.isOnboarded ? (
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">АКТИВЕН</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">НОВЫЙ</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewClient(client.id)}>
                          <Eye className="w-4 h-4 mr-1.5" /> Профиль
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 border-red-100" 
                          onClick={() => handleDeleteClient(client.id, client.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Клиенты не найдены</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
