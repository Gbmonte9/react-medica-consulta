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
        cpf: '',    // Ficará em branco no estado inicial
        telefone: '',
        senha: ''   // Ficará em branco no estado inicial
    });

    // Sincroniza apenas os dados editáveis e visíveis
    useEffect(() => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                email: user.email || '',
                telefone: user.telefone || '',
                cpf: '',   // DEIXADO EM BRANCO (O usuário sabe que já está cadastrado)
                senha: ''  // DEIXADO EM BRANCO (Só preenche se for alterar)
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
            
            // Criamos um objeto apenas com o que o backend precisa processar
            const dadosParaEnviar = { ...formData };
            
            // Se a senha estiver vazia, removemos do objeto para o Java não tentar alterar
            if (!dadosParaEnviar.senha) delete dadosParaEnviar.senha;
            // Se o CPF estiver vazio (já que está bloqueado), removemos para não sobrescrever com vazio
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
        <div className="animate__animated animate__fadeIn">
            <div className="mb-5">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">Meu Perfil</h2>
                <p className="text-muted small fw-bold uppercase">Gerencie suas informações pessoais.</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none fw-bold text-muted" 
                                        value={formData.nome}
                                        disabled 
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">E-mail</label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        style={{ borderRadius: '12px' }}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">CPF (Protegido)</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none fw-bold text-muted" 
                                        value={formData.cpf}
                                        placeholder="***.***.***-**"
                                        disabled
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label className="form-label fw-black uppercase small text-muted">Telefone</label>
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
                                    <label className="form-label fw-black uppercase small text-muted">Nova Senha</label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold" 
                                        value={formData.senha}
                                        onChange={(e) => setFormData({...formData, senha: e.target.value})}
                                        placeholder="DEIXE EM BRANCO PARA MANTER"
                                        style={{ borderRadius: '12px' }}
                                    />
                                </div>
                            </div>

                            <hr className="my-4 opacity-10" />

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-info btn-lg text-white fw-black uppercase px-5 py-3 rounded-pill shadow-sm transition-all">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                        <div className="mb-4">
                            <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-black shadow-sm" 
                                 style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                {user?.nome?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <h5 className="fw-black text-dark uppercase mb-1">{user?.nome || 'Usuário'}</h5>
                            <span className="badge bg-light text-info border border-info-subtle fw-bold uppercase px-3 py-2" style={{ fontSize: '10px' }}>
                                PACIENTE ATIVO
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientPerfil;