import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-6xl font-serif text-[#E2B49A] mb-4">404</h1>
      <h2 className="text-2xl font-medium text-slate-800 mb-6 text-center">Страница не найдена</h2>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Возможно, она была удалена, переименована или вы ввели неверный адрес.
      </p>
      <Link to="/app">
        <Button size="lg" className="bg-[#E2B49A] hover:bg-[#d1a389] text-white">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
};
