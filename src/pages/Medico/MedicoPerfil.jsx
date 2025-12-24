// src/pages/Medico/MedicoPerfil.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext'; 
import { atualizarPerfilMedico } from '../../api/medicoService'; 
import Swal from 'sweetalert2'; 

const ESPECIALIDADES = [
    'Psicólogo(a) Clínico', 'Psicólogo(a) Infantil', 'Psiquiatra', 
    'Neuropsicólogo(a)', 'Psicanalista', 'Terapeuta Ocupacional'
];

function MedicoPerfil() {
    // 1. Pegamos o contexto. Se setUser vier indefinido, evitamos o crash.
    const auth = useAuth();
    const user = auth?.user;
    const setUser = auth?.setUser; // Verifique se no seu AuthContext o nome é esse mesmo
    
    const { setIsLoading } = useLoading();
    
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        especialidade: '',
        senha: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                especialidade: user.especialidade || '',
                senha: '' 
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user?.id) return;

        const result = await Swal.fire({
            title: 'Confirmar alterações?',
            text: "Sua especialidade e credenciais de acesso serão atualizadas.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            confirmButtonText: 'Sim, salvar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                // 2. IMPORTANTE: O MedicoCadastroDTO espera "nome" e "email" 
                // para atualizar o usuário vinculado também.
                const dadosParaEnviar = {
                    nome: user.nome,
                    email: user.email,
                    crm: user.crm,
                    especialidade: formData.especialidade
                };

                if (formData.senha && formData.senha.trim() !== "") {
                    dadosParaEnviar.senha = formData.senha;
                }

                const dataAtualizada = await atualizarPerfilMedico(user.id, dadosParaEnviar);
                
                // 3. PROTEÇÃO: Só chama setUser se ele existir
                if (typeof setUser === 'function') {
                    setUser({ ...user, ...dataAtualizada });
                } else {
                    console.error("A função setUser não foi encontrada no AuthContext. Verifique o nome exportado.");
                }

                setIsEditing(false);
                setFormData(prev => ({ ...prev, senha: '' }));
                
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Perfil atualizado com êxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire('Erro!', error.message || 'Não foi possível salvar.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {/* O RESTANTE DO SEU HTML ESTÁ PERFEITO, PODE MANTER IGUAL */}
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    <div className="text-center mb-5">
                        <div className="position-relative d-inline-block">
                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-lg mx-auto" 
                                 style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                                {user?.nome?.charAt(0).toUpperCase() || '?'}
                            </div>
                        </div>
                        <h2 className="fw-black text-dark tracking-tighter mt-3 mb-1">
                            Dr(a). {user?.nome || 'Médico'}
                        </h2>
                        <p className="text-success fw-bold text-uppercase small tracking-widest">
                            {formData.especialidade || 'Clínica Geral'} • CRM {user?.crm}
                        </p>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold text-dark">Configurações da Conta</h5>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(!isEditing)} 
                                className={`btn btn-sm rounded-pill px-4 fw-bold ${isEditing ? 'btn-light border' : 'btn-outline-success'}`}
                            >
                                {isEditing ? 'Cancelar' : 'Editar Dados'}
                            </button>
                        </div>
                        
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSave}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">Nome Completo</label>
                                        <input type="text" className="form-control bg-light border-0 fw-medium text-secondary" value={user?.nome || ''} readOnly />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">CRM / Registro</label>
                                        <input type="text" className="form-control bg-light border-0 fw-medium text-secondary" value={user?.crm || ''} readOnly />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">Especialidade Atual</label>
                                        {isEditing ? (
                                            <select 
                                                name="especialidade"
                                                className="form-select border-2 border-success"
                                                value={formData.especialidade}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecione...</option>
                                                {ESPECIALIDADES.map(esp => (
                                                    <option key={esp} value={esp}>{esp}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input type="text" className="form-control bg-light border-0 fw-medium text-secondary" value={formData.especialidade} readOnly />
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">E-mail Profissional</label>
                                        <input type="email" className="form-control bg-light border-0 fw-medium text-secondary" value={user?.email || ''} readOnly />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label text-muted small fw-bold text-uppercase">Alterar Senha de Acesso</label>
                                        <div className="position-relative">
                                            <input 
                                                name="senha"
                                                type={showPassword ? "text" : "password"} 
                                                className={`form-control border-2 ${!isEditing ? 'bg-light border-0 text-muted' : 'bg-white border-success'}`} 
                                                placeholder={isEditing ? "Deixe em branco para manter a atual" : "••••••••"}
                                                value={formData.senha}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                            />
                                            {isEditing && (
                                                <button 
                                                    type="button"
                                                    className="btn position-absolute end-0 top-0 border-0 text-success fw-bold"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? "🙈" : "👁️"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-5 d-grid animate__animated animate__fadeInUp">
                                        <button type="submit" className="btn btn-success btn-lg fw-black text-uppercase py-3 rounded-4 shadow">
                                            Salvar Alterações
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
            `}</style>
        </div>
    );
}

export default MedicoPerfil;