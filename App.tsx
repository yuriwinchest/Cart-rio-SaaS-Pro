import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Atendimentos from './pages/Atendimentos';
import Financeiro from './pages/Financeiro';
import Documentos from './pages/Documentos';
import Servicos from './pages/Servicos';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

const SidebarItem = ({ to, icon, label, active, onClick }: { to: string; icon: string; label: string; active: boolean; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={`material-symbols-outlined ${active ? 'fill' : ''}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
               <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">Cartório SaaS</h1>
              <p className="text-xs text-slate-500">Painel de Gestão</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Principal</p>
          <SidebarItem to="/" icon="dashboard" label="Dashboard" active={path === '/'} onClick={closeSidebar} />
          <SidebarItem to="/atendimentos" icon="groups" label="Atendimentos" active={path === '/atendimentos'} onClick={closeSidebar} />
          
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Gestão</p>
          <SidebarItem to="/financeiro" icon="payments" label="Financeiro" active={path === '/financeiro'} onClick={closeSidebar} />
          <SidebarItem to="/documentos" icon="folder_open" label="Documentos" active={path === '/documentos'} onClick={closeSidebar} />
          <SidebarItem to="/servicos" icon="description" label="Serviços e Atos" active={path === '/servicos'} onClick={closeSidebar} />
          
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Sistema</p>
          <SidebarItem to="/usuarios" icon="manage_accounts" label="Usuários" active={path === '/usuarios'} onClick={closeSidebar} />
          <SidebarItem to="/configuracoes" icon="settings" label="Configurações" active={path === '/configuracoes'} onClick={closeSidebar} />
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
             <div className="size-9 rounded-full bg-gray-200 bg-[url('https://i.pravatar.cc/150?u=a042581f4e29026024d')] bg-cover bg-center shrink-0"></div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-slate-900 truncate">Ana Rodrigues</p>
               <p className="text-xs text-slate-500 truncate">Administradora</p>
             </div>
             <Link to="/login" className="text-slate-400 hover:text-red-500">
               <span className="material-symbols-outlined">logout</span>
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined">menu</span>
             </button>
             <div className="relative w-full max-w-md hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar em todo o sistema..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                />
             </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
             <button className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined">search</span>
             </button>
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined">apps</span>
             </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/atendimentos" element={<Layout><Atendimentos /></Layout>} />
        <Route path="/financeiro" element={<Layout><Financeiro /></Layout>} />
        <Route path="/documentos" element={<Layout><Documentos /></Layout>} />
        <Route path="/servicos" element={<Layout><Servicos /></Layout>} />
        <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}