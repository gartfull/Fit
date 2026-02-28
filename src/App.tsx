/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { TrainerDashboard } from './pages/TrainerDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { ClientDetail } from './pages/ClientDetail';
import { LogForm } from './pages/LogForm';
import { AdminMeals } from './pages/AdminMeals';
import { AdminClients } from './pages/AdminClients';
import { AdminFormBuilder } from './pages/AdminFormBuilder';
import { AdminExercises } from './pages/AdminExercises';
import { ProfilePage } from './pages/ProfilePage';
import { WorkoutCalendar } from './pages/WorkoutCalendar';
import { ChatSystem } from './pages/ChatSystem';
import { ClientMenu } from './pages/ClientMenu';
import { ClientOnboarding } from './pages/ClientOnboarding';
import { LoginPage } from './pages/LoginPage';
import { NotFound } from './pages/NotFound';

import { LandingPage } from './pages/LandingPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { role, clients, currentClientId, isAuthenticated } = useAppContext();
  const currentClient = clients.find(c => c.id === currentClientId);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {isAuthenticated && role === 'client' && currentClient && !currentClient.isOnboarded ? (
        <Route path="/app/*" element={<ClientOnboarding />} />
      ) : (
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {role === 'trainer' ? (
          <>
            <Route index element={<TrainerDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="meals" element={<AdminMeals />} />
            <Route path="exercises" element={<AdminExercises />} />
            <Route path="forms" element={<AdminFormBuilder />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route index element={<ClientDashboard />} />
            <Route path="log" element={<LogForm />} />
            <Route path="menu" element={<ClientMenu />} />
            <Route path="workouts" element={<WorkoutCalendar />} />
            <Route path="chat" element={<ChatSystem />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
        </Route>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

