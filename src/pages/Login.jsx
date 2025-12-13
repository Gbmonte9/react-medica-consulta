// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Importamos o 'Link'

function Login() {
    // 1. Estado local para inputs e mensagens de erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // 2. Hooks para acesso ao contexto e navegação
    const { login, isLoggedIn, role } = useAuth();
    const navigate = useNavigate();

    // ----------------------------------------------------
    // Efeito: Redirecionamento automático se já estiver logado
    // ----------------------------------------------------
    useEffect(() => {
        if (isLoggedIn) {
            // Redireciona para o dashboard correto baseado no papel (role)
            const targetPath = role ? `/${role.toLowerCase()}` : '/';
            navigate(targetPath, { replace: true });
        }
    }, [isLoggedIn, role, navigate]); 

    // ----------------------------------------------------
    // Função: Submissão do Formulário
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsSubmitting(true); 

        try {
            await login(email, password);
            // Se o login for bem-sucedido, o useEffect acima fará o redirecionamento
        } catch (err) {
            // Captura o erro, incluindo a mensagem 'API desconectada'
            setError(err.message || 'Erro de conexão ou credenciais inválidas.');
        } finally {
            setIsSubmitting(false); 
        }
    };

    // Se o usuário já estiver logado, retorna um indicador de redirecionamento.
    if (isLoggedIn) {
        return <div className="text-center mt-5 text-white">Redirecionando...</div>;
    }

    // ----------------------------------------------------
    // 3. Renderização (Utilizando classes Bootstrap)
    // ----------------------------------------------------
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card bg-dark text-white border-secondary">
                        <div className="card-header border-secondary text-center">
                            <h4>Acesso - Gestão de Consultas</h4>
                        </div>
                        <div className="card-body">
                            
                            {/* Exibe a mensagem de erro da API */}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Campo E-mail */}
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="emailInput"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Campo Senha */}
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Botão de Submissão */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting} 
                                >
                                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                            
                            {/* 🚨 NOVO: Link para a Tela de Registro */}
                            <div className="mt-3 text-center">
                                <p className="mb-0">Não tem uma conta? <Link to="/register" className="text-decoration-none text-info">Crie uma agora</Link></p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;