import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageSquare, Send, User, ShieldAlert } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../lib/utils';

export const ChatSystem = ({ clientId }: { clientId?: string }) => {
  const { role, currentClientId, clients, createTicket, addMessageToTicket } = useAppContext();
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const targetClientId = clientId || currentClientId;
  const client = clients.find(c => c.id === targetClientId);

  if (!client) return <div>Выберите клиента для чата</div>;

  const tickets = client.tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicketId) return;
    
    addMessageToTicket(client.id, selectedTicketId, newMessage, role === 'trainer' ? 'trainer' : client.id);
    setNewMessage('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    
    createTicket(client.id, newSubject, newMessage);
    setNewSubject('');
    setNewMessage('');
    setIsCreatingTicket(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Служба поддержки / Чат</h1>
        <p className="text-slate-500">
          {role === 'trainer' ? `Связь с клиентом: ${client.name}` : 'Задайте вопрос вашему тренеру'}
        </p>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Ticket List */}
        <Card className="w-1/3 flex flex-col shadow-sm border-slate-200">
          <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Обращения</CardTitle>
            {role === 'client' && (
              <Button size="sm" onClick={() => { setIsCreatingTicket(true); setSelectedTicketId(null); }} className="bg-emerald-600 hover:bg-emerald-700">
                Новый вопрос
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                У вас пока нет активных обращений.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => { setSelectedTicketId(ticket.id); setIsCreatingTicket(false); }}
                    className={cn(
                      "w-full text-left p-4 hover:bg-slate-50 transition-colors",
                      selectedTicketId === ticket.id ? "bg-emerald-50/50 border-l-4 border-emerald-500" : "border-l-4 border-transparent"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900 truncate pr-2">{ticket.subject}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {format(parseISO(ticket.updatedAt), 'dd MMM', { locale: ru })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 truncate">
                      {ticket.messages[ticket.messages.length - 1]?.text}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-sm border-slate-200 bg-slate-50/50">
          {isCreatingTicket ? (
            <div className="p-6 flex flex-col h-full bg-white rounded-xl">
              <h3 className="text-xl font-bold mb-4">Новое обращение</h3>
              <form onSubmit={handleCreateTicket} className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Тема вопроса</label>
                  <Input 
                    value={newSubject} 
                    onChange={e => setNewSubject(e.target.value)} 
                    placeholder="Например: Боль в колене при приседаниях" 
                    required 
                  />
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-sm font-medium text-slate-700">Сообщение</label>
                  <textarea 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)} 
                    className="flex-1 w-full rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Опишите вашу проблему подробно..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreatingTicket(false)}>Отмена</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Отправить</Button>
                </div>
              </form>
            </div>
          ) : selectedTicket ? (
            <>
              <CardHeader className="bg-white border-b border-slate-100 shrink-0 py-4">
                <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                <CardDescription>Создано: {format(parseISO(selectedTicket.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedTicket.messages.map(msg => {
                  const isTrainer = msg.senderId === 'trainer';
                  const isMe = (role === 'trainer' && isTrainer) || (role === 'client' && !isTrainer);
                  
                  return (
                    <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-5 py-3",
                        isMe ? "bg-emerald-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                      )}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={cn("text-xs font-bold", isMe ? "text-emerald-100" : "text-slate-500")}>
                            {isTrainer ? 'Тренер' : client.name}
                          </span>
                          <span className={cn("text-[10px]", isMe ? "text-emerald-200" : "text-slate-400")}>
                            {format(parseISO(msg.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="bg-white border-t border-slate-100 p-4 shrink-0">
                <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                  <Input 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)} 
                    placeholder="Напишите сообщение..." 
                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
                  />
                  <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-600">Выберите обращение слева</p>
              <p className="text-sm mt-2">или создайте новое, чтобы задать вопрос тренеру.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
