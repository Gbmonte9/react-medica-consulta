import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext'; 
import { atualizarPerfilMedico } from '../../api/medicoService'; 
import { User, Mail, Shield, Award, Eye, EyeOff, Check } from 'lucide-react';
import Swal from 'sweetalert2'; 

const ESPECIALIDADES = [
    'Psicólogo(a) Clínico', 'Psicólogo(a) Infantil', 'Psiquiatra', 
    'Neuropsicólogo(a)', 'Psicanalista', 'Terapeuta Ocupacional'
];

function MedicoPerfil() {
    const auth = useAuth();
    const user = auth?.user;
    const setUser = auth?.setUser; 
    
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
            title: 'Confirmar?',
            text: "Deseja atualizar seus dados profissionais?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Sim, salvar'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                const dadosParaEnviar = {
                    nome: user.nome,
                    email: user.email,
                    crm: user.crm,
                    especialidade: formData.especialidade
                };

                if (formData.senha?.trim()) {
                    dadosParaEnviar.senha = formData.senha;
                }

                const dataAtualizada = await atualizarPerfilMedico(user.id, dadosParaEnviar);
                
                if (typeof setUser === 'function') {
                    setUser({ ...user, ...dataAtualizada });
                }

                setIsEditing(false);
                setFormData(prev => ({ ...prev, senha: '' }));
                Swal.fire('Sucesso!', 'Perfil atualizado.', 'success');
            } catch (error) {
                Swal.fire('Erro!', error.message || 'Erro ao salvar.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container-fluid py-3 px-2 px-md-4 animate__animated animate__fadeIn">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                    
                    <div className="text-center mb-4">
                        <div className="position-relative d-inline-block">
                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-lg mx-auto profile-avatar">
                                {user?.nome?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-sm border text-success d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                <Check size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <h2 className="fw-black text-dark tracking-tighter mt-3 mb-1 fs-3">
                            Dr(a). {user?.nome || 'Médico'}
                        </h2>
                        <span className="badge bg-success-subtle text-success text-uppercase px-3 py-2 rounded-pill small fw-bold">
                            CRM {user?.crm}
                        </span>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                        <div className="card-header bg-white border-bottom p-3 p-md-4 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <Shield className="text-success" size={20} />
                                <h5 className="mb-0 fw-black text-dark small text-uppercase">Dados da Conta</h5>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(!isEditing)} 
                                className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${isEditing ? 'btn-light border' : 'btn-success'}`}
                            >
                                {isEditing ? 'Cancelar' : 'Editar Perfil'}
                            </button>
                        </div>
                        
                        <div className="card-body p-3 p-md-4">
                            <form onSubmit={handleSave}>
                                <div className="row g-3 g-md-4">
                                    
                                    <div className="col-12 col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                                            <User size={14} /> Nome Completo
                                        </label>
                                        <input type="text" className="form-control-plaintext bg-light px-3 rounded-3 fw-medium text-dark border-0 py-2" value={user?.nome || ''} readOnly />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                                            <Mail size={14} /> E-mail
                                        </label>
                                        <input type="text" className="form-control-plaintext bg-light px-3 rounded-3 fw-medium text-dark border-0 py-2" value={user?.email || ''} readOnly />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                                            <Award size={14} /> Especialidade Clínica
                                        </label>
                                        {isEditing ? (
                                            <select 
                                                name="especialidade"
                                                className="form-select border-2 border-success rounded-3 py-2"
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
                                            <div className="bg-light px-3 py-2 rounded-3 text-dark fw-bold">{formData.especialidade}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-2">
                                            <Shield size={14} /> Senha de Acesso
                                        </label>
                                        <div className="position-relative">
                                            <input 
                                                name="senha"
                                                type={showPassword ? "text" : "password"} 
                                                className={`form-control border-2 rounded-3 py-2 ${!isEditing ? 'bg-light border-0' : 'bg-white border-success'}`} 
                                                placeholder={isEditing ? "Nova senha ou deixe em branco" : "••••••••"}
                                                value={formData.senha}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                            />
                                            {isEditing && (
                                                <button 
                                                    type="button"
                                                    className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-success"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-4 animate__animated animate__fadeInUp">
                                        <button type="submit" className="btn btn-success w-100 py-3 fw-black text-uppercase rounded-4 shadow">
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
                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    font-size: 2.5rem;
                }
                .bg-success-subtle { background-color: #e8f5e9; }
                .transition-all { transition: all 0.3s ease; }
                
                @media (min-width: 768px) {
                    .profile-avatar {
                        width: 120px;
                        height: 120px;
                        font-size: 3rem;
                    }
                }

                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.1);
                    border-color: #198754;
                }
            `}</style>
        </div>
    );
}

export default MedicoPerfil;