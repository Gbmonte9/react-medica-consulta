// src/pages/Auth/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { criarPaciente } from '../../api/pacienteService';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState(''); 
    const [phone, setPhone] = useState(''); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            await criarPaciente({ nome: name, email, senha: password, cpf, telefone: phone }); 
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Erro ao criar conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 py-5" 
             style={{ backgroundColor: '#f4f7f6', fontFamily: "'Inter', sans-serif" }}>
            
            <div className="card border-0 shadow-lg animate__animated animate__fadeInUp" 
                 style={{ maxWidth: '500px', width: '100%', borderRadius: '28px', overflow: 'hidden' }}>
                
                <div className="bg-white p-4 p-md-5 text-center border-bottom">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <div className="bg-dark rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
                             style={{ width: '45px', height: '45px', transform: 'rotate(-10deg)' }}>
                            <span className="text-white fw-black fs-5">+</span>
                        </div>
                        <h3 className="mb-0 fw-black text-dark tracking-tighter">
                            HEALTH<span className="text-primary">SYS</span>
                        </h3>
                    </div>
                    <p className="text-muted small fw-bold uppercase tracking-widest mb-0" style={{ fontSize: '10px' }}>
                        Crie sua conta de Paciente
                    </p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                    {success && (
                        <div className="alert alert-success border-0 fw-bold text-center mb-4 py-3 animate__animated animate__bounceIn" 
                             style={{ borderRadius: '15px', fontSize: '13px' }}>
                            ✅ Conta criada com sucesso! <br/>
                            <small className="fw-normal">Redirecionando para o login...</small>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger border-0 fw-bold text-center mb-4 py-3 animate__animated animate__shakeX" 
                             style={{ borderRadius: '15px', fontSize: '13px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Nome Completo</label>
                            <input
                                type="text"
                                className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                style={{ borderRadius: '14px', fontSize: '15px' }}
                                placeholder="Ex: Maria Oliveira"
                                value={name} onChange={(e) => setName(e.target.value)} required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>CPF</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                    style={{ borderRadius: '14px', fontSize: '15px' }}
                                    placeholder="000.000.000-00"
                                    value={cpf} onChange={(e) => setCpf(e.target.value)} required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Telefone</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                    style={{ borderRadius: '14px', fontSize: '15px' }}
                                    placeholder="(99) 99999-9999"
                                    value={phone} onChange={(e) => setPhone(e.target.value)} required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>E-mail pessoal</label>
                            <input
                                type="email"
                                className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                style={{ borderRadius: '14px', fontSize: '15px' }}
                                placeholder="seu@email.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '11px' }}>Defina uma Senha Segura</label>
                            <input
                                type="password"
                                className="form-control form-control-lg border-2 bg-light shadow-none fw-medium"
                                style={{ borderRadius: '14px', fontSize: '15px' }}
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-black uppercase py-3 border-0 shadow-sm transition-all mb-4"
                            style={{ borderRadius: '14px', fontSize: '14px', letterSpacing: '1px' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            ) : null}
                            {loading ? 'Processando...' : 'Finalizar Cadastro'}
                        </button>
                    </form>
                    
                    <div className="text-center pt-3 border-top">
                        <p className="small fw-bold text-muted mb-0">
                            Já possui uma conta? <Link to="/login" className="text-primary fw-black text-decoration-none">VOLTAR AO LOGIN</Link>
                        </p>
                    </div>
                </div>

                <div className="bg-light p-3 text-center border-top">
                    <span className="text-muted fw-bold" style={{ fontSize: '10px' }}>
                        ✅ SEUS DADOS ESTÃO PROTEGIDOS (LGPD)
                    </span>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .btn-primary { background: linear-gradient(45deg, #0d6efd, #0056b3); }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(13,110,253,0.3); }
                .form-control:focus { background-color: #fff !important; border-color: #0d6efd; }
                .animate__animated.animate__fadeInUp { --animate-duration: 0.6s; }
            `}</style>
        </div>
    );
}

export default Register;