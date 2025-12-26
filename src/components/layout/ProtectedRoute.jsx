// src/components/layout/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente que protege rotas.
 * Verifica se o usuário está logado e se possui o papel (role) necessário.
 * * @param {string} requiredRole 
 * @param {React.ReactNode} children 
 */
const ProtectedRoute = ({ requiredRole, children }) => {
    const { isLoggedIn, role, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="text-center mt-5">Carregando dados de autenticação...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const userRole = role ? role.toUpperCase() : null;
    const required = requiredRole.toUpperCase();

    if (userRole !== required) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Acesso Negado. Você não tem permissão ({required}) para visualizar este recurso.
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;