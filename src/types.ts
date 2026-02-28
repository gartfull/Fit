export type Role = 'trainer' | 'client';
export type MealType = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner';

export interface Meal {
  id: string;
  name: string;
  photoUrl: string;
  ingredients: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  mealType: MealType;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  selections: Record<MealType, string[]>; // Array of meal IDs
}

export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
}

export interface WorkoutPlan {
  date: string; // YYYY-MM-DD
  exerciseIds: string[];
  completed: boolean;
}

export type NotificationType = 'workout_completed' | 'log_filled' | 'log_missed' | 'new_message';

export interface AppNotification {
  id: string;
  clientId: string;
  type: NotificationType;
  message: string;
  date: string; // ISO string
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string; // 'trainer' or clientId
  text: string;
  timestamp: string; // ISO string
}

export interface Ticket {
  id: string;
  clientId: string;
  subject: string;
  status: 'open' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  calories: number;
  water: number; // liters
  sleep: number; // hours
  mood?: Mood;
  chest?: number;
  waist?: number;
  hips?: number;
  notes?: string;
}

export type FieldType = 
  | 'text' | 'email' | 'number' | 'password' | 'textarea'
  | 'dropdown' | 'checkbox' | 'radio' | 'multiselect'
  | 'date' | 'file' | 'section' | 'html' | 'row';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  options?: string[];
  htmlContent?: string;
  dbName?: string;
  rowsCount?: number;
  columns?: FormField[][];
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormResponse {
  id: string;
  formId: string;
  date: string;
  answers: Record<string, any>;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  age?: number;
  height?: number;
  startWeight?: number;
  startChest?: number;
  startWaist?: number;
  startHips?: number;
  goalWeight: number;
  dailyCalorieTarget: number;
  isOnboarded: boolean;
  logs: DailyLog[];
  mealPlans: DailyPlan[];
  workoutPlans: WorkoutPlan[];
  tickets: Ticket[];
  assignedForm?: FormSchema | null;
  formResponses?: FormResponse[];
}
