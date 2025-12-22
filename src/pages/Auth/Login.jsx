// src/pages/Auth/Login.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext'; 
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); 
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const { login, isLoggedIn, role } = useAuth();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    // ----------------------------------------------------
    // Efeito: Redirecionamento automático se já estiver logado
    // ----------------------------------------------------
    useEffect(() => {
        if (isLoggedIn) {
            // Se for ADMIN, redireciona para a rota protegida /admin
            const targetPath = role?.toUpperCase() === 'ADMIN' ? '/admin' : '/';
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
        setIsLoading(true); 

        try {
            await login(email, senha);
        } catch (err) {
            setError(err.message || 'Erro de conexão ou credenciais inválidas.');
        } finally {
            setIsSubmitting(false); 
            setIsLoading(false); 
        }
    };

    if (isLoggedIn) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
                <h4>Redirecionando...</h4>
            </div>
        );
    }

    // ----------------------------------------------------
    // 3. Renderização
    // ----------------------------------------------------
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card bg-dark text-white border-secondary shadow-lg">
                        <div className="card-header border-secondary text-center py-3">
                            <h4 className="mb-0">Acesso ao Sistema</h4>
                        </div>
                        <div className="card-body p-4">
                            
                            {/* Exibe a mensagem de erro vinda do Backend */}
                            {error && (
                                <div className="alert alert-danger text-center animate__animated animate__shakeX" role="alert">
                                    <small>{error}</small>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Campo E-mail */}
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control bg-secondary text-white border-0"
                                        id="emailInput"
                                        placeholder="exemplo@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                {/* Campo Senha */}
                                <div className="mb-3">
                                    <label htmlFor="senhaInput" className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control bg-secondary text-white border-0"
                                        id="senhaInput"
                                        placeholder="Digite sua senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                {/* Botão de Submissão */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-bold"
                                    disabled={isSubmitting} 
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Entrando...
                                        </>
                                    ) : 'Entrar'}
                                </button>
                            </form>
                            
                            <div className="mt-4 text-center border-top border-secondary pt-3">
                                <p className="mb-0 text-secondary">
                                    Não tem uma conta? <Link to="/register" className="text-info fw-bold text-decoration-none">Crie uma agora</Link>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;