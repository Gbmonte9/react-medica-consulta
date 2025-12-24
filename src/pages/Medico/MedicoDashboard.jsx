// src/pages/Medico/MedicoDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
// import { fetchAgendaDoDia, fetchDashboardStats } from '../../api/medicoService'; // <-- Você precisará criar este serviço depois

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
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            setLoadingData(true);
            setError(null);
            try {
                // *** DESCOMENTE QUANDO TIVER OS SERVIÇOS DO BACKEND ***
                // const agenda = await fetchAgendaDoDia(user.id);
                // setProximasConsultas(agenda.slice(0, 3)); // Mostra as 3 próximas

                // const dashboardStats = await fetchDashboardStats(user.id);
                // setStats(dashboardStats);

                // --- DADOS MOCADOS PARA TESTE (REMOVER DEPOIS) ---
                setProximasConsultas([
                    { id: 1, pacienteNome: 'Maria Silva', horario: '09:00', status: 'Aguardando' },
                    { id: 2, pacienteNome: 'João Oliveira', horario: '09:30', status: 'Aguardando' },
                    { id: 3, pacienteNome: 'Ana Souza', horario: '10:00', status: 'Aguardando' },
                ]);
                setStats({
                    consultasHoje: 5,
                    pacientesAtendidos: 2,
                    consultasCanceladas: 0,
                });
                // --------------------------------------------------

            } catch (err) {
                console.error("Erro ao carregar dados do dashboard médico:", err);
                setError("Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setLoadingData(false);
                setIsLoading(false);
            }
        };

        if (user && user.id) {
            loadDashboardData();
        }
    }, [user, setIsLoading]);

    if (loadingData) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center animate__animated animate__shakeX">
                {error}
            </div>
        );
    }

    return (
        <div className="animate__animated animate__fadeInUp animate__faster">
            <h1 className="h3 mb-4 fw-black text-dark tracking-tighter">
                <span className="text-success">Painel</span> do Dia, Dr(a). {user?.nome?.split(' ')[0]}
            </h1>
            <p className="text-muted mb-4">Bem-vindo(a) ao seu resumo diário de atendimentos e compromissos.</p>

            {/* Cards de Estatísticas */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 animate__animated animate__fadeInLeft animate__delay-0-2s">
                        <div className="card-body p-4">
                            <h5 className="card-title text-success fw-bold mb-3 d-flex align-items-center gap-2">
                                <span className="fs-4">🗓️</span> Consultas Hoje
                            </h5>
                            <p className="display-4 fw-black text-dark mb-0">{stats.consultasHoje}</p>
                            <span className="text-muted small">Agendadas para você</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 animate__animated animate__fadeInUp animate__delay-0-4s">
                        <div className="card-body p-4">
                            <h5 className="card-title text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                                <span className="fs-4">✅</span> Pacientes Atendidos
                            </h5>
                            <p className="display-4 fw-black text-dark mb-0">{stats.pacientesAtendidos}</p>
                            <span className="text-muted small">Atendimentos concluídos hoje</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 animate__animated animate__fadeInRight animate__delay-0-6s">
                        <div className="card-body p-4">
                            <h5 className="card-title text-danger fw-bold mb-3 d-flex align-items-center gap-2">
                                <span className="fs-4">🚫</span> Cancelamentos
                            </h5>
                            <p className="display-4 fw-black text-dark mb-0">{stats.consultasCanceladas}</p>
                            <span className="text-muted small">Consultas canceladas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Próximas Consultas */}
            <div className="card shadow-lg border-0 rounded-4 animate__animated animate__fadeInUp animate__delay-1s">
                <div className="card-header bg-success text-white py-3 border-0 rounded-top-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <span className="fs-4">➡️</span> Próximos Atendimentos
                    </h5>
                    <Link to="/medico/agenda" className="btn btn-light btn-sm fw-bold rounded-pill px-3">
                        Ver Agenda Completa
                    </Link>
                </div>
                <div className="card-body p-0">
                    {proximasConsultas.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {proximasConsultas.map((consulta) => (
                                <li key={consulta.id} className="list-group-item d-flex justify-content-between align-items-center p-4">
                                    <div>
                                        <p className="mb-1 fw-bold text-dark fs-5">{consulta.pacienteNome}</p>
                                        <span className="badge bg-secondary-subtle text-secondary fw-bold" style={{ fontSize: '0.75rem' }}>
                                            {consulta.horario} - {consulta.status}
                                        </span>
                                    </div>
                                    <Link to={`/medico/atendimento/${consulta.id}`} className="btn btn-success fw-bold rounded-pill px-4 py-2 shadow-sm">
                                        Iniciar Atendimento
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-muted">
                            <p className="mb-0">Nenhuma consulta agendada para as próximas horas.</p>
                            <Link to="/medico/agenda" className="btn btn-outline-success mt-3 rounded-pill fw-bold">
                                Ver toda a agenda
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -1px; }
                .shadow-xs { box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075)!important; }
                .card-header.bg-success {
                    background: linear-gradient(45deg, #198754, #146c43) !important;
                }
            `}</style>
        </div>
    );
}

export default MedicoDashboard;