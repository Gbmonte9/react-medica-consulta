import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { atualizarUsuario } from '../../api/usuarioService';
import Swal from 'sweetalert2';

function PatientPerfil() {
    const { user } = useAuth(); 
    const { setIsLoading } = useLoading();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                email: user.email || '',
                telefone: user.telefone || '',
                cpf: '',
                senha: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?.id) {
            Swal.fire('Erro', 'Sessão inválida.', 'error');
            return;
        }

        try {
            setIsLoading(true);
            const dadosParaEnviar = { ...formData };
            if (!dadosParaEnviar.senha) delete dadosParaEnviar.senha;
            if (!dadosParaEnviar.cpf) delete dadosParaEnviar.cpf;

            await atualizarUsuario(user.id, dadosParaEnviar); 

            Swal.fire({
                icon: 'success',
                title: 'Perfil Atualizado!',
                text: 'Seus dados foram salvos com sucesso.',
                confirmButtonColor: '#0dcaf0'
            });

            setFormData(prev => ({ ...prev, senha: '' }));

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao conectar ao servidor.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn pb-5 px-3 px-md-4">
          
            <div className="mb-4 mb-md-5 text-center text-md-start">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1 fs-2 fs-md-1">Meu Perfil</h2>
                <p className="text-muted small fw-bold uppercase">Gerencie suas informações pessoais.</p>
            </div>

            <div className="row g-4">
            
                <div className="col-12 col-xl-8 order-2 order-xl-1">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white border-top border-info border-5">
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <label className="form-label fw-black uppercase small text-muted">Nome Completo</label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg border-2 bg-light shadow-none fw-bold text-muted fs-6" 
                                            value={formData.nome}
                                            disabled 
                                            style={{ borderRadius: '12px' }}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-black uppercase small text-muted">E-mail</label>
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg border-2 shadow-none fw-bold fs-6" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            style={{ borderRadius: '12px' }}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-black uppercase small text-muted">CPF (Protegido)</label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg border-2 bg-light shadow-none fw-bold text-muted fs-6" 
                                            value={formData.cpf}
                                            placeholder="***.***.***-**"
                                            disabled
                                            style={{ borderRadius: '12px' }}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-black uppercase small text-muted">Telefone</label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg border-2 shadow-none fw-bold fs-6" 
                                            value={formData.telefone}
                                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                            placeholder="(00) 00000-0000"
                                            style={{ borderRadius: '12px' }}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-black uppercase small text-muted">Nova Senha</label>
                                        <input 
                                            type="password" 
                                            className="form-control form-control-lg border-2 shadow-none fw-bold fs-6" 
                                            value={formData.senha}
                                            onChange={(e) => setFormData({...formData, senha: e.target.value})}
                                            placeholder="Manter senha atual"
                                            style={{ borderRadius: '12px' }}
                                        />
                                    </div>
                                </div>

                                <hr className="my-4 opacity-10" />

                                <div className="d-grid d-md-flex justify-content-md-end">
                                    <button type="submit" className="btn btn-info btn-lg text-white fw-black uppercase px-5 py-3 rounded-pill shadow-sm hvr-grow transition-all fs-6">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4 order-1 order-xl-2">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white border-bottom border-info border-5">
                        <div className="py-2 py-md-4">
                            <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-black shadow-sm hvr-grow" 
                                 style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                                {user?.nome?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <h4 className="fw-black text-dark uppercase mb-1 text-truncate px-2">{user?.nome || 'Usuário'}</h4>
                            <div className="mb-3">
                                <span className="badge bg-light text-info border border-info-subtle fw-bold uppercase px-3 py-2" style={{ fontSize: '10px' }}>
                                    PACIENTE ATIVO
                                </span>
                            </div>
                            <p className="text-muted small fw-bold px-3 d-none d-md-block">
                                Membro desde {user?.dataCadastro ? new Date(user.dataCadastro).getFullYear() : '2024'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -0.05em; }
                .text-info { color: #0dcaf0 !important; }
                .bg-info { background-color: #0dcaf0 !important; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .btn-info { background-color: #0dcaf0 !important; border: none; }
                .form-control:focus { border-color: #0dcaf0; box-shadow: none; }
                .hvr-grow { transition: transform 0.2s; }
                .hvr-grow:hover { transform: scale(1.02); }

                @media (max-width: 768px) {
                    .form-control-lg { font-size: 16px !important; }
                    .order-1 { margin-bottom: 1.5rem; }
                }
            `}</style>
        </div>
    );
}

export default PatientPerfil;