import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); 
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const { login, isLoggedIn, role } = useAuth(); 
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && role) {
            redirecionarPorRole(role);
        }
    }, [isLoggedIn, role]);

    const redirecionarPorRole = (userRole) => {
        if (!userRole) return;
        
        const roleUpper = userRole.toUpperCase();
        let targetPath = '/login';

        if (roleUpper.includes('ADMIN')) {
            targetPath = '/admin';
        } else if (roleUpper.includes('PACIENTE')) {
            targetPath = '/paciente';
        } else if (roleUpper.includes('MEDICO')) {
            targetPath = '/medico';
        }

        setIsLoading(false);
        navigate(targetPath, { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsSubmitting(true); 
        setIsLoading(true); 

        try {

            const result = await login(email, senha);
            
            if (result) {
                const nomeExibicao = result.nome || (result.user && result.user.nome) || 'Usuário';
                
                toast.success(`Bem-vindo, ${nomeExibicao}!`);
                
                redirecionarPorRole(result.role);
            }
        } catch (err) {
            const msgErro = err.message || 'Credenciais inválidas.';
            setError(msgErro);
            toast.error(msgErro);
            setIsSubmitting(false); 
            setIsLoading(false); 
        }
    };

    if (isLoggedIn) return null;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
             style={{ backgroundColor: '#f4f7f6', fontFamily: "'Inter', sans-serif" }}>
            
            <div className="card border-0 shadow-lg overflow-hidden animate__animated animate__zoomIn" 
                 style={{ maxWidth: '420px', width: '100%', borderRadius: '28px' }}>
                
                <div className="bg-white p-5 text-center border-bottom">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                        <div className="bg-dark rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
                             style={{ width: '50px', height: '50px', transform: 'rotate(-10deg)' }}>
                            <span className="text-white fw-black fs-4">+</span>
                        </div>
                        <h3 className="mb-0 fw-black text-dark tracking-tighter">
                            HEALTH<span className="text-primary">SYS</span>
                        </h3>
                    </div>
                    <p className="text-muted small fw-bold uppercase tracking-widest mb-0" style={{ fontSize: '11px' }}>
                        Portal de Saúde Unificado
                    </p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                    {error && (
                        <div className="alert alert-danger border-0 small fw-bold mb-4 py-3 text-center animate__animated animate__shakeX" 
                             style={{ borderRadius: '15px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>E-mail profissional ou pessoal</label>
                            <input
                                type="email"
                                className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                style={{ borderRadius: '14px', fontSize: '15px' }}
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Sua Senha</label>
                            <input
                                type="password"
                                className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                style={{ borderRadius: '14px', fontSize: '15px' }}
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-black uppercase py-3 border-0 shadow-sm transition-all mb-4"
                            style={{ borderRadius: '14px', fontSize: '14px', letterSpacing: '1px' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Validando Acesso...' : 'Entrar no Sistema'}
                        </button>
                    </form>
                    
                    <div className="text-center pt-2">
                        <p className="small fw-bold text-muted mb-2">Ainda não tem cadastro?</p>
                        <Link to="/register" className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-black uppercase" style={{ fontSize: '10px' }}>
                            Criar Conta de Paciente
                        </Link>
                    </div>
                </div>

                <div className="bg-light p-3 text-center border-top">
                    <span className="text-muted fw-bold" style={{ fontSize: '10px' }}>
                        🔒 AMBIENTE CRIPTOGRAFADO E SEGURO
                    </span>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .btn-primary { background: linear-gradient(45deg, #0d6efd, #0056b3); }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(13,110,253,0.3); }
                .form-control:focus { background-color: #fff !important; border-color: #0d6efd; }
            `}</style>
        </div>
    );
}

export default Login;