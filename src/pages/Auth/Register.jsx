// src/pages/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { criarPaciente } from '../../api/pacienteService'; // Importação CORRETA

function Register() {
    // 1. Estado de Formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState(''); 
    const [phone, setPhone] = useState(''); 
    
    // 2. Estado de Carregamento/Resposta
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    // ----------------------------------------------------
    // Função: Submissão do Registro
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            // 🚨 CORREÇÃO APLICADA: Chamando criarPaciente
            await criarPaciente({ 
                nome: name, 
                email: email, 
                senha: password, 
                cpf: cpf, 
                telefone: phone 
            }); 
            
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------
    // 3. Renderização
    // ----------------------------------------------------
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card bg-dark text-white border-primary p-4 shadow">
                        <h2 className="text-center mb-4">Criar Conta (Paciente)</h2>
                        
                        {success && <div className="alert alert-success">Conta criada com sucesso! Redirecionando...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            
                            {/* Campo Nome */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {/* Campo Email */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {/* Campo CPF */}
                            <div className="mb-3">
                                <label htmlFor="cpf" className="form-label">CPF</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="cpf"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {/* CAMPO TELEFONE */}
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Telefone (Ex: 99 99999-9999)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {/* Campo Senha */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? 'Criando...' : 'Registrar'}
                            </button>
                        </form>
                        
                        <div className="mt-3 text-center">
                            <p>Já tem uma conta? <Link to="/login" className="text-decoration-none text-info">Fazer Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;