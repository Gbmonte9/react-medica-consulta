import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { listarMinhasConsultas } from '../../api/consultasService';

function PatientDashboard() {
    const { user } = useAuth();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();
    
    const [proximaConsulta, setProximaConsulta] = useState(null);
    const [estatisticas, setEstatisticas] = useState({
        totalConsultas: 0,
        receitasAtivas: 0, // Esses valores podem vir de outros serviços futuramente
        examesPendentes: 0
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setIsLoading(true);
                const consultas = await listarMinhasConsultas();
                
                if (consultas && consultas.length > 0) {
                    // 1. Filtrar consultas agendadas para o futuro
                    const agora = new Date();
                    const futuras = consultas
                        .filter(c => c.status === 'AGENDADA' && new Date(c.dataHora) > agora)
                        .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

                    if (futuras.length > 0) {
                        setProximaConsulta(futuras[0]);
                    }

                    // 2. Atualizar estatística de consultas totais
                    setEstatisticas(prev => ({
                        ...prev,
                        totalConsultas: consultas.length
                    }));
                }
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        carregarDados();
    }, [setIsLoading]);

    return (
        <div className="animate__animated animate__fadeIn">
            {/* BOAS VINDAS */}
            <div className="mb-5">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">
                    Olá, {user?.nome?.split(' ')[0] || 'Paciente'}! 👋
                </h2>
                <p className="text-muted small fw-bold uppercase">
                    Bem-vindo à sua central de saúde. Confira seus próximos passos.
                </p>
            </div>

            <div className="row g-4">
                {/* CARD DE PRÓXIMA CONSULTA */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="card-header bg-info py-3 border-0">
                            <h6 className="mb-0 text-white fw-black uppercase small tracking-widest">🗓️ Próximo Atendimento</h6>
                        </div>
                        <div className="card-body p-4 d-flex align-items-center">
                            {proximaConsulta ? (
                                <div className="row w-100 align-items-center">
                                    <div className="col-md-7">
                                        <h4 className="fw-black text-dark mb-1">
                                            {proximaConsulta.medico?.nome || proximaConsulta.medicoNome || "Médico não identificado"}
                                        </h4>
                                        <p className="text-info fw-bold mb-3">
                                            {proximaConsulta.medico?.especialidade || "Clínico Geral"}
                                        </p>
                                        <div className="d-flex gap-3 mb-2">
                                            <div className="bg-light p-2 rounded-3 text-center" style={{minWidth: '100px'}}>
                                                <small className="d-block text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Data</small>
                                                <span className="fw-bold">{new Date(proximaConsulta.dataHora).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="bg-light p-2 rounded-3 text-center" style={{minWidth: '100px'}}>
                                                <small className="d-block text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Hora</small>
                                                <span className="fw-bold">{new Date(proximaConsulta.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5 text-md-end mt-3 mt-md-0">
                                        <button 
                                            onClick={() => navigate('/paciente/consultas')}
                                            className="btn btn-info text-white fw-black uppercase px-4 py-2 rounded-pill shadow-sm"
                                        >
                                            Ver Minha Agenda
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center w-100 py-4">
                                    <p className="text-muted fw-bold mb-3">Você não possui consultas agendadas para os próximos dias.</p>
                                    <button onClick={() => navigate('/paciente/agendar')} className="btn btn-outline-info rounded-pill fw-black uppercase px-4">
                                        Agendar uma Consulta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CARD DE ATALHO AGENDAR */}
                <div className="col-lg-4">
                    <div className="card border-0 bg-dark text-white rounded-4 shadow-sm h-100 overflow-hidden">
                        <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                            <div className="bg-white bg-opacity-20 rounded-circle p-3 mb-3">
                                <span style={{fontSize: '2rem'}}>➕</span>
                            </div>
                            <h5 className="fw-black uppercase tracking-tighter">Novo Agendamento</h5>
                            <p className="small text-white-50 px-3">Precisa de um especialista? Marque sua consulta agora.</p>
                            <button onClick={() => navigate('/paciente/agendar')} className="btn btn-light fw-black uppercase px-4 rounded-3 w-100 mt-2">
                                Marcar Agora
                            </button>
                        </div>
                    </div>
                </div>

                {/* RESUMO DE SAÚDE */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-start border-5 border-info">
                        <h2 className="fw-black text-dark mb-0">{estatisticas.totalConsultas}</h2>
                        <p className="text-muted small fw-bold uppercase mb-0">Total de Consultas</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-start border-5 border-success">
                        <h2 className="fw-black text-dark mb-0">{estatisticas.receitasAtivas}</h2>
                        <p className="text-muted small fw-bold uppercase mb-0">Receitas Ativas</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-start border-5 border-warning">
                        <h2 className="fw-black text-dark mb-0">{estatisticas.examesPendentes}</h2>
                        <p className="text-muted small fw-bold uppercase mb-0">Exames Pendentes</p>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-widest { letter-spacing: 0.1em; }
                .bg-info { background-color: #0dcaf0 !important; }
                .text-info { color: #0dcaf0 !important; }
                .border-info { border-color: #0dcaf0 !important; }
            `}</style>
        </div>
    );
}

export default PatientDashboard;