import React, { useState, useEffect, useMemo } from 'react';
import { listarMinhasConsultas, removerConsulta } from '../../api/consultasService';
import PacienteDetalhesModal from '../../components/modals/PacienteDetalhesModal'; 
import { useLoading } from '../../contexts/LoadingContext';
import { getUserId } from '../../api/authService';
import Swal from 'sweetalert2';

function PacienteConsulta() {
    const [consultas, setConsultas] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('TODAS'); 
    const [filtroBusca, setFiltroBusca] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);

    const { setIsLoading } = useLoading();

    const carregarConsultas = async () => {
        try {
            setIsLoading(true);
            const dados = await listarMinhasConsultas();
            setConsultas(Array.isArray(dados) ? dados : []);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    useEffect(() => {
        const userId = getUserId();
        if (userId) carregarConsultas();
    }, []);

    const handleExcluir = async (id) => {
        const result = await Swal.fire({
            title: 'Cancelar Agendamento?',
            text: "Esta ação liberará seu horário para outros pacientes.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0dcaf0',
            cancelButtonColor: '#ff4d4d',
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Manter',
            customClass: { confirmButton: 'rounded-pill px-4', cancelButton: 'rounded-pill px-4' }
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);
                await removerConsulta(id);
                await carregarConsultas();
                Swal.fire('Cancelado', 'Consulta cancelada com sucesso.', 'success');
            } catch (error) { Swal.fire('Erro', error.message, 'error'); } finally { setIsLoading(false); }
        }
    };

    const consultasFiltradas = useMemo(() => {
        return consultas
            .filter(c => {
                const matchesStatus = filtroStatus === 'TODAS' || c.status === filtroStatus;
                const busca = filtroBusca.toLowerCase();
                return matchesStatus && (c.medico?.nome?.toLowerCase().includes(busca) || c.motivo?.toLowerCase().includes(busca));
            })
            .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    }, [consultas, filtroStatus, filtroBusca]);

    return (
        <div className="container-fluid animate__animated animate__fadeIn pb-5 px-3">
            <div className="header-section mb-4">
                <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
                    <span className="text-info">📅</span> Minhas Consultas
                </h2>
                <p className="text-muted small fw-bold uppercase tracking-widest">Histórico e Agendamentos</p>
            </div>

            {/* FILTROS ESTILIZADOS */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="search-box bg-white shadow-sm rounded-4 p-2 d-flex align-items-center border">
                        <span className="ms-2">🔍</span>
                        <input type="text" placeholder="Médico ou motivo..." value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} className="form-control border-0 shadow-none bg-transparent fw-medium" />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="form-select border-0 shadow-sm bg-white rounded-4 p-3 fw-bold text-info small uppercase shadow-none border">
                        <option value="TODAS">Todos os Status</option>
                        <option value="AGENDADA">Agendadas</option>
                        <option value="REALIZADA">Realizadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>
                </div>
            </div>

            {/* LISTA EM CARDS (MOBILE) E TABELA (DESKTOP) */}
            <div className="consultas-container">
                {consultasFiltradas.length > 0 ? (
                    <div className="row g-3">
                        {consultasFiltradas.map((c) => (
                            <div key={c.id} className="col-12 col-xl-6">
                                <div className={`card border-0 shadow-sm rounded-4 transition-all hvr-light overflow-hidden ${c.status === 'CANCELADA' ? 'opacity-75' : ''}`}>
                                    <div className="d-flex flex-column flex-md-row">
                                        {/* Faixa Lateral de Data */}
                                        <div className="bg-info-subtle p-3 d-flex flex-md-column justify-content-center align-items-center text-info gap-2" style={{ minWidth: '100px' }}>
                                            <span className="fw-black fs-4">{new Date(c.dataHora).getDate()}</span>
                                            <span className="fw-bold uppercase small">{new Date(c.dataHora).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                                            <span className="badge bg-white text-info rounded-pill shadow-sm py-1 px-2 mt-md-2" style={{ fontSize: '10px' }}>
                                                {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="card-body p-4 position-relative">
                                            <div className="mb-2">
                                                <span className={`badge border-0 rounded-pill fw-black uppercase mb-2 ${
                                                    c.status === 'AGENDADA' ? 'bg-info text-white' : 
                                                    c.status === 'REALIZADA' ? 'bg-success text-white' : 'bg-danger text-white'
                                                }`} style={{ fontSize: '8px', padding: '5px 12px' }}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <h5 className="fw-black text-dark mb-1">Dr(a). {c.medico?.nome}</h5>
                                            <p className="text-muted small fw-bold uppercase mb-3">{c.medico?.especialidade}</p>
                                            
                                            <div className="d-flex gap-2">
                                                <button onClick={() => { setConsultaSelecionada(c); setIsModalOpen(true); }} className="btn btn-light-info flex-grow-1 rounded-3 fw-black uppercase small border-0 py-2">
                                                    Ver Detalhes
                                                </button>
                                                {c.status === 'AGENDADA' && (
                                                    <button onClick={() => handleExcluir(c.id)} className="btn btn-outline-danger border-0 rounded-3 px-3">
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <div className="fs-1 mb-3">📂</div>
                        <h5 className="fw-bold text-muted">Nenhum registro encontrado</h5>
                    </div>
                )}
            </div>

            <PacienteDetalhesModal isOpen={isModalOpen} consulta={consultaSelecionada} onClose={() => setIsModalOpen(false)} />

            <style>{`
                .fw-black { font-weight: 900; }
                .bg-info { background-color: #0dcaf0 !important; }
                .text-info { color: #0dcaf0 !important; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .btn-light-info { background-color: #e0f7fa; color: #0dcaf0; transition: 0.3s; }
                .btn-light-info:hover { background-color: #0dcaf0; color: white; }
                .hvr-light:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
}

export default PacienteConsulta;