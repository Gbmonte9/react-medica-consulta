import React, { useState, useEffect } from 'react';
import { listarMedicos, removerMedico, criarMedico, atualizarMedico } from '../../api/medicoService'; 
import MedicoFormModal from '../../components/modals/MedicoFormModal'; 
import { toast } from 'react-toastify';

function AdminMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoEditando, setMedicoEditando] = useState(null); 

    const fetchMedicos = async () => {
        try {
            setLoading(true);
            const data = await listarMedicos();
            setMedicos(data);
        } catch (err) {
            toast.error(err.message || 'Erro ao carregar médicos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedicos(); }, []);

    const handleNovo = () => { 
        setMedicoEditando(null); 
        setIsModalOpen(true); 
    };

    const handleEditar = (medico) => {
        setMedicoEditando({
            id: medico.id,
            nome: medico.nomeUsuario || medico.nome || "",
            email: medico.emailUsuario || medico.email || "",
            crm: medico.crm || "", 
            especialidade: medico.especialidade || "",
            telefone: medico.telefone || "",
            senha: "" 
        }); 
        setIsModalOpen(true);
    };

    const handleSalvar = async (medicoData) => {
        try {
            const payload = { ...medicoData, tipo: 'MEDICO' };
            
            if (medicoEditando?.id) {
                if (!payload.senha || !payload.senha.trim()) delete payload.senha;
                await atualizarMedico(medicoEditando.id, payload);
                toast.success('Profissional atualizado com sucesso!');
            } else {
                await criarMedico(payload);
                toast.success('Profissional cadastrado com sucesso!');
            }
            setIsModalOpen(false);
            fetchMedicos();      
        } catch (err) {
            toast.error(`Falha ao salvar: ${err.message}`);
        }
    };

    const handleRemover = async (id, nome) => {
        if (!window.confirm(`Remover o profissional ${nome}?`)) return;
        try {
            await removerMedico(id);
            toast.success('Profissional removido.');
            fetchMedicos(); 
        } catch (err) {
            toast.error(`Erro: ${err.message}`);
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary shadow-sm" role="status"></div>
            <p className="mt-2 fw-black text-muted uppercase small tracking-widest">Sincronizando Profissionais...</p>
        </div>
    );

    return (
        <div className="container-fluid p-0 animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
                <div>
                    <h2 className="fw-black text-dark uppercase tracking-tighter mb-0">Corpo Clínico</h2>
                    <p className="text-muted small fw-bold uppercase mb-0">Gestão de especialistas e credenciais</p>
                </div>
                <button onClick={handleNovo} className="btn btn-primary fw-black uppercase px-4 py-2 rounded-3 shadow-sm border-0">
                    + Adicionar Profissional
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Profissional</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Registro (CRM/CRP)</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Especialidade</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {medicos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 opacity-50">
                                        <span style={{ fontSize: '40px' }}>🩺</span>
                                        <p className="fw-black text-muted uppercase small mt-2">Nenhum profissional localizado</p>
                                    </td>
                                </tr>
                            ) : (
                                medicos.map((medico) => (
                                    <tr key={medico.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{width: '38px', height: '38px'}}>
                                                    {(medico.nomeUsuario || medico.nome || "?").charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{medico.nomeUsuario || medico.nome}</div>
                                                    <div className="text-muted small" style={{fontSize: '11px'}}>{medico.emailUsuario || medico.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-monospace fw-bold text-secondary">{medico.crm}</td>
                                        <td className="px-4 py-3">
                                            <span className="badge bg-soft-blue text-primary border border-primary-subtle px-3 py-2 rounded-pill uppercase fw-black" style={{fontSize: '9px'}}>
                                                {medico.especialidade}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="btn-group shadow-sm rounded-3">
                                                <button onClick={() => handleEditar(medico)} className="btn btn-white btn-sm border-end px-3 text-primary fw-black uppercase" style={{fontSize: '10px'}}>Editar</button>
                                                <button onClick={() => handleRemover(medico.id, medico.nomeUsuario || medico.nome)} className="btn btn-white btn-sm px-3 text-danger fw-black uppercase" style={{fontSize: '10px'}}>Remover</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <MedicoFormModal
                    isOpen={isModalOpen}
                    medico={medicoEditando} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSalvar}
                />
            )}

            <style>{`
                .bg-primary-subtle { background-color: #e7f1ff !important; }
                .bg-soft-blue { background-color: #f0f7ff !important; }
                .btn-white { background: white; border: 1px solid #eee; }
                .btn-white:hover { background: #f8f9fa; }
                .fw-black { font-weight: 900; }
            `}</style>
        </div>
    );
}

export default AdminMedicos;