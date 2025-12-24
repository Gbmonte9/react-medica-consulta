// src/pages/Medico/MedicoAtendimento.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';

function MedicoAtendimento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();

    // Estados para dados do atendimento
    const [paciente, setPaciente] = useState(null);
    const [evolucao, setEvolucao] = useState('');
    const [prescricao, setPrescricao] = useState('');
    const [diagnostico, setDiagnostico] = useState('');

    useEffect(() => {
        const carregarDadosConsulta = async () => {
            setIsLoading(true);
            try {
                // Simulação de busca de dados no backend
                // No futuro: const data = await buscarConsultaPorId(id);
                setTimeout(() => {
                    setPaciente({
                        nome: "Maria Silva",
                        idade: 34,
                        cpf: "123.456.789-00",
                        motivo: "Dores de cabeça persistentes e cansaço.",
                        historico: "Hipertensa, faz uso de Enalapril."
                    });
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error("Erro ao carregar consulta", error);
                setIsLoading(false);
            }
        };

        carregarDadosConsulta();
    }, [id, setIsLoading]);

    const handleFinalizarAtendimento = (e) => {
        e.preventDefault();
        if (window.confirm("Deseja realmente finalizar este atendimento e salvar no histórico?")) {
            console.log("Salvando:", { evolucao, prescricao, diagnostico });
            alert("Atendimento finalizado com sucesso!");
            navigate('/medico/agenda');
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {/* Header de Atendimento */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <span className="badge bg-success mb-2">ATENDIMENTO EM CURSO</span>
                    <h2 className="fw-black text-dark tracking-tighter mb-0">Atendimento #{id}</h2>
                </div>
                <div className="text-end">
                    <button onClick={() => navigate(-1)} className="btn btn-light border fw-bold rounded-pill px-4 me-2">
                        Voltar
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* COLUNA ESQUERDA: Ficha do Paciente */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-light">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
                                👤 Ficha do Paciente
                            </h5>
                            
                            <div className="mb-4">
                                <label className="text-muted small fw-bold text-uppercase">Nome Completo</label>
                                <p className="fw-bold mb-0 fs-5">{paciente?.nome}</p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-6">
                                    <label className="text-muted small fw-bold text-uppercase">CPF</label>
                                    <p className="fw-medium mb-0">{paciente?.cpf}</p>
                                </div>
                                <div className="col-6">
                                    <label className="text-muted small fw-bold text-uppercase">Idade</label>
                                    <p className="fw-medium mb-0">{paciente?.idade} anos</p>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-4">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Motivo da Consulta</label>
                                <div className="bg-white p-3 rounded-3 border">
                                    <p className="mb-0 small">{paciente?.motivo}</p>
                                </div>
                            </div>

                            <div className="mb-0">
                                <label className="text-muted small fw-bold text-uppercase d-block mb-1">Histórico/Alergias</label>
                                <div className="bg-white p-3 rounded-3 border">
                                    <p className="mb-0 small text-danger fw-medium">{paciente?.historico}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: Prontuário (Formulário) */}
                <div className="col-lg-8">
                    <form onSubmit={handleFinalizarAtendimento} className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
                                ✍️ Evolução Médica
                            </h5>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase">Diagnóstico / CID</label>
                                <input 
                                    type="text" 
                                    className="form-control border-2 shadow-none" 
                                    placeholder="Ex: Cefaleia Tensional - G44.2"
                                    value={diagnostico}
                                    onChange={(e) => setDiagnostico(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase">Evolução Clínica e Notas</label>
                                <textarea 
                                    className="form-control border-2 shadow-none" 
                                    rows="6"
                                    placeholder="Descreva o quadro clínico, exames físicos e observações..."
                                    value={evolucao}
                                    onChange={(e) => setEvolucao(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-uppercase">Prescrição / Conduta</label>
                                <textarea 
                                    className="form-control border-2 shadow-none bg-light-success" 
                                    rows="4"
                                    style={{ backgroundColor: '#f0fff4' }}
                                    placeholder="Medicamentos, dosagens e orientações ao paciente..."
                                    value={prescricao}
                                    onChange={(e) => setPrescricao(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="d-grid pt-2">
                                <button type="submit" className="btn btn-success btn-lg fw-black text-uppercase py-3 rounded-4 shadow">
                                    💾 Finalizar e Assinar Atendimento
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .bg-light-success { background-color: #f8fff9; }
                .form-control:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.1); }
            `}</style>
        </div>
    );
}

export default MedicoAtendimento;