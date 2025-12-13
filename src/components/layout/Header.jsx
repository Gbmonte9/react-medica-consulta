// src/components/layout/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importa nosso hook de autenticação

function Header() {
    // 1. Obtém o estado e a função de logout do contexto
    const { isLoggedIn, user, role, logout } = useAuth();
    const navigate = useNavigate();

    // 2. Define o caminho para o Dashboard Principal do usuário
    const getDashboardPath = () => {
        // Se a role for definida, retorna o caminho em minúsculo (ex: '/admin')
        if (role) {
            return `/${role.toLowerCase()}`;
        }
        // Retorna para a raiz/login se a role for null
        return '/login';
    };

    // 3. Lógica para o Logout
    const handleLogout = () => {
        logout(); // Chama a função que limpa o token no localStorage e no estado
        navigate('/login'); // Redireciona o usuário para a tela de login
    };

    // ----------------------------------------------------
    // 4. Renderização (Navbar do Bootstrap)
    // ----------------------------------------------------
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                
                {/* Nome do Sistema e Link Principal */}
                <Link className="navbar-brand" to={isLoggedIn ? getDashboardPath() : '/'}>
                    🏥 Gestão de Consultas
                </Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        
                        {/* 5. Conteúdo Condicional (Apenas se estiver Logado) */}
                        {isLoggedIn ? (
                            <>
                                {/* Item 5a: Informação do Usuário */}
                                <li className="nav-item me-3 d-flex align-items-center">
                                    <span className="navbar-text">
                                        Bem-vindo, {role} ({user?.email || 'Usuário'})
                                    </span>
                                </li>

                                {/* Item 5b: Botão de Logout */}
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-light" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Se não estiver logado, pode mostrar o botão Login/Registro se houver
                            <li className="nav-item">
                                <Link className="btn btn-outline-light" to="/login">
                                    Entrar
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;