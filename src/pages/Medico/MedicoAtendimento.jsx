import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { buscarConsultaPorId, finalizarConsulta } from '../../api/consultasService';
import { registrarHistorico } from '../../api/historicosService'; 
import { User, FileText, ClipboardList, ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';

function MedicoAtendimento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();

    const [consulta, setConsulta] = useState(null);
    const [evolucao, setEvolucao] = useState('');
    const [prescricao, setPrescricao] = useState('');

    const carregarDadosDaConsulta = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await buscarConsultaPorId(id);
            setConsulta(data);
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire('Erro', 'Não conseguimos carregar os dados.', 'error');
            navigate('/medico/agenda');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate, setIsLoading]);

    useEffect(() => {
        carregarDadosDaConsulta();
    }, [carregarDadosDaConsulta]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const confirmacao = await Swal.fire({
            title: 'Finalizar?',
            text: "Deseja salvar o prontuário e encerrar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Sim, finalizar'
        });

        if (confirmacao.isConfirmed) {
            setIsLoading(true);
            try {
                await registrarHistorico({
                    consultaId: id,
                    observacoes: evolucao,
                    receita: prescricao
                });
                await finalizarConsulta(id);
                await Swal.fire('Sucesso!', 'Atendimento concluído.', 'success');
                navigate('/medico/agenda');
            } catch (error) {
                Swal.fire('Erro', 'Houve um problema ao salvar.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!consulta) return null;

    return (
        <div className="container-fluid py-3 px-2 px-md-4 animate__animated animate__fadeIn">
            
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <button 
                        onClick={() => navigate('/medico/agenda')} 
                        className="btn btn-link text-muted p-0 mb-2 d-flex align-items-center gap-1 text-decoration-none fw-bold small"
                    >
                        <ArrowLeft size={16} /> VOLTAR PARA AGENDA
                    </button>
                    <h2 className="fw-black text-dark mb-0">Atendimento <span className="text-success">Ativo</span></h2>
                </div>
                <div className="d-md-none border-top pt-3"></div> 
            </div>

            <div className="row g-4">

                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <div className="p-2 bg-success-subtle rounded-3 text-success">
                                    <User size={20} />
                                </div>
                                <h6 className="fw-black text-dark mb-0 text-uppercase tracking-tighter">Paciente</h6>
                            </div>
                        </div>
                        <div className="card-body px-4">
                            <div className="mb-3">
                                <label className="text-muted small fw-bold d-block text-uppercase">Nome Completo</label>
                                <span className="fw-bold text-dark fs-5">{consulta.paciente?.nome}</span>
                            </div>
                            <div className="mb-4">
                                <label className="text-muted small fw-bold d-block text-uppercase">Contato</label>
                                <span className="text-dark small">{consulta.paciente?.email}</span>
                            </div>
                            
                            <div className="p-3 bg-light rounded-4">
                                <div className="d-flex align-items-center gap-2 mb-2 text-success">
                                    <ClipboardList size={16} />
                                    <span className="small fw-black text-uppercase">Queixa Principal</span>
                                </div>
                                <p className="small text-muted mb-0 italic">
                                    {consulta.motivo || 'Nenhum motivo informado pelo paciente.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-8">
                    <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-3 p-md-4">
                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                                        <FileText size={20} />
                                    </div>
                                    <h6 className="fw-black text-dark mb-0 text-uppercase tracking-tighter">Evolução Clínica</h6>
                                </div>
                                <textarea 
                                    className="form-control border-0 bg-light p-3 rounded-4" 
                                    rows="8" 
                                    placeholder="Descreva detalhadamente o quadro do paciente..."
                                    value={evolucao}
                                    onChange={(e) => setEvolucao(e.target.value)}
                                    required
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div className="p-2 bg-warning-subtle rounded-3 text-warning">
                                        <Save size={20} />
                                    </div>
                                    <h6 className="fw-black text-dark mb-0 text-uppercase tracking-tighter">Prescrição e Recomendações</h6>
                                </div>
                                <textarea 
                                    className="form-control border-0 p-3 rounded-4" 
                                    rows="5"
                                    style={{ backgroundColor: '#fafffa', border: '1px dashed #d1e7dd !important', resize: 'none' }}
                                    placeholder="Medicamentos, dosagem e orientações de repouso..."
                                    value={prescricao}
                                    onChange={(e) => setPrescricao(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-success w-100 py-3 fw-black rounded-4 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
                                <Save size={20} /> FINALIZAR E SALVAR ATENDIMENTO
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -0.5px; }
                .bg-success-subtle { background-color: #e8f5e9; }
                .bg-primary-subtle { background-color: #e3f2fd; }
                .bg-warning-subtle { background-color: #fff8e1; }
                .form-control:focus {
                    background-color: #fff;
                    box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.1);
                    border: 1px solid #198754 !important;
                }
                .italic { font-style: italic; }
            `}</style>
        </div>
    );
}

export default MedicoAtendimento;