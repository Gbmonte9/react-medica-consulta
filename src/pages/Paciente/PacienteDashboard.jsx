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
    const [ultimasConsultas, setUltimasConsultas] = useState([]);
    const [totalConsultas, setTotalConsultas] = useState(0);
    const [dicaDoDia, setDicaDoDia] = useState("Sua saúde é o seu bem mais precioso. Cuide-se todos os dias.");

    const getNomeExibicao = () => {
        if (user?.nome && user.nome !== 'sessao_ativa') return user.nome.split(' ')[0];
        return 'Paciente';
    };

    useEffect(() => {
        const carregarTudo = async () => {
            setIsLoading(true);
            try {
                const dicasFixas = [
                    "Beba água regularmente para manter seu corpo hidratado.",
                    "Uma boa noite de sono é fundamental para a recuperação do organismo.",
                    "Pequenas caminhadas diárias fazem uma grande diferença na saúde do coração.",
                    "Mantenha uma alimentação equilibrada e rica em nutrientes.",
                    "Prevenir é melhor que remediar: mantenha seus exames em dia."
                ];
                setDicaDoDia(dicasFixas[Math.floor(Math.random() * dicasFixas.length)]);

                if (user?.id) {
                    const consultas = await listarMinhasConsultas(user.id);
                    if (Array.isArray(consultas)) {
                        const agora = new Date();
                        const futuras = consultas
                            .filter(c => c.status === 'AGENDADA' && new Date(c.dataHora) > agora)
                            .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
                        
                        const passadas = consultas
                            .filter(c => c.status === 'REALIZADA')
                            .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
                            .slice(0, 3);

                        setProximaConsulta(futuras[0] || null);
                        setUltimasConsultas(passadas);
                        setTotalConsultas(consultas.length);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarTudo();
    }, [user?.id, setIsLoading]);

    return (
        <div className="animate__animated animate__fadeIn pb-5 container-fluid px-3 px-md-4">
            {/* CABEÇALHO RESPONSIVO */}
            <div className="mb-4 mb-md-5 text-center text-md-start">
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1 fs-2 fs-md-1">
                    Olá, {getNomeExibicao()}! 👋
                </h2>
                <p className="text-muted small fw-bold uppercase mb-0">
                    Acompanhe seu histórico e próximos agendamentos.
                </p>
            </div>

            <div className="row g-3 g-md-4">
                {/* PRÓXIMO ATENDIMENTO */}
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white border-top border-info border-5">
                        <div className="card-body p-4 p-md-5">
                            <h6 className="text-info fw-black uppercase small mb-4 tracking-widest text-center text-md-start">🗓️ Próximo Atendimento</h6>
                            {proximaConsulta ? (
                                <div className="row align-items-center text-center text-md-start">
                                    <div className="col-12 col-md-7 mb-4 mb-md-0">
                                        <h3 className="fw-black text-dark mb-1 fs-4 fs-md-3">
                                            Dr(a). {proximaConsulta.medico?.nome || proximaConsulta.medicoNome}
                                        </h3>
                                        <p className="text-muted fw-bold mb-4 uppercase small">
                                            {proximaConsulta.medico?.especialidade || 'Especialista'}
                                        </p>
                                        <div className="d-flex gap-2 gap-md-3 justify-content-center justify-content-md-start">
                                            <div className="bg-info-subtle p-2 p-md-3 rounded-4 flex-fill max-w-150">
                                                <small className="d-block text-info fw-black uppercase mb-1" style={{fontSize: '8px'}}>Data</small>
                                                <span className="fw-black text-info small-mobile">{new Date(proximaConsulta.dataHora).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="bg-info-subtle p-2 p-md-3 rounded-4 flex-fill max-w-150">
                                                <small className="d-block text-info fw-black uppercase mb-1" style={{fontSize: '8px'}}>Hora</small>
                                                <span className="fw-black text-info small-mobile">{new Date(proximaConsulta.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-5 text-md-end">
                                        <button onClick={() => navigate('/paciente/consultas')} className="btn btn-info text-white fw-black uppercase px-4 py-3 rounded-4 shadow-sm w-100 hvr-grow">
                                            Ver Agenda
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted fw-bold mb-3">Sem consultas agendadas.</p>
                                    <button onClick={() => navigate('/paciente/agendar')} className="btn btn-outline-info rounded-pill fw-black uppercase px-5 py-2">
                                        Agendar agora
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ATENDIMENTOS TOTAIS */}
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 bg-info-subtle rounded-4 shadow-sm h-100 p-4 d-flex flex-column justify-content-center align-items-center text-center">
                        <div className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center mb-3" style={{width: '55px', height: '55px'}}>
                            <span style={{fontSize: '1.2rem'}}>📈</span>
                        </div>
                        <h2 className="fw-black text-info mb-0 display-5">{totalConsultas}</h2>
                        <p className="text-info-emphasis small fw-black uppercase tracking-widest mt-1">Atendimentos</p>
                        <button onClick={() => navigate('/paciente/agendar')} className="btn btn-info text-white w-100 mt-4 fw-black uppercase py-3 rounded-4 shadow-sm hvr-grow">
                            Novo Agendamento
                        </button>
                    </div>
                </div>

                {/* HISTÓRICO RECENTE */}
                <div className="col-12 col-md-6 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 className="fw-black text-dark uppercase small mb-4">🕒 Histórico Recente</h6>
                        {ultimasConsultas.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {ultimasConsultas.map((c, index) => (
                                    <div key={index} className="list-group-item px-0 py-3 border-0 border-bottom d-flex justify-content-between align-items-center bg-transparent">
                                        <div className="me-2 text-truncate">
                                            <span className="d-block fw-black text-dark small uppercase text-truncate">{c.medico?.nome || c.medicoNome}</span>
                                            <small className="text-muted fw-bold">{new Date(c.dataHora).toLocaleDateString('pt-BR')}</small>
                                        </div>
                                        <span className="badge bg-light text-info border border-info-subtle fw-black uppercase flex-shrink-0" style={{fontSize: '8px'}}>OK</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted small py-3 text-center">Nenhum histórico.</p>
                        )}
                    </div>
                </div>

                {/* DICA DO DIA */}
                <div className="col-12 col-md-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden" style={{backgroundColor: '#e0f7fa'}}>
                        <div className="card-body p-4 p-md-5 d-flex flex-column justify-content-center min-h-150">
                            <div className="mb-3">
                                <span className="badge bg-info text-white fw-black uppercase px-3 py-2">Dica do Dia</span>
                            </div>
                            <h4 className="fw-bold text-info-emphasis mb-0 fs-5 fs-md-4 italic-style">
                                "{dicaDoDia}"
                            </h4>
                        </div>
                        <div className="position-absolute end-0 bottom-0 opacity-10 d-none d-sm-block" style={{fontSize: '6rem', marginBottom: '-1rem', marginRight: '-1rem'}}>🩺</div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .text-info { color: #0dcaf0 !important; }
                .text-info-emphasis { color: #0b5ed7 !important; }
                .btn-info { background-color: #0dcaf0 !important; border: none; }
                .hvr-grow { transition: transform 0.2s; }
                .hvr-grow:hover { transform: scale(1.01); }
                .max-w-150 { max-width: 150px; }
                .min-h-150 { min-height: 150px; }
                .italic-style { font-style: italic; line-height: 1.4; }
                
                @media (max-width: 576px) {
                    .small-mobile { font-size: 0.85rem; }
                    .fs-2 { font-size: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}

export default PatientDashboard;