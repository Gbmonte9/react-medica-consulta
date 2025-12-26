import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarHistoricosPorPacienteId } from '../../api/historicosService';
import { useLoading } from '../../contexts/LoadingContext';
import { ArrowLeft, ClipboardList, Calendar, StickyNote, Pill, Info } from 'lucide-react';

function ProntuarioPaciente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const [historicos, setHistoricos] = useState([]);

    useEffect(() => {
        const carregarProntuario = async () => {
            setIsLoading(true);
            try {
                const dados = await buscarHistoricosPorPacienteId(id);
                setHistoricos(dados);
            } catch (error) {
                console.error("Erro ao carregar prontuário", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarProntuario();
    }, [id, setIsLoading]);

    return (
        <div className="container-fluid py-3 px-2 px-md-4 animate__animated animate__fadeIn">
            
            <div className="mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-link text-success p-0 mb-3 fw-bold text-decoration-none d-flex align-items-center gap-2 shadow-none hover-go-back"
                >
                    <ArrowLeft size={20} /> Voltar para Pacientes
                </button>
                <h2 className="fw-black text-dark tracking-tighter">
                    <span className="text-success">Prontuário</span> Digital
                </h2>
                <p className="text-muted small fw-bold text-uppercase tracking-wider mb-0">Histórico clínico e evoluções</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-custom-1080 col-lg-8">
                    {historicos && historicos.length > 0 ? (
                        historicos.map((h, index) => (
                            <div key={h.id} className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden card-prontuario">
                                <div className="card-body p-4 border-start border-success border-5">
                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                                        <div className="p-2 bg-success-subtle text-success rounded-3">
                                            <Calendar size={18} />
                                        </div>
                                        <span className="fw-black text-dark fs-5">
                                            {h.dataRegistro ? new Date(h.dataRegistro).toLocaleDateString('pt-BR') : 'Data não disponível'}
                                        </span>
                                        <span className="badge bg-light text-muted border ms-auto rounded-pill px-3 py-2 fw-bold">
                                            ATENDIMENTO #{historicos.length - index}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <StickyNote size={18} className="text-success" /> 
                                            <h6 className="fw-black text-dark mb-0 text-uppercase small">Evolução Clínica</h6>
                                        </div>
                                        <div className="text-secondary bg-light p-3 rounded-4 border-0 lh-base">
                                            {h.observacoes || "Nenhuma observação registrada."}
                                        </div>
                                    </div>

                                    {h.receita && (
                                        <div className="mt-3">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <Pill size={18} className="text-success" />
                                                <h6 className="fw-black text-dark mb-0 text-uppercase small">Prescrição Médica</h6>
                                            </div>
                                            <div className="border border-success border-opacity-25 border-dashed p-3 rounded-4 text-dark fw-medium bg-white prescription-box">
                                                {h.receita}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5 bg-white rounded-5 shadow-sm border border-2 border-dashed">
                            <ClipboardList size={48} className="text-muted mb-3 opacity-25" />
                            <h5 className="fw-bold text-muted">Vazio por enquanto</h5>
                            <p className="small text-muted px-4">Os atendimentos finalizados e as evoluções aparecerão nesta linha do tempo.</p>
                        </div>
                    )}
                </div>
                
                <div className="col-12 col-custom-1080 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-success text-white p-4 sticky-lg-top" style={{ top: '20px' }}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Info size={24} />
                            <h5 className="fw-black mb-0">Resumo do Caso</h5>
                        </div>
                        <p className="small opacity-75 mb-4">
                            Informações confidenciais. Este prontuário contém dados sensíveis protegidos por ética profissional.
                        </p>
                        <div className="bg-white bg-opacity-10 p-3 rounded-4">
                            <div className="d-flex justify-content-between align-items-center mb-0">
                                <span className="fw-medium small text-uppercase">Total de Atendimentos</span>
                                <span className="fs-4 fw-black">{historicos.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .bg-success-subtle { background-color: #e8f5e9 !important; }
                
                .card-prontuario {
                    transition: all 0.3s ease;
                }
                
                .prescription-box {
                    white-space: pre-wrap;
                    background-image: radial-gradient(#19875422 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .hover-go-back:hover {
                    transform: translateX(-5px);
                    color: #0d6efd !important;
                }

                /* LOGICA DE 1080PX */
                @media (max-width: 1080px) {
                    .col-custom-1080 {
                        width: 100% !important;
                        flex: 0 0 100% !important;
                        max-width: 100% !important;
                    }
                    
                    .sticky-lg-top {
                        position: static !important;
                    }
                    
                    h2 { font-size: 1.6rem !important; }
                    
                    .card-body {
                        padding: 1.5rem !important;
                    }
                }

                @media (max-width: 576px) {
                    .badge {
                        width: 100%;
                        margin-top: 10px;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default ProntuarioPaciente;