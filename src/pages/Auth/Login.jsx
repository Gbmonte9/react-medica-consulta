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

    // Efeito de Redirecionamento - O coração do login funcional
    useEffect(() => {
        if (isLoggedIn && role) {
            const roleUpper = role.toUpperCase();
            let targetPath = '/';

            if (roleUpper.includes('ADMIN')) {
                targetPath = '/admin';
            } else if (roleUpper.includes('PACIENTE')) {
                targetPath = '/paciente';
            }

            // Redireciona imediatamente assim que detecta o login
            setIsLoading(false);
            navigate(targetPath, { replace: true });
        }
    }, [isLoggedIn, role, navigate, setIsLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsSubmitting(true); 
        setIsLoading(true); 

        try {
            await login(email, senha);
            // Ao ter sucesso, o useEffect acima será disparado automaticamente
        } catch (err) {
            setError(err.message || 'Credenciais inválidas.');
            setIsSubmitting(false); 
            setIsLoading(false); 
        }
    };

    // Impede o formulário de aparecer se já estivermos logados
    if (isLoggedIn) return null;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
             style={{ backgroundColor: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
            
            <div className="card border-0 shadow-lg overflow-hidden" 
                 style={{ maxWidth: '420px', width: '100%', borderRadius: '24px' }}>
                
                <div className="bg-white p-4 text-center border-bottom">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px' }}>
                            <span className="text-white fw-bold">A</span>
                        </div>
                        <h4 className="mb-0 fw-black text-dark uppercase">MED<span className="text-primary">ADMIN</span></h4>
                    </div>
                    <p className="text-muted small fw-bold uppercase tracking-wider mb-0" style={{ fontSize: '10px' }}>
                        Acesso ao Sistema
                    </p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                    {error && (
                        <div className="alert alert-danger border-0 small fw-bold mb-4 py-3 text-center" 
                             style={{ borderRadius: '12px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>E-mail</label>
                            <input
                                type="email"
                                className="form-control form-control-lg border bg-light shadow-none fw-medium"
                                style={{ borderRadius: '12px', fontSize: '14px' }}
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Senha</label>
                            <input
                                type="password"
                                className="form-control form-control-lg border bg-light shadow-none fw-medium"
                                style={{ borderRadius: '12px', fontSize: '14px' }}
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-black uppercase py-3 border-0"
                            style={{ borderRadius: '12px', fontSize: '14px', letterSpacing: '1px' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verificando...' : 'Entrar no Painel'}
                        </button>
                    </form>
                    
                    <div className="text-center pt-3 border-top">
                        <p className="small fw-bold text-muted mb-0">
                            Novo paciente? <Link to="/register" className="text-primary fw-black text-decoration-none">CRIAR CONTA</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .btn-primary:hover { background: #0056b3; transform: translateY(-2px); }
            `}</style>
        </div>
    );
}

export default Login;