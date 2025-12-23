import React, { useState, useEffect } from 'react';
import { listarMinhasConsultas } from '../../api/consultasService';
import { useLoading } from '../../contexts/LoadingContext';
import { getUserId } from '../../api/authService';

function PacienteConsulta() {
    const [consultas, setConsultas] = useState([]);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const userId = getUserId();
        // Log para conferirmos se o ID do React é o mesmo do seu Banco de Dados
        console.log("ID do Usuário logado no React:", userId);
        
        if (userId) {
            carregarConsultas();
        }
    }, []);

    const carregarConsultas = async () => {
        try {
            setIsLoading(true);
            const dados = await listarMinhasConsultas();
            
            // Log fundamental: veja o que o Java respondeu no F12
            console.log("Resposta bruta do Java:", dados);

            if (dados && Array.isArray(dados)) {
                // Ordenação por data (mais recentes no topo)
                const ordenadas = dados.sort((a, b) => {
                    const dataA = new Date(a.dataHora || a.data || 0);
                    const dataB = new Date(b.dataHora || b.data || 0);
                    return dataB - dataA;
                });
                setConsultas(ordenadas);
            }
        } catch (error) {
            console.error("Erro ao carregar consultas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        // Atualizado para incluir "REALIZADA" conforme seu banco de dados
        const estilos = {
            'AGENDADA': 'bg-info',
            'REALIZADA': 'bg-success',
            'CONCLUIDA': 'bg-success',
            'CANCELADA': 'bg-danger',
            'EM_ANDAMENTO': 'bg-warning text-dark'
        };
        return (
            <span className={`badge ${estilos[status] || 'bg-secondary'} fw-black uppercase small`} style={{fontSize: '10px'}}>
                {status || 'N/A'}
            </span>
        );
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">Minhas Consultas</h2>
                <p className="text-muted small fw-bold uppercase">Histórico completo de atendimentos.</p>
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
                                consultas.map((c) => {
                                    // Mapeamento flexível de nomes de campos
                                    const medicoNome = c.medico?.nome || c.medicoNome || 'Médico';
                                    const espec = c.medico?.especialidade || c.especialidade || 'Clínico';
                                    const dataValida = c.dataHora || c.data;

                                    return (
                                        <tr key={c.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{medicoNome}</div>
                                            </td>
                                            <td>
                                                <span className="text-muted fw-bold small uppercase">{espec}</span>
                                            </td>
                                            <td>
                                                <div className="fw-bold">
                                                    {dataValida ? new Date(dataValida).toLocaleDateString('pt-BR') : '---'}
                                                </div>
                                                <div className="text-muted small">
                                                    {dataValida ? new Date(dataValida).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(c.status)}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold uppercase" style={{fontSize: '10px'}}>
                                                    Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <p className="text-muted fw-bold small uppercase mb-0">Nenhuma consulta encontrada no sistema.</p>
                                        <small className="text-muted">Verifique se o ID do paciente está correto no banco.</small>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <style>{`
                .fw-black { font-weight: 900; }
                .table-hover tbody tr:hover { background-color: #fbfbfb; transition: 0.2s; }
            `}</style>
        </div>
    );
}

export default PacienteConsulta;