import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import Swal from 'sweetalert2';

function PatientPerfil() {
    const { user } = useAuth(); // Pegamos os dados do usuário logado do contexto
    const { setIsLoading } = useLoading();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        senha: '' // Campo opcional para alteração de senha
    });

    // Carrega os dados do usuário no formulário ao abrir a página
    useEffect(() => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                email: user.email || '',
                cpf: user.cpf || '',
                telefone: user.telefone || '',
                senha: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            // Aqui você chamaria o pacienteService.atualizarPerfil(formData)
            // Exemplo fictício de sucesso:
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            Swal.fire({
                icon: 'success',
                title: 'Perfil Atualizado!',
                text: 'Seus dados foram salvos com sucesso.',
                confirmButtonColor: '#0dcaf0'
            });
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível atualizar o perfil.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-5">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">Meu Perfil</h2>
                <p className="text-muted small fw-bold uppercase">Gerencie suas informações pessoais e de contato.</p>
            </div>

            <div className="row g-4">
                {/* CARD DE INFORMAÇÕES PESSOAIS */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none fw-bold" 
                                        value={formData.nome}
                                        disabled // Nome geralmente não se altera sem suporte
                                        style={{ borderRadius: '12px' }}
                                    />
                                    <small className="text-muted">Para alterar o nome, entre em contato com a administração.</small>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">E-mail</label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">CPF</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none fw-bold" 
                                        value={formData.cpf}
                                        disabled
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">Telefone / WhatsApp</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold" 
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                        placeholder="(00) 00000-0000"
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">Nova Senha (Deixe em branco para manter)</label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold" 
                                        value={formData.senha}
                                        onChange={(e) => setFormData({...formData, senha: e.target.value})}
                                        placeholder="••••••••"
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-info btn-lg text-white fw-black uppercase px-5 py-3 rounded-pill shadow-sm">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* CARD LATERAL DE RESUMO */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <div className="mb-4">
                            <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-black" 
                                 style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                {user?.nome?.charAt(0)}
                            </div>
                            <h5 className="fw-black text-dark uppercase mb-1">{user?.nome}</h5>
                            <span className="badge bg-light text-muted border fw-bold uppercase px-3 py-2">PACIENTE ATIVO</span>
                        </div>
                        
                        <div className="text-start mt-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="text-info">📧</span>
                                <small className="fw-bold text-muted">{user?.email}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-info">📞</span>
                                <small className="fw-bold text-muted">{user?.telefone || 'Não informado'}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .text-info { color: #0dcaf0 !important; }
                .btn-info { background-color: #0dcaf0 !important; border: none; }
                .btn-info:hover { background-color: #0bb5d8 !important; transform: translateY(-2px); }
                .form-control:focus { border-color: #0dcaf0 !important; }
            `}</style>
        </div>
    );
}

export default PatientPerfil;