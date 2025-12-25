import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { listarMinhasConsultas, buscarEstatisticasMedico } from '../../api/consultasService';
import { Calendar, CheckCircle, XCircle, ArrowRight, Clock, User, ClipboardList } from 'lucide-react';

function MedicoDashboard() {
    const { user } = useAuth();
    const { setIsLoading } = useLoading();
    
    const [proximasConsultas, setProximasConsultas] = useState([]);
    const [stats, setStats] = useState({
        consultasHoje: 0,
        pacientesAtendidos: 0,
        consultasCanceladas: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const [todasConsultas, dashboardStats] = await Promise.all([
                    listarMinhasConsultas(),
                    buscarEstatisticasMedico()
                ]);

                let listaValida = Array.isArray(todasConsultas) 
                    ? todasConsultas.filter(c => {
                        const s = c.status?.toUpperCase();
                        return s !== 'FINALIZADA' && s !== 'REALIZADA' && s !== 'CANCELADA';
                    })
                    : [];

                listaValida.sort((a, b) => {
                    const dataA = new Date(a.dataHora || a.data);
                    const dataB = new Date(b.dataHora || b.data);
                    return dataA - dataB;
                });

                setProximasConsultas(listaValida.slice(0, 5));
                
                if (dashboardStats) {
                    setStats(dashboardStats);
                }
                
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoadingData(false);
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user, setIsLoading]);

    const getNomePaciente = (c) => {
        if (c.paciente?.nome) return c.paciente.nome;
        if (c.pacienteNome) return c.pacienteNome;
        if (c.nomePaciente) return c.nomePaciente;
        return "Paciente";
    };

    if (loadingData && !user) return null;

    return (
        <div className="animate__animated animate__fadeInUp container-fluid px-3 px-md-4 py-3" style={{ animationDuration: '0.8s' }}>
            
            <div className="mb-4 text-center text-md-start">
                <h1 className="h3 mb-1 fw-black text-dark tracking-tighter">
                    Olá, Dr(a). <span className="text-success">{user?.nome?.split(' ')[0] || 'Médico'}</span>
                </h1>
                <p className="text-muted fw-medium small">Resumo dos seus atendimentos pendentes.</p>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { label: 'Hoje', val: stats.consultasHoje, color: 'success', icon: <Calendar size={20}/> },
                    { label: 'Atendidos', val: stats.pacientesAtendidos, color: 'primary', icon: <CheckCircle size={20}/> },
                    { label: 'Cancelados', val: stats.consultasCanceladas, color: 'danger', icon: <XCircle size={20}/> }
                ].map((item, idx) => (
                    <div key={idx} className="col-12 col-md-4 animate__animated animate__fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className={`card shadow-sm border-0 rounded-4 bg-white border-start border-${item.color} border-5 h-100 hover-card`}>
                            <div className="card-body p-3 p-lg-4">
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

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5 animate__animated animate__fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className="card-header bg-white py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center px-4 gap-3">
                    <div>
                        <h5 className="mb-0 fw-black text-dark">Próximos da Fila</h5>
                        <small className="text-muted">Acompanhe seus próximos compromissos</small>
                    </div>
                    <Link to="/medico/agenda" className="btn btn-success btn-sm fw-bold rounded-pill px-3 shadow-sm w-auto transition-button">
                        Ver Agenda <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="card-body p-0">
                    {proximasConsultas.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {proximasConsultas.map((consulta, index) => {
                                // Verifica se o status é Agendado para definir a cor
                                const isAgendada = consulta.status?.toUpperCase().includes('AGENDA');
                                
                                return (
                                    <div 
                                        key={index} 
                                        className="list-group-item p-3 p-md-4 border-0 border-bottom list-item-anim"
                                        style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
                                    >
                                        <div className="row align-items-center g-3">
                                            <div className="col-12 col-md-7">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light text-secondary p-3 rounded-circle d-none d-sm-flex">
                                                        <User size={20} />
                                                    </div>
                                                    <div className="text-truncate">
                                                        <p className="mb-0 fw-bold text-dark fs-6 text-truncate">
                                                            {getNomePaciente(consulta)}
                                                        </p>
                                                        <span className={`badge ${isAgendada ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} rounded-pill fw-bold text-uppercase mt-1`} style={{fontSize: '9px'}}>
                                                            Status: {consulta.status || 'Agendado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-5 text-md-end">
                                                <div className="d-inline-flex align-items-center gap-2 bg-light px-3 py-2 rounded-pill border w-100-mobile justify-content-center hover-date">
                                                    <Clock size={16} className="text-success" />
                                                    <span className="text-dark fw-bold small">
                                                        {new Date(consulta.dataHora || consulta.data).toLocaleDateString('pt-BR')} - {consulta.horario || "Indefinido"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-5 text-center bg-light animate__animated animate__fadeIn">
                            <ClipboardList size={48} className="text-muted opacity-25 mb-3" />
                            <h6 className="fw-bold text-muted">Nenhuma consulta pendente.</h6>
                            <p className="text-muted small">Tudo limpo por aqui!</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .bg-success-subtle { background-color: #e8f5e9 !important; }
                .bg-warning-subtle { background-color: #fff8e1 !important; }
                .bg-primary-subtle { background-color: #e3f2fd !important; }
                .bg-danger-subtle { background-color: #ffebee !important; }
                
                .list-item-anim {
                    opacity: 0;
                    animation: slideInRight 0.5s ease forwards;
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .hover-card { transition: all 0.3s ease; }
                .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }

                .transition-button { transition: all 0.3s ease; }
                .transition-button:hover { padding-right: 1.5rem !important; }

                @media (max-width: 576px) {
                    .w-100-mobile { width: 100% !important; }
                    .card-body { padding: 1rem !important; }
                }
            `}</style>
        </div>
    );
}

export default MedicoDashboard;