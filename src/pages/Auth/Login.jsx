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
    const [syncingProfile, setSyncingProfile] = useState(false); // Novo estado para sensação de sincronia

    const { login, isLoggedIn, role, user } = useAuth(); // Pegando 'user' para garantir que os dados existem
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && role) {
            const roleUpper = role.toUpperCase();
            let targetPath = '/';

            if (roleUpper === 'ADMIN') {
                targetPath = '/admin';
            } else if (roleUpper === 'PACIENTE') {
                targetPath = '/paciente';
            }

            // Pequeno delay para garantir que o Contexto gravou o 'user' no LocalStorage/State
            const timer = setTimeout(() => {
                navigate(targetPath, { replace: true });
            }, 800); 

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, role, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsSubmitting(true); 
        setIsLoading(true); 

        try {
            await login(email, senha);
            // Se chegou aqui, o login deu certo. Ativamos o modo "Sincronizando"
            setSyncingProfile(true); 
        } catch (err) {
            setError(err.message || 'Credenciais inválidas.');
            setIsSubmitting(false); 
            setIsLoading(false); 
        }
    };

    if (isLoggedIn && !syncingProfile) return null;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
             style={{ backgroundColor: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
            
            <div className="card border-0 shadow-lg overflow-hidden animate__animated animate__fadeIn" 
                 style={{ maxWidth: '420px', width: '100%', borderRadius: '24px' }}>
                
                {/* Header Dinâmico */}
                <div className="bg-white p-4 text-center border-bottom position-relative">
                    {syncingProfile && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white" style={{ zIndex: 10 }}>
                             <div className="text-center">
                                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                <span className="fw-black text-primary uppercase tracking-widest" style={{fontSize: '11px'}}>Sincronizando Perfil...</span>
                             </div>
                        </div>
                    )}
                    
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm pulse-blue" style={{ width: '45px', height: '45px' }}>
                            <span className="text-white fw-bold">A</span>
                        </div>
                        <h4 className="mb-0 fw-black text-dark tracking-tighter uppercase">MED<span className="text-primary">ADMIN</span></h4>
                    </div>
                    <p className="text-muted small fw-bold uppercase tracking-wider mb-0" style={{ fontSize: '10px' }}>
                        {syncingProfile ? 'Aguarde a validação de dados' : 'Acesso ao Sistema'}
                    </p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                    {error && (
                        <div className="alert alert-danger border-0 shadow-sm small fw-bold mb-4 py-3 animate__animated animate__shakeX text-center" 
                             style={{ borderRadius: '12px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={syncingProfile ? 'opacity-25' : ''}>
                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>E-mail</label>
                            <input
                                type="email"
                                className="form-control form-control-lg border bg-light shadow-none fw-medium transition-all"
                                style={{ borderRadius: '12px', fontSize: '14px' }}
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={syncingProfile}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Senha</label>
                            <input
                                type="password"
                                className="form-control form-control-lg border bg-light shadow-none fw-medium transition-all"
                                style={{ borderRadius: '12px', fontSize: '14px' }}
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                disabled={syncingProfile}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-black uppercase py-3 shadow-md mb-4 border-0"
                            style={{ borderRadius: '12px', transition: 'all 0.3s ease', letterSpacing: '1px', fontSize: '14px' }}
                            disabled={isSubmitting || syncingProfile}
                        >
                            {isSubmitting ? 'Verificando...' : 'Entrar no Painel'}
                        </button>
                    </form>
                    
                    {!syncingProfile && (
                        <div className="text-center pt-3 border-top">
                            <p className="small fw-bold text-muted mb-0">
                                Novo paciente? <Link to="/register" className="text-primary fw-black text-decoration-none">CRIAR CONTA</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rodapé de Status de Rede (Igual ao Dashboard) */}
            <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3">
                <div className="badge bg-white text-success border shadow-sm p-2 px-3 rounded-pill">
                    <span className="status-dot bg-success me-2"></span>
                    <small className="fw-black uppercase" style={{fontSize: '9px'}}>Rede Protegida</small>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .btn-primary:hover { background: #0056b3; transform: translateY(-2px); box-shadow: 0 8px 15px rgba(13, 110, 253, 0.2); }
                .form-control:focus { border-color: #0d6efd !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.05) !important; }
                
                .status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; position: relative; }
                .status-dot::after {
                    content: ''; width: 100%; height: 100%; background: inherit; border-radius: 50%;
                    position: absolute; animation: pulse 2s infinite; opacity: 0.6;
                }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3); opacity: 0; } }
            `}</style>
        </div>
    );
}

export default Login;