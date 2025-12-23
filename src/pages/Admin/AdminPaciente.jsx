import React, { useState, useEffect } from 'react';
import { listarPacientes, removerPaciente, criarPaciente, atualizarPaciente } from '../../api/pacienteService'; 
import PacienteFormModal from '../../components/modals/PacienteFormModal'; 

function AdminPaciente() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null); 

    const fetchPacientes = async () => {
        try {
            setLoading(true);
            const data = await listarPacientes();
            setPacientes(data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar pacientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPacientes(); }, []);

    const handleNovo = () => { setPacienteEditando(null); setIsModalOpen(true); };

    const handleEditar = (paciente) => {
        const dadosParaModal = {
            id: paciente.id,
            nome: paciente.nomeUsuario, 
            email: paciente.emailUsuario,
            telefone: paciente.telefone,
            cpf: "", 
            senha: "" 
        };
        setPacienteEditando(dadosParaModal);
        setIsModalOpen(true);
    };

    const handleSalvar = async (pacienteData) => {
        try {
            const payload = { ...pacienteData, tipo: 'PACIENTE' };
            if (pacienteEditando?.id) {
                if (!payload.senha?.trim()) delete payload.senha;
                if (!payload.cpf?.trim()) delete payload.cpf;
                await atualizarPaciente(pacienteEditando.id, payload);
            } else {
                await criarPaciente(payload);
            }
            setIsModalOpen(false);
            fetchPacientes();
        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleRemover = async (id, nome) => {
        if (!window.confirm(`Deseja remover o paciente ${nome}?`)) return;
        try {
            await removerPaciente(id);
            fetchPacientes();
        } catch (err) {
            alert(`Falha: ${err.message}`);
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 fw-bold text-muted uppercase small">Carregando Pacientes...</p>
        </div>
    );

    return (
        <div className="container-fluid p-0 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 className="fw-black text-dark uppercase tracking-tighter mb-0">Pacientes</h2>
                    <p className="text-muted small fw-bold uppercase mb-0">Gerenciamento de usuários da clínica</p>
                </div>
                <button onClick={handleNovo} className="btn btn-primary fw-black uppercase px-4 py-2 rounded-3 shadow-sm">
                    + Novo Paciente
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Nome</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Email</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Telefone</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {pacientes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center opacity-50">
                                            <span style={{ fontSize: '40px' }}>📁</span>
                                            <p className="fw-bold text-muted uppercase small mt-2">
                                                Nenhum paciente cadastrado no sistema.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pacientes.map((paciente) => (
                                    <tr key={paciente.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '35px', height: '35px'}}>🧍</div>
                                                <span className="fw-bold text-dark">{paciente.nomeUsuario}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">{paciente.emailUsuario}</td>
                                        <td className="px-4 py-3">
                                            <span className="badge bg-light text-dark border fw-medium px-2 py-1">
                                                {paciente.telefone || "Não informado"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="btn-group shadow-sm rounded-3 overflow-hidden">
                                                <button onClick={() => handleEditar(paciente)} className="btn btn-white btn-sm border-end px-3 py-2 text-primary fw-bold uppercase" style={{fontSize: '10px'}}>Editar</button>
                                                <button onClick={() => handleRemover(paciente.id, paciente.nomeUsuario)} className="btn btn-white btn-sm px-3 py-2 text-danger fw-bold uppercase" style={{fontSize: '10px'}}>Excluir</button>
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
                <PacienteFormModal
                    isOpen={isModalOpen}
                    paciente={pacienteEditando}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSalvar}
                />
            )}
        </div>
    );
}

export default AdminPaciente;