import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { buscarAgendaDoDia, buscarEstatisticasMedico } from '../../api/consultasService';
import { Calendar, CheckCircle, XCircle, PlayCircle, ArrowRight, Clock, User } from 'lucide-react';

function MedicoDashboard() {
    const { user } = useAuth();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();
    const [proximasConsultas, setProximasConsultas] = useState([]);
    const [stats, setStats] = useState({
        consultasHoje: 0,
        pacientesAtendidos: 0,
        consultasCanceladas: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                // Chamada simultânea das APIs
                const [agenda, dashboardStats] = await Promise.all([
                    buscarAgendaDoDia(),
                    buscarEstatisticasMedico()
                ]);

                console.log("Dados recebidos da Agenda:", agenda); // Verifique o console do navegador (F12)

                // 1. GARANTIR QUE TEMOS UM ARRAY
                let listaValida = Array.isArray(agenda) ? agenda : [];

                // 2. ORDENAR POR HORÁRIO (Mais cedo primeiro)
                listaValida.sort((a, b) => {
                    const horaA = a.dataHora || a.horario || "";
                    const horaB = b.dataHora || b.horario || "";
                    return horaA.toString().localeCompare(horaB.toString());
                });

                // 3. MOSTRAR AS 3 PRIMEIRAS (Sem filtros de status por enquanto para garantir que apareça)
                setProximasConsultas(listaValida.slice(0, 3));
                
                if (dashboardStats) setStats(dashboardStats);
                
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoadingData(false);
                setIsLoading(false);
            }
        };

        if (user) loadDashboardData();
    }, [user, setIsLoading]);

    // Função auxiliar para extrair o nome do paciente de várias estruturas possíveis
    const getNomePaciente = (c) => {
        if (c.paciente?.nome) return c.paciente.nome;
        if (c.pacienteNome) return c.pacienteNome;
        if (c.nomePaciente) return c.nomePaciente;
        if (c.usuario?.nome) return c.usuario.nome;
        return "Paciente";
    };

    if (loadingData) return null;

    return (
        <div className="animate__animated animate__fadeIn container-fluid px-2 px-md-4 py-3">
            <div className="mb-4 text-center text-md-start">
                <h1 className="h3 mb-1 fw-black text-dark tracking-tighter">
                    Olá, Dr(a). <span className="text-success">{user?.nome?.split(' ')[0]}</span>
                </h1>
                <p className="text-muted fw-medium small">Resumo da sua atividade de hoje.</p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Hoje', val: stats.consultasHoje, color: 'success', icon: <Calendar size={20}/> },
                    { label: 'Atendidos', val: stats.pacientesAtendidos, color: 'primary', icon: <CheckCircle size={20}/> },
                    { label: 'Cancelados', val: stats.consultasCanceladas, color: 'danger', icon: <XCircle size={20}/> }
                ].map((item, idx) => (
                    <div key={idx} className="col-12 col-md-4 col-custom-1080">
                        <div className={`card shadow-sm border-0 rounded-4 bg-white border-start border-${item.color} border-5`}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted small fw-bold text-uppercase">{item.label}</span>
                                    <div className={`p-2 bg-${item.color}-subtle text-${item.color} rounded-3`}>{item.icon}</div>
                                </div>
                                <h2 className="fw-black mb-0 text-dark">{item.val}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Próximas Consultas */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center px-4">
                    <h5 className="mb-0 fw-black text-dark">Próximo da Fila</h5>
                    <Link to="/medico/agenda" className="btn btn-light btn-sm fw-bold rounded-pill px-3 border text-success">
                        Ver Agenda <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="card-body p-0">
                    {proximasConsultas.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {proximasConsultas.map((consulta) => (
                                <div key={consulta.id} className="list-group-item p-4 hover-bg-light transition-all">
                                    <div className="row align-items-center g-3">
                                        <div className="col-12 col-md-5 col-custom-1080">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-success-subtle text-success p-3 rounded-circle d-none d-md-flex">
                                                    <User size={20} />
                                                </div>
                                                <div className="text-truncate">
                                                    <p className="mb-0 fw-black text-dark fs-6">
                                                        {getNomePaciente(consulta)}
                                                    </p>
                                                    <small className="text-muted d-flex align-items-center gap-1">
                                                        <Clock size={12} /> 
                                                        {consulta.horario || (consulta.dataHora ? new Date(consulta.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--')}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-custom-1080">
                                            <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 fw-bold text-uppercase" style={{fontSize: '10px'}}>
                                                ● {consulta.status || 'AGENDADO'}
                                            </span>
                                        </div>
                                        <div className="col-12 col-md-4 col-custom-1080 text-end">
                                            <button 
                                                onClick={() => navigate(`/medico/atendimento/${consulta.id}`)}
                                                className="btn btn-success fw-black rounded-pill py-2 px-4 shadow-sm d-flex align-items-center justify-content-center gap-2 w-100-mobile hover-scale"
                                            >
                                                <PlayCircle size={18} fill="currentColor" /> INICIAR ATENDIMENTO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-5 text-center bg-light">
                            <CheckCircle size={48} className="text-success opacity-25 mb-3" />
                            <h6 className="fw-bold text-muted">Nenhuma consulta encontrada para hoje.</h6>
                            <p className="text-muted small">Verifique se existem consultas marcadas na sua agenda.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .bg-success-subtle { background-color: #e8f5e9 !important; }
                .bg-primary-subtle { background-color: #e3f2fd !important; }
                .bg-danger-subtle { background-color: #ffebee !important; }
                .bg-warning-subtle { background-color: #fff8e1 !important; }
                .hover-bg-light:hover { background-color: #f8fff9; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .hover-scale:hover { transform: scale(1.02); }

                @media (max-width: 1080px) {
                    .col-custom-1080 {
                        width: 100% !important;
                        flex: 0 0 100% !important;
                        max-width: 100% !important;
                    }
                    .w-100-mobile { width: 100% !important; }
                    .text-end { text-align: left !important; }
                    .card-body { padding: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
}

export default MedicoDashboard;