// src/components/layout/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importa nosso hook de autenticação

/**
 * Componente que protege rotas.
 * Verifica se o usuário está logado e se possui o papel (role) necessário.
 * * @param {string} requiredRole - O papel necessário para acessar esta rota ('ADMIN', 'MEDICO', 'PACIENTE').
 * @param {React.ReactNode} children - O componente que será renderizado se o acesso for permitido.
 */
const ProtectedRoute = ({ requiredRole, children }) => {
    // 1. Obtém o estado de autenticação
    const { isLoggedIn, role, isLoading } = useAuth();
    
    // 2. Se o contexto ainda está checando o token inicial, mostra um spinner
    if (isLoading) {
        // Você pode usar aqui um componente de spinner ou um layout simples do Bootstrap
        return <div className="text-center mt-5">Carregando dados de autenticação...</div>;
    }

    // 3. Se o usuário NÃO está logado, redireciona para a tela de Login
    if (!isLoggedIn) {
        // Redireciona o usuário para a página de login
        return <Navigate to="/login" replace />;
    }

    // 4. Se o usuário está logado, verifica o papel (Role-Based Access Control)
    // Converte para maiúsculas para garantir a comparação correta
    const userRole = role ? role.toUpperCase() : null;
    const required = requiredRole.toUpperCase();

    if (userRole !== required) {
        // Se o papel do usuário não corresponde ao papel exigido pela rota, 
        // mostra uma mensagem de acesso negado ou redireciona para uma tela segura.

        // OBS: Você pode redirecionar para uma página de erro 403 (Acesso Negado)
        // Por enquanto, vamos mostrar uma mensagem simples:
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Acesso Negado. Você não tem permissão ({required}) para visualizar este recurso.
                </div>
                {/* Opcionalmente, pode redirecionar para o Dashboard padrão do usuário */}
                {/* <Navigate to={`/${userRole.toLowerCase()}`} replace /> */}
            </div>
        );
    }

    // 5. Se tudo estiver correto (Logado E Papel Ok), renderiza o componente filho (Dashboard)
    return children;
};

export default ProtectedRoute;