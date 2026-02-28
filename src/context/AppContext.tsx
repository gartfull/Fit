import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Client, DailyLog, Role, Meal, MealType, Exercise, AppNotification, Ticket, FormSchema, FormResponse } from '../types';

// ... (MOCK_EXERCISES и MOCK_MEALS оставляем без изменений)

const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex1', title: 'Приседания со штангой', videoUrl: 'https://www.youtube.com/watch?v=1', description: '3 подхода по 12 повторений' },
  { id: 'ex2', title: 'Отжимания от пола', videoUrl: 'https://www.youtube.com/watch?v=2', description: '4 подхода по 15 повторений' },
  { id: 'ex3', title: 'Планка', videoUrl: 'https://www.youtube.com/watch?v=3', description: '3 подхода по 1 минуте' },
];

const MOCK_MEALS: Meal[] = [
  { id: 'm1', name: 'Овсянка с ягодами', photoUrl: 'https://picsum.photos/seed/oatmeal/400/300', ingredients: 'Овсяные хлопья 50г, молоко 150мл, ягоды 50г', protein: 8, fat: 5, carbs: 45, calories: 250, mealType: 'breakfast' },
  { id: 'm2', name: 'Яичница с тостом', photoUrl: 'https://picsum.photos/seed/eggs/400/300', ingredients: 'Яйца 2шт, цельнозерновой хлеб 1шт, масло 5г', protein: 16, fat: 15, carbs: 15, calories: 260, mealType: 'breakfast' },
  { id: 'm3', name: 'Куриная грудка с гречкой', photoUrl: 'https://picsum.photos/seed/chicken/400/300', ingredients: 'Куриное филе 150г, гречка 50г, овощи 100г', protein: 35, fat: 4, carbs: 35, calories: 320, mealType: 'lunch' },
];

const generateMockData = (): Client[] => {
  return [
    {
      id: 'c1',
      name: 'Алексей Иванов',
      email: 'alexey@example.com',
      password: '123',
      phone: '+7 (999) 123-45-67',
      age: 32,
      height: 180,
      startWeight: 85,
      goalWeight: 75,
      dailyCalorieTarget: 2200,
      isOnboarded: true,
      logs: [],
      mealPlans: [],
      workoutPlans: [],
      tickets: [],
      assignedForm: null,
      formResponses: []
    }
  ];
};

interface AppContextType {
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentClientId: string | null;
  setCurrentClientId: (id: string | null) => void;
  clients: Client[];
  addLog: (clientId: string, log: Omit<DailyLog, 'id'>) => void;
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  toggleMealSelection: (clientId: string, date: string, mealType: MealType, mealId: string) => void;
  onboardClient: (clientId: string, data: Partial<Client>) => void;
  createClient: (name: string, email: string, password: string) => void;
  deleteClient: (id: string) => void;
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  toggleWorkoutExercise: (clientId: string, date: string, exerciseId: string) => void;
  markWorkoutCompleted: (clientId: string, date: string, completed: boolean) => void;
  createTicket: (clientId: string, subject: string, message: string) => void;
  addMessageToTicket: (clientId: string, ticketId: string, text: string, senderId: string) => void;
  assignFormToClient: (clientId: string, form: FormSchema) => void;
  submitClientForm: (clientId: string, formId: string, answers: Record<string, any>) => void;
  forms: FormSchema[];
  addForm: (form: FormSchema) => void;
  updateForm: (id: string, form: FormSchema) => void;
  deleteForm: (id: string) => void;
  trainerProfile: { name: string; email: string; phone: string; avatar?: string; password?: string };
  updateTrainerProfile: (data: Partial<{ name: string; email: string; phone: string; avatar: string; password?: string }>) => void;
  updateClientProfile: (clientId: string, data: Partial<Client>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('app_isAuthenticated', false);
  const [role, setRole] = useLocalStorage<Role>('app_role', 'client');
  const [currentClientId, setCurrentClientId] = useLocalStorage<string | null>('app_currentClientId', null);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [meals, setMeals] = useState<Meal[]>(MOCK_MEALS);
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [forms, setForms] = useState<FormSchema[]>([]);
  
  const [trainerProfile, setTrainerProfile] = useLocalStorage('app_trainerProfile', {
    name: 'Анна Тренер',
    email: 'admin@test.com',
    phone: '+7 (999) 000-00-00',
    avatar: '',
    password: 'admin' // Пароль по умолчанию
  });

  useEffect(() => {
    const initData = async () => {
      const { data } = await supabase.from('app_data').select('*');
      if (data && data.length > 0) {
        const c = data.find(d => d.key === 'clients')?.content;
        const m = data.find(d => d.key === 'meals')?.content;
        const e = data.find(d => d.key === 'exercises')?.content;
        const f = data.find(d => d.key === 'forms')?.content;
        const n = data.find(d => d.key === 'notifications')?.content;
        const tp = data.find(d => d.key === 'trainer_profile')?.content;

        if (c) setClients(c); else setClients(generateMockData());
        if (m) setMeals(m);
        if (e) setExercises(e);
        if (f) setForms(f);
        if (n) setNotifications(n);
        if (tp) setTrainerProfile(tp); // Загружаем профиль тренера из БД
      } else {
        const initialClients = generateMockData();
        setClients(initialClients);
        save('clients', initialClients);
        save('meals', MOCK_MEALS);
        save('exercises', MOCK_EXERCISES);
        save('trainer_profile', trainerProfile); // Сохраняем начальный профиль тренера
      }
    };
    initData();
  }, []);

  const save = async (key: string, content: any) => {
    try {
      const { error } = await supabase.from('app_data').upsert({ key, content }, { onConflict: 'key' });
      if (error) console.error("Ошибка сохранения:", error);
    } catch (e) {
      console.error("Ошибка сети:", e);
    }
  };

  const login = async (email: string, password: string) => {
    // 1. ПРОВЕРКА АДМИНА
    if (email === trainerProfile.email) {
      // Если пароль в профиле еще не задан, используем 'admin'
      const adminPass = trainerProfile.password || 'admin';
      if (password === adminPass) {
        setRole('trainer');
        setIsAuthenticated(true);
        return;
      } else {
        throw new Error('Неверный пароль администратора');
      }
    }

    // 2. ПРОВЕРКА КЛИЕНТА
    const existingClient = clients.find(c => c.email === email);
    if (existingClient && existingClient.password === password) {
      setRole('client');
      setCurrentClientId(existingClient.id);
      setIsAuthenticated(true);
    } else {
      throw new Error('Неверная почта или пароль');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('client');
    setCurrentClientId(null);
  };

  // ... (Остальные функции: createClient, deleteClient, addLog и т.д. без изменений)
  // Но обязательно проверь наличие исправленной updateTrainerProfile ниже:

  const createClient = (name: string, email: string, password: string) => {
    const newList = [...clients, {
      id: `c-${Date.now()}`,
      name, 
      email, 
      password, 
      goalWeight: 0, 
      dailyCalorieTarget: 2000,
      isOnboarded: false, 
      logs: [], 
      mealPlans: [], 
      workoutPlans: [],
      tickets: [], 
      assignedForm: null, 
      formResponses: []
    }];
    setClients(newList);
    save('clients', newList);
  };

  const deleteClient = (id: string) => {
    const newList = clients.filter(c => c.id !== id);
    setClients(newList);
    save('clients', newList);
    if (currentClientId === id) setCurrentClientId(null);
  };

  const addLog = (clientId: string, log: Omit<DailyLog, 'id'>) => {
    const newList = clients.map(client => {
      if (client.id === clientId) {
        const existingLogIndex = client.logs.findIndex(l => l.date === log.date);
        const newLogs = [...client.logs];
        if (existingLogIndex >= 0) {
          newLogs[existingLogIndex] = { ...newLogs[existingLogIndex], ...log };
        } else {
          newLogs.push({ ...log, id: `log-${Date.now()}` });
        }
        return { ...client, logs: newLogs };
      }
      return client;
    });
    setClients(newList);
    save('clients', newList);
  };

  const onboardClient = (clientId: string, data: Partial<Client>) => {
    const newList = clients.map(c => c.id === clientId ? { ...c, ...data, isOnboarded: true } : c);
    setClients(newList);
    save('clients', newList);
  };

  const toggleMealSelection = (clientId: string, date: string, mealType: MealType, mealId: string) => {
    const newList = clients.map(client => {
      if (client.id === clientId) {
        const planIndex = client.mealPlans.findIndex(p => p.date === date);
        const newPlans = [...client.mealPlans];
        if (planIndex >= 0) {
            const current = newPlans[planIndex].selections[mealType] || [];
            newPlans[planIndex].selections[mealType] = current.includes(mealId) 
                ? current.filter(id => id !== mealId) 
                : [...current, mealId];
        } else {
            newPlans.push({ date, selections: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], [mealType]: [mealId] } });
        }
        return { ...client, mealPlans: newPlans };
      }
      return client;
    });
    setClients(newList);
    save('clients', newList);
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newList = [...meals, { ...meal, id: `m-${Date.now()}` }];
    setMeals(newList);
    save('meals', newList);
  };

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newList = [...exercises, { ...exercise, id: `ex-${Date.now()}` }];
    setExercises(newList);
    save('exercises', newList);
  };

  const markNotificationRead = (id: string) => {
    const newList = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(newList);
    save('notifications', newList);
  };

  const toggleWorkoutExercise = (clientId: string, date: string, exerciseId: string) => {
    const newList = clients.map(client => {
      if (client.id === clientId) {
        const planIndex = client.workoutPlans.findIndex(p => p.date === date);
        const newPlans = [...client.workoutPlans];
        if (planIndex >= 0) {
          const current = newPlans[planIndex].exerciseIds;
          newPlans[planIndex].exerciseIds = current.includes(exerciseId) ? current.filter(id => id !== exerciseId) : [...current, exerciseId];
        } else {
          newPlans.push({ date, exerciseIds: [exerciseId], completed: false });
        }
        return { ...client, workoutPlans: newPlans };
      }
      return client;
    });
    setClients(newList);
    save('clients', newList);
  };

  const markWorkoutCompleted = (clientId: string, date: string, completed: boolean) => {
    const newList = clients.map(client => {
      if (client.id === clientId) {
        const planIndex = client.workoutPlans.findIndex(p => p.date === date);
        if (planIndex >= 0) {
          const newPlans = [...client.workoutPlans];
          newPlans[planIndex].completed = completed;
          return { ...client, workoutPlans: newPlans };
        }
      }
      return client;
    });
    setClients(newList);
    save('clients', newList);
  };

  const createTicket = (clientId: string, subject: string, text: string) => {
    const newList = clients.map(c => {
        if (c.id === clientId) {
            const newTicket: Ticket = {
                id: `t-${Date.now()}`, clientId, subject, status: 'open',
                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
                messages: [{ id: `m-${Date.now()}`, senderId: clientId, text, timestamp: new Date().toISOString() }]
            };
            return { ...c, tickets: [...c.tickets, newTicket] };
        }
        return c;
    });
    setClients(newList);
    save('clients', newList);
  };

  const addMessageToTicket = (clientId: string, ticketId: string, text: string, senderId: string) => {
    const newList = clients.map(c => {
        if (c.id === clientId) {
            const newTickets = c.tickets.map(t => t.id === ticketId ? {
                ...t, updatedAt: new Date().toISOString(),
                messages: [...t.messages, { id: `m-${Date.now()}`, senderId, text, timestamp: new Date().toISOString() }]
            } : t);
            return { ...c, tickets: newTickets };
        }
        return c;
    });
    setClients(newList);
    save('clients', newList);
  };

  const assignFormToClient = (clientId: string, form: FormSchema) => {
    const newList = clients.map(c => c.id === clientId ? { ...c, assignedForm: form } : c);
    setClients(newList);
    save('clients', newList);
  };

  const submitClientForm = (clientId: string, formId: string, answers: Record<string, any>) => {
    const newList = clients.map(c => {
      if (c.id === clientId) {
        const newResp: FormResponse = { id: `fr-${Date.now()}`, formId, date: new Date().toISOString(), answers };
        return { ...c, assignedForm: null, formResponses: [...(c.formResponses || []), newResp] };
      }
      return c;
    });
    setClients(newList);
    save('clients', newList);
  };

  const addForm = (form: FormSchema) => {
    const newList = [...forms, form];
    setForms(newList);
    save('forms', newList);
  };

  const updateForm = (id: string, form: FormSchema) => {
    const newList = forms.map(f => f.id === id ? form : f);
    setForms(newList);
    save('forms', newList);
  };

  const deleteForm = (id: string) => {
    const newList = forms.filter(f => f.id !== id);
    setForms(newList);
    save('forms', newList);
  };

  const updateTrainerProfile = (data: Partial<{ name: string; email: string; phone: string; avatar: string; password?: string }>) => {
    setTrainerProfile(prev => {
      const newProfile = { ...prev, ...data };
      save('trainer_profile', newProfile); // Сохраняем обновленный профиль в Supabase
      return newProfile;
    });
  };

  const updateClientProfile = (clientId: string, data: Partial<Client>) => {
    const newList = clients.map(c => c.id === clientId ? { ...c, ...data } : c);
    setClients(newList);
    save('clients', newList);
  };

  return (
    <AppContext.Provider value={{ 
      role, isAuthenticated, login, logout, currentClientId, setCurrentClientId, 
      clients, addLog, meals, addMeal, toggleMealSelection, onboardClient, createClient, deleteClient,
      exercises, addExercise, notifications, markNotificationRead, toggleWorkoutExercise, markWorkoutCompleted,
      createTicket, addMessageToTicket, assignFormToClient, submitClientForm,
      forms, addForm, updateForm, deleteForm,
      trainerProfile, updateTrainerProfile, updateClientProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
