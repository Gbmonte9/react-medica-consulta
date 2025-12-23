import React, { useState, useEffect, useMemo } from 'react';
import { listarTodasConsultas, cancelarConsulta } from '../../api/consultasService'; 
import AdminAgendamentoModal from '../../components/modals/AdminAgendamentoModal'; 

function AdminConsultas() {
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultaParaEditar, setConsultaParaEditar] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('TODAS'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 

    const fetchConsultas = async () => {
        try {
            setLoading(true);
            const data = await listarTodasConsultas();
            setConsultas(data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar consultas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchConsultas(); }, []);

    const handleAgendamentoSuccess = () => {
        setIsModalOpen(false);
        setConsultaParaEditar(null);
        fetchConsultas(); 
    };

    const handleEditar = (consulta) => {
        setConsultaParaEditar(consulta);
        setIsModalOpen(true);
    };

    const handleCancelar = async (id, pacienteNome) => {
        if (!window.confirm(`Deseja CANCELAR a consulta do(a) paciente ${pacienteNome}?`)) return;
        try {
            await cancelarConsulta(id);
            fetchConsultas(); 
        } catch (err) {
            alert(`Falha: ${err.message}`);
        }
    };
    
    const consultasFiltradas = useMemo(() => {
        let lista = [...consultas];
        if (filtroStatus !== 'TODAS') lista = lista.filter(c => c.status === filtroStatus);
        if (filtroBusca) {
            const busca = filtroBusca.toLowerCase();
            lista = lista.filter(c => 
                (c.paciente?.nome?.toLowerCase().includes(busca)) || 
                (c.medico?.nome?.toLowerCase().includes(busca)) ||
                (c.motivo?.toLowerCase().includes(busca)) // BUSCA TAMBÉM PELO MOTIVO
            );
        }
        lista.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
        return lista;
    }, [consultas, filtroStatus, filtroBusca]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'AGENDADA': return 'bg-primary-subtle text-primary border-primary-subtle';
            case 'REALIZADA': return 'bg-success-subtle text-success border-success-subtle'; 
            case 'CANCELADA': return 'bg-danger-subtle text-danger border-danger-subtle';
            default: return 'bg-light text-muted border-secondary-subtle';
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 fw-black text-muted uppercase small tracking-widest">Acessando Agenda...</p>
        </div>
    );

    return (
        <div className="container-fluid p-0 animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
                <div>
                    <h2 className="fw-black text-dark uppercase tracking-tighter mb-0">Agenda Geral</h2>
                    <p className="text-muted small fw-bold uppercase mb-0">Controle de atendimentos e horários</p>
                </div>
                <button 
                    onClick={() => { setConsultaParaEditar(null); setIsModalOpen(true); }}
                    className="btn btn-primary fw-black uppercase px-4 py-2 rounded-3 shadow-sm"
                >
                    + Registrar Consulta
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-12 col-md-3">
                            <select 
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="form-select border-0 bg-light rounded-3 fw-bold text-muted small uppercase p-2.5 shadow-none"
                            >
                                <option value="TODAS">Todos os Status</option>
                                <option value="AGENDADA">Agendadas</option>
                                <option value="REALIZADA">Realizadas</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-9">
                            <input
                                type="text"
                                placeholder="Pesquisar por paciente, médico ou motivo..."
                                value={filtroBusca}
                                onChange={(e) => setFiltroBusca(e.target.value)}
                                className="form-control border-0 bg-light rounded-3 p-2.5 shadow-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Horário</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Paciente</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Médico</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase">Motivo</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase text-center">Status</th>
                                <th className="px-4 py-3 border-0 fw-black text-muted small uppercase text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {consultasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center opacity-50">
                                            <span style={{ fontSize: '40px' }}>🔍</span>
                                            <p className="fw-black text-muted uppercase small tracking-widest mt-2">Nenhum agendamento encontrado</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                consultasFiltradas.map((consulta) => (
                                    <tr key={consulta.id} className="animate__animated animate__fadeIn">
                                        <td className="px-4 py-3">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark" style={{fontSize: '13px'}}>
                                                    {new Date(consulta.dataHora).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="text-muted small" style={{fontSize: '11px'}}>
                                                    {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} hs
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="fw-black text-primary text-uppercase" style={{fontSize: '12px'}}>
                                                {consulta.paciente?.nome || 'Paciente não identificado'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-muted fw-bold small">
                                                Dr(a). {consulta.medico?.nome || 'Médico não identificado'}
                                            </div>
                                        </td>
                                        {/* NOVA COLUNA DE MOTIVO */}
                                        <td className="px-4 py-3">
                                            <div className="text-muted small text-truncate" style={{maxWidth: '150px', fontSize: '11px'}} title={consulta.motivo}>
                                                {consulta.motivo || <em className="text-light-emphasis">Não informado</em>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`badge border px-3 py-2 rounded-pill fw-black uppercase ${getStatusStyle(consulta.status)}`} style={{fontSize: '9px'}}>
                                                {consulta.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                {consulta.status !== 'CANCELADA' && (
                                                    <button 
                                                        onClick={() => handleEditar(consulta)} 
                                                        className="btn btn-white btn-sm rounded-3 border shadow-sm px-3 text-primary fw-bold" 
                                                        style={{fontSize: '11px'}}
                                                    >
                                                        EDITAR
                                                    </button>
                                                )}
                                                {consulta.status === 'AGENDADA' && (
                                                    <button 
                                                        onClick={() => handleCancelar(consulta.id, consulta.paciente?.nome)} 
                                                        className="btn btn-white btn-sm rounded-3 border shadow-sm px-3 text-danger fw-bold" 
                                                        style={{fontSize: '11px'}}
                                                    >
                                                        CANCELAR
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminAgendamentoModal 
                isOpen={isModalOpen}
                consulta={consultaParaEditar}
                onClose={() => { setIsModalOpen(false); setConsultaParaEditar(null); }}
                onAgendamentoSuccess={handleAgendamentoSuccess}
            />
        </div>
    );
}

export default AdminConsultas;