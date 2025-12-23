// src/pages/Register.jsx

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
             style={{ backgroundColor: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>
            
            <div className="card border-0 shadow-sm animate__animated animate__fadeIn" 
                 style={{ maxWidth: '480px', width: '100%', borderRadius: '20px', border: '1px solid #dee2e6' }}>
                
                <div className="bg-white p-4 text-center border-bottom">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <span className="text-white fw-bold">A</span>
                        </div>
                        <h4 className="mb-0 fw-black text-dark tracking-tighter uppercase">MED<span className="text-primary">ADMIN</span></h4>
                    </div>
                    <p className="text-muted small fw-bold uppercase tracking-wider mb-0" style={{ fontSize: '10px' }}>Cadastro de Paciente</p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                    {success && (
                        <div className="alert alert-success border-0 fw-bold text-center mb-4 py-3" 
                             style={{ borderRadius: '12px', fontSize: '12px' }}>
                            ✅ Conta criada! Redirecionando...
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger border-0 fw-bold text-center mb-4 py-3 animate__animated animate__shakeX" 
                             style={{ borderRadius: '12px', fontSize: '12px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '10px' }}>Nome Completo</label>
                            <input
                                type="text"
                                className="form-control border bg-light shadow-none fw-medium"
                                style={{ borderRadius: '10px', fontSize: '14px' }}
                                placeholder="Ex: Maria Oliveira"
                                value={name} onChange={(e) => setName(e.target.value)} required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '10px' }}>CPF</label>
                                <input
                                    type="text"
                                    className="form-control border bg-light shadow-none fw-medium"
                                    style={{ borderRadius: '10px', fontSize: '14px' }}
                                    placeholder="000.000.000-00"
                                    value={cpf} onChange={(e) => setCpf(e.target.value)} required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '10px' }}>Telefone</label>
                                <input
                                    type="text"
                                    className="form-control border bg-light shadow-none fw-medium"
                                    style={{ borderRadius: '10px', fontSize: '14px' }}
                                    placeholder="(99) 99999-9999"
                                    value={phone} onChange={(e) => setPhone(e.target.value)} required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '10px' }}>E-mail</label>
                            <input
                                type="email"
                                className="form-control border bg-light shadow-none fw-medium"
                                style={{ borderRadius: '10px', fontSize: '14px' }}
                                placeholder="seu@email.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold uppercase mb-1" style={{ fontSize: '10px' }}>Defina uma Senha</label>
                            <input
                                type="password"
                                className="form-control border bg-light shadow-none fw-medium"
                                style={{ borderRadius: '10px', fontSize: '14px' }}
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-black uppercase py-3 shadow-sm mb-4 border-0"
                            style={{ borderRadius: '12px', transition: 'all 0.3s ease', letterSpacing: '1px', fontSize: '14px' }}
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : 'Finalizar Cadastro'}
                        </button>
                    </form>
                    
                    <div className="text-center pt-3 border-top">
                        <p className="small fw-bold text-muted mb-0">
                            Já possui conta? <Link to="/login" className="text-primary fw-black text-decoration-none">VOLTAR AO LOGIN</Link>
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                .fw-black { font-weight: 900; }
                .btn-primary { background-color: #0d6efd; }
                .btn-primary:hover { background: #0056b3; transform: translateY(-1px); }
                .form-control:focus { border-color: #0d6efd !important; background: #fff !important; }
            `}</style>
        </div>
    );
}

export default Register;