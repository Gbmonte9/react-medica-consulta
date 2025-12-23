import React, { useState, useEffect } from 'react';
import { listarMinhasConsultas } from '../../api/consultasService';
import { useLoading } from '../../contexts/LoadingContext';

function PacienteConsulta() {
    const [consultas, setConsultas] = useState([]);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        carregarConsultas();
    }, []);

    const carregarConsultas = async () => {
        try {
            setIsLoading(true);
            const dados = await listarMinhasConsultas();
            // Ordenar por data (mais recentes primeiro)
            const ordenadas = dados.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
            setConsultas(ordenadas);
        } catch (error) {
            console.error("Erro ao carregar consultas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const estilos = {
            'AGENDADA': 'bg-info',
            'CONCLUIDA': 'bg-success',
            'CANCELADA': 'bg-danger',
            'EM_ANDAMENTO': 'bg-warning text-dark'
        };
        return <span className={`badge ${estilos[status] || 'bg-secondary'} fw-black uppercase small`}>{status}</span>;
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">Minhas Consultas</h2>
                <p className="text-muted small fw-bold uppercase">Histórico completo de atendimentos e agendamentos.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 fw-black uppercase small text-muted">Médico</th>
                                <th className="py-3 fw-black uppercase small text-muted">Especialidade</th>
                                <th className="py-3 fw-black uppercase small text-muted">Data e Hora</th>
                                <th className="py-3 fw-black uppercase small text-muted">Status</th>
                                <th className="py-3 fw-black uppercase small text-muted text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultas.length > 0 ? (
                                consultas.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark">{c.medico?.nome || c.medicoNome}</div>
                                        </td>
                                        <td><span className="text-muted fw-bold small uppercase">{c.medico?.especialidade || 'Clínico'}</span></td>
                                        <td>
                                            <div className="fw-bold">{new Date(c.dataHora).toLocaleDateString('pt-BR')}</div>
                                            <div className="text-muted small">{new Date(c.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td>{getStatusBadge(c.status)}</td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold uppercase" style={{fontSize: '10px'}}>
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted fw-bold">Nenhuma consulta encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PacienteConsulta;