import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Refrigerator, User } from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import Recipes from './pages/Recipes';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import Nutrition from './pages/Nutrition';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/recipes', label: '食谱', icon: BookOpen },
    { path: '/inventory', label: '冰箱', icon: Refrigerator },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen bg-stone-50 text-stone-900 font-sans">
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto h-full bg-white shadow-sm">
          {children}
        </div>
      </main>
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-stone-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes/*" element={<Recipes />} />
          <Route path="/inventory/*" element={<Inventory />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Routes>
      </Layout>
    </Router>
  );
}
