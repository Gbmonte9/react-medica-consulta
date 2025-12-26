import React, { useState, useEffect } from 'react';

const ESPECIALIDADES = [
    'Psicólogo(a) Clínico', 'Psicólogo(a) Infantil', 'Psiquiatra', 
    'Neuropsicólogo(a)', 'Psicanalista', 'Terapeuta Ocupacional'
];

function MedicoFormModal({ isOpen, medico, onClose, onSave }) {
    const [formData, setFormData] = useState({ 
        nome: '', 
        email: '', 
        senha: '', 
        crm: '', 
        especialidade: ESPECIALIDADES[0],
        telefone: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (medico) {
                setFormData({
                    nome: medico.nome || '',
                    email: medico.email || '',
                    senha: '', 
                    crm: medico.crm || '', 
                    especialidade: medico.especialidade || ESPECIALIDADES[0],
                    telefone: medico.telefone || ''
                });
            } else {
                setFormData({ 
                    nome: '', 
                    email: '', 
                    senha: '', 
                    crm: '', 
                    especialidade: ESPECIALIDADES[0],
                    telefone: ''
                });
            }
        }
    }, [medico, isOpen]);

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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    
                    <div className="modal-header bg-white border-0 pt-4 px-4">
                        <h5 className="modal-title fw-black text-uppercase tracking-tighter">
                            {medico ? 'Atualizar' : 'Cadastrar'} <span className="text-primary">Especialista</span>
                        </h5>
                        <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4">
                            <div className="row g-3">
                                <div className="col-md-8">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Nome do Profissional</label>
                                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-control rounded-3 border-0 bg-light p-2 shadow-none" required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold small text-uppercase text-muted">CRM / CRP</label>
                                    <input 
                                        type="text" 
                                        name="crm" 
                                        value={formData.crm} 
                                        onChange={handleChange} 
                                        className="form-control rounded-3 border-0 bg-light p-2 shadow-none" 
                                        required 
                                        placeholder="000000/UF"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">Especialidade</label>
                                    <select name="especialidade" value={formData.especialidade} onChange={handleChange} className="form-select rounded-3 border-0 bg-light p-2 shadow-none" required>
                                        {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase text-muted">E-mail de Acesso</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control rounded-3 border-0 bg-light p-2 shadow-none" required />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted">
                                        Senha de Segurança {medico && <span className="text-primary fw-normal small">(Deixe em branco para não alterar)</span>}
                                    </label>
                                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} className="form-control rounded-3 border-0 bg-light p-2 shadow-none" required={!medico} placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0 px-4 py-3">
                            <button type="button" onClick={onClose} className="btn btn-link text-muted fw-bold text-decoration-none uppercase small">Descartar</button>
                            <button type="submit" className="btn btn-primary rounded-3 px-5 fw-black uppercase shadow-sm">
                                {medico ? 'Salvar Mudanças' : 'Confirmar Cadastro'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MedicoFormModal;