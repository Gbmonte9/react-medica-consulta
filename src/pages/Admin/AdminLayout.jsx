import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

// Definição dos itens de navegação (ITEM NOVO ADICIONADO AQUI)
const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    // 🚨 NOVO ITEM AQUI
    { name: 'Consultas', path: '/admin/consultas', icon: '🗓️' }, 
    { name: 'Médicos', path: '/admin/medicos', icon: '🧑‍⚕️' },
    { name: 'Pacientes', path: '/admin/pacientes', icon: '🧍' },
    { name: 'Histórico', path: '/admin/historico', icon: '📜' },
    { name: 'Relatórios', path: '/admin/relatorios', icon: '📈' },
];

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Componente de Item do Menu
    const NavItem = ({ item }) => {
        // Correção no isActive para garantir que a rota base (admin) não ative outras rotas filhas
        const isActive = location.pathname === item.path || 
                         (item.path !== '/admin' && location.pathname.startsWith(item.path));
        
        // Se a rota for o Dashboard ('/admin'), ele só deve estar ativo se for exatamente '/admin'
        const isDashboardActive = item.path === '/admin' && location.pathname === '/admin';
        
        // Lógica final de Ativo
        const isCurrentlyActive = (item.path === '/admin' ? isDashboardActive : isActive);

        const baseClasses = "flex items-center p-3 my-1 rounded-lg transition-colors duration-200";
        const activeClasses = isCurrentlyActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-200";

        return (
            <Link to={item.path} className={`${baseClasses} ${activeClasses}`}>
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* 1. Barra Lateral (Sidebar) */}
            <aside 
                className={`fixed inset-y-0 left-0 bg-white shadow-xl transition-all duration-300 z-30 
                           ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-hidden md:relative md:translate-x-0`}
            >
                <div className="p-4 border-b h-16 flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-blue-800">
                        {isSidebarOpen ? 'Admin' : 'A'}
                    </h1>
                </div>

                <nav className="p-4 mt-2">
                    {navItems.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>
            </aside>

            {/* 2. Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Cabeçalho Superior */}
                <header className="flex items-center justify-between h-16 bg-white shadow-md p-4 z-20">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="text-gray-600 text-2xl hover:text-blue-600"
                        title="Alternar Menu"
                    >
                        {/* Ícone de Menu */}
                        {isSidebarOpen ? '◀️' : '▶️'} 
                    </button>
                    <div className="text-gray-800">
                        Bem-vindo(a), Administrador!
                    </div>
                </header>

                {/* Área de Rota Filha */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;