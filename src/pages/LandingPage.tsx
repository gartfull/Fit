import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Target, Heart, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '../components/ui/card';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleBuyClick = () => {
    alert('Для доступа оплатите курс. Логин и пароль придут на почту.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight">NutriFit</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">О проекте</a>
            <a href="#products" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Продукты</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/login')} className="hidden sm:flex">
              Вход для клиентов
            </Button>
            <Button onClick={() => navigate('/login')} className="sm:hidden" size="sm">
              Вход
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-emerald-600 bg-emerald-100 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 mr-2"></span>
          Набор на новый поток открыт
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Трансформируй свое тело <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
            и измени свою жизнь
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Индивидуальный подход к питанию и тренировкам. Достигайте своих целей под контролем профессионального нутрициолога.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8" onClick={() => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Начать трансформацию
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8" onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Узнать больше
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Почему выбирают нас?</h2>
            <p className="mt-4 text-lg text-slate-500">Системный подход к вашему здоровью и фигуре</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl text-center">
              <div className="mx-auto h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Индивидуальный план</h3>
              <p className="text-slate-500">Питание и тренировки рассчитываются лично под ваши параметры, образ жизни и цели.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Забота о здоровье</h3>
              <p className="text-slate-500">Мы не используем жесткие диеты. Наша цель — привить здоровые привычки навсегда.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl text-center">
              <div className="mx-auto h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ежедневный контроль</h3>
              <p className="text-slate-500">Удобное приложение для отслеживания прогресса, замеров и связи с тренером.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Выберите свой путь</h2>
            <p className="mt-4 text-lg text-slate-500">Программы, которые гарантируют результат</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Product 1 */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">План питания</CardTitle>
                <CardDescription>Идеально для старта</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">1 990 ₽</span>
                  <span className="text-slate-500"> / мес</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Индивидуальный расчет КБЖУ</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> База из 100+ рецептов</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Доступ к приложению</li>
                  <li className="flex items-center opacity-50"><CheckCircle2 className="h-4 w-4 text-slate-300 mr-2" /> Программа тренировок</li>
                  <li className="flex items-center opacity-50"><CheckCircle2 className="h-4 w-4 text-slate-300 mr-2" /> Личный чат с тренером</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={handleBuyClick}>Купить</Button>
              </CardFooter>
            </Card>

            {/* Product 2 */}
            <Card className="flex flex-col border-emerald-500 shadow-lg relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Хит продаж
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Питание + Тренировки</CardTitle>
                <CardDescription>Комплексный подход</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">2 990 ₽</span>
                  <span className="text-slate-500"> / мес</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Индивидуальный расчет КБЖУ</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> База из 100+ рецептов</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Доступ к приложению</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Программа тренировок (зал/дом)</li>
                  <li className="flex items-center opacity-50"><CheckCircle2 className="h-4 w-4 text-slate-300 mr-2" /> Личный чат с тренером</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleBuyClick}>Купить</Button>
              </CardFooter>
            </Card>

            {/* Product 3 */}
            <Card className="flex flex-col bg-slate-900 text-white border-none">
              <CardHeader>
                <CardTitle className="text-xl text-white">VIP Сопровождение</CardTitle>
                <CardDescription className="text-slate-400">Максимальный результат</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">9 990 ₽</span>
                  <span className="text-slate-400"> / мес</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Индивидуальный расчет КБЖУ</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> База из 100+ рецептов</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Доступ к приложению</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Программа тренировок (зал/дом)</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Личный чат с тренером 24/7</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Еженедельные созвоны</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100" onClick={handleBuyClick}>Купить</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Activity className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-bold tracking-tight">NutriFit</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NutriFit. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};
