import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { listarMinhasConsultas, cancelarConsulta } from '../../api/consultasService';
import { MoreVertical, Calendar as CalIcon, Trash2, Play } from 'lucide-react';
import Swal from 'sweetalert2';

function MedicoAgenda() {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const [consultas, setConsultas] = useState([]);

    const carregarAgenda = async () => {
        setIsLoading(true);
        try {
            const dados = await listarMinhasConsultas();
            setConsultas(Array.isArray(dados) ? dados : []);
        } catch (error) {
            console.error('Erro ao carregar agenda:', error);
            Swal.fire('Erro', 'Não foi possível carregar sua agenda.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { carregarAgenda(); }, []);

    const handleCancelar = async (id) => {
        const result = await Swal.fire({
            title: 'Cancelar?',
            text: "Esta consulta será removida.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sim, cancelar'
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);
                await cancelarConsulta(id);
                carregarAgenda();
                Swal.fire('Sucesso', 'Consulta cancelada.', 'success');
            } catch (error) {
                Swal.fire('Erro', 'Erro ao cancelar.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'REALIZADA': return { dot: 'bg-success', text: 'text-success', bg: 'bg-success-subtle' };
            case 'CANCELADA': return { dot: 'bg-danger', text: 'text-danger', bg: 'bg-danger-subtle' };
            default: return { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary-subtle' };
        }
    };

    return (
        <div className="container-fluid py-3 px-2 px-md-4 animate__animated animate__fadeIn">
            {/* Header Simplificado */}
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 className="fw-black text-dark mb-0">Minha <span className="text-success">Agenda</span></h2>
                    <p className="text-muted small mb-0">Gerencie seus horários e pacientes.</p>
                </div>
                <button onClick={carregarAgenda} className="btn btn-light btn-sm rounded-pill border fw-bold text-muted px-3">
                    Atualizar
                </button>
            </div>

            {/* Lista de Consultas */}
            <div className="row g-3">
                {consultas.length > 0 ? (
                    consultas.map((item) => {
                        const style = getStatusStyle(item.status);
                        const data = new Date(item.dataHora);
                        
                        return (
                            <div key={item.id} className="col-12">
                                <div className="card border-0 shadow-sm rounded-4 overflow-hidden card-agenda">
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            
                                            {/* Bloco de Data (Estilo Calendário) */}
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="text-center bg-light rounded-3 p-2" style={{ minWidth: '60px' }}>
                                                    <div className="small text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>
                                                        {data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                                    </div>
                                                    <div className="fs-5 fw-black text-dark leading-tight">
                                                        {data.getDate()}
                                                    </div>
                                                </div>

                                                {/* Info do Paciente */}
                                                <div>
                                                    <div className="fw-bold text-dark fs-6">{item.paciente?.nome}</div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="small text-muted fw-medium">
                                                            {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                                                        </span>
                                                        <span className={`badge-dot ${style.dot}`}></span>
                                                        <span className={`small fw-bold text-uppercase ${style.text}`} style={{ fontSize: '10px' }}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ações Diretas */}
                                            <div className="d-flex gap-2">
                                                {item.status === 'AGENDADA' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleCancelar(item.id)}
                                                            className="btn btn-light text-danger btn-action rounded-circle"
                                                            title="Cancelar"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/medico/atendimento/${item.id}`)}
                                                            className="btn btn-success btn-action rounded-pill px-3 fw-black d-flex align-items-center gap-2"
                                                        >
                                                            <Play size={14} fill="currentColor" /> 
                                                            <span className="d-none d-md-inline">INICIAR</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className={`p-2 rounded-pill px-3 small fw-bold ${style.bg} ${style.text}`}>
                                                        {item.status === 'REALIZADA' ? '✓ Finalizado' : 'Cancelado'}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-5">
                        <CalIcon size={48} className="text-muted opacity-25 mb-3" />
                        <p className="text-muted fw-bold">Nenhuma consulta encontrada.</p>
                    </div>
                )}
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .card-agenda { 
                    transition: transform 0.2s, box-shadow 0.2s; 
                    border: 1px solid #f0f0f0 !important;
                }
                .card-agenda:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }
                .badge-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: inline-block;
                }
                .btn-action {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    border: none;
                }
                .bg-success-subtle { background-color: #e8f5e9; }
                .bg-danger-subtle { background-color: #fef2f2; }
                .bg-primary-subtle { background-color: #eff6ff; }
                
                @media (max-width: 576px) {
                    .btn-action { height: 35px; }
                    .fs-6 { font-size: 0.9rem !important; }
                }
            `}</style>
        </div>
    );
}

export default MedicoAgenda;