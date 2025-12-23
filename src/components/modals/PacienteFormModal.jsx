import React, { useState, useEffect } from 'react';

function PacienteFormModal({ isOpen, paciente, onClose, onSave }) {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', cpf: '', telefone: '' });

    useEffect(() => {
        if (paciente) {
            setFormData({
                nome: paciente.nomeUsuario || '', 
                email: paciente.emailUsuario || '',
                telefone: paciente.telefone || '',
                senha: '', 
                cpf: '' 
            });
        } else {
            setFormData({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
        }
    }, [paciente, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    
                    {/* Header do Modal */}
                    <div className="modal-header bg-white border-bottom-0 pt-4 px-4">
                        <h5 className="modal-title fw-black text-uppercase tracking-tighter">
                            {paciente ? 'Editar' : 'Novo'} <span className="text-primary">Paciente</span>
                        </h5>
                        <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 pb-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Nome Completo</label>
                                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-control rounded-3 p-2 bg-light border-0 shadow-none" required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">CPF</label>
                                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="form-control rounded-3 p-2 bg-light border-0 shadow-none" placeholder={paciente ? "Inalterado" : "000.000.000-00"} required={!paciente} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Telefone</label>
                                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="form-control rounded-3 p-2 bg-light border-0 shadow-none" />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Email Profissional</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control rounded-3 p-2 bg-light border-0 shadow-none" required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold small text-uppercase text-muted">
                                        Senha {paciente && <span className="text-primary fs-small fw-normal">(Opcional)</span>}
                                    </label>
                                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} className="form-control rounded-3 p-2 bg-light border-0 shadow-none" required={!paciente} placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        {/* Footer do Modal */}
                        <div className="modal-footer bg-light border-0 px-4 py-3">
                            <button type="button" onClick={onClose} className="btn btn-link text-muted fw-bold text-decoration-none uppercase small">Cancelar</button>
                            <button type="submit" className="btn btn-primary rounded-3 px-4 fw-black uppercase shadow-sm">
                                {paciente ? 'Salvar Alterações' : 'Criar Conta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PacienteFormModal;