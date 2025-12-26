// src/components/layout/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

function Header() {
    const { isLoggedIn, user, role, logout } = useAuth();
    const navigate = useNavigate();

    const getDashboardPath = () => {
        if (role) {
            return `/${role.toLowerCase()}`;
        }
        return '/login';
    };

    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                
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
                        
                        {isLoggedIn ? (
                            <>
                               
                                <li className="nav-item me-3 d-flex align-items-center">
                                    <span className="navbar-text">
                                        Bem-vindo, {role} ({user?.email || 'Usuário'})
                                    </span>
                                </li>

                          
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