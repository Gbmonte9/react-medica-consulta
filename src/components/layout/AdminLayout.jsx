// src/components/layout/AdminLayout.jsx

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Consultas', path: '/admin/consultas', icon: '🗓️' }, 
    { name: 'Médicos', path: '/admin/medicos', icon: '🧑‍⚕️' },
    { name: 'Pacientes', path: '/admin/pacientes', icon: '🧍' },
    { name: 'Histórico', path: '/admin/historico', icon: '📜' },
    { name: 'Relatórios', path: '/admin/relatorios', icon: '📈' },
];

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair do sistema?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Fixa */}
            <aside className="w-64 bg-white shadow-xl flex flex-col z-10">
                <div className="p-4 border-b h-16 flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-blue-800">Admin</h1>
                </div>
                
                <nav className="p-4 space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center p-3 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="mr-3 text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Rodapé da Sidebar com Botão Sair */}
                <div className="p-4 border-t">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        <span className="mr-3 text-xl">🚪</span>
                        <span className="font-semibold">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Área de Conteúdo - Ocupa todo o resto da tela agora sem o Header */}
            <main className="flex-1 overflow-auto p-8 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;