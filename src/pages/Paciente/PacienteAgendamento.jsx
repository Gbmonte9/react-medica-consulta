import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agendarConsulta } from '../../api/consultasService'; // Usando sua função agendarConsulta
import { listarTodosMedicos } from '../../api/medicoService';  // Integrando o médicoService
import { useLoading } from '../../contexts/LoadingContext';
import Swal from 'sweetalert2';

function PacienteAgendamento() {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    
    const [medicos, setMedicos] = useState([]);
    const [formData, setFormData] = useState({
        medicoId: '',
        dataHora: '',
        motivo: ''
    });

    // Carregar médicos ao montar o componente
    useEffect(() => {
        const carregarMedicos = async () => {
            try {
                setIsLoading(true);
                const dados = await listarTodosMedicos();
                setMedicos(dados);
            } catch (error) {
                console.error("Erro ao carregar médicos:", error);
                Swal.fire('Erro', 'Não foi possível carregar a lista de médicos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        carregarMedicos();
    }, [setIsLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica de data retroativa
        if (new Date(formData.dataHora) < new Date()) {
            return Swal.fire('Atenção', 'Não é possível agendar em datas passadas.', 'warning');
        }

        try {
            setIsLoading(true);
            
            // Ajuste os nomes das propriedades conforme seu DTO do Spring Boot
            // Geralmente espera: { medicoId: Long, dataHora: String/Date, ... }
            await agendarConsulta({
                medico: { id: formData.medicoId }, // Se o seu back esperar o objeto medico completo
                dataHora: formData.dataHora,
                motivo: formData.motivo
            });

            await Swal.fire({
                icon: 'success',
                title: 'Agendado com Sucesso!',
                text: 'Sua consulta foi registrada no sistema.',
                confirmButtonColor: '#0dcaf0',
                borderRadius: '15px'
            });

            navigate('/paciente/consultas');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Falha no Agendamento',
                text: error.message || 'Verifique a disponibilidade do horário.',
                confirmButtonColor: '#343a40'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-5 text-center">
                <span className="badge bg-info-subtle text-info fw-black uppercase px-3 py-2 mb-2">Novo Atendimento</span>
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1">Agendar Consulta</h2>
                <p className="text-muted small fw-bold uppercase">Preencha os dados abaixo para reservar seu horário</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <form onSubmit={handleSubmit}>
                            
                            {/* Seleção de Médico */}
                            <div className="mb-4">
                                <label className="form-label fw-black uppercase small text-muted mb-2">Escolha o Profissional</label>
                                <select 
                                    className="form-select form-select-lg border-2 shadow-none fw-bold" 
                                    style={{ borderRadius: '12px', fontSize: '15px' }}
                                    required
                                    value={formData.medicoId}
                                    onChange={(e) => setFormData({...formData, medicoId: e.target.value})}
                                >
                                    <option value="">Clique para selecionar um médico...</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.nome} — {m.especialidade}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Seleção de Data e Hora */}
                            <div className="mb-4">
                                <label className="form-label fw-black uppercase small text-muted mb-2">Data e Horário</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control form-control-lg border-2 shadow-none fw-bold"
                                    style={{ borderRadius: '12px', fontSize: '15px' }}
                                    required
                                    value={formData.dataHora}
                                    onChange={(e) => setFormData({...formData, dataHora: e.target.value})}
                                />
                                <small className="text-muted mt-2 d-block fw-medium">
                                    * Horário de Brasília
                                </small>
                            </div>

                            {/* Motivo */}
                            <div className="mb-5">
                                <label className="form-label fw-black uppercase small text-muted mb-2">Motivo / Sintomas (Opcional)</label>
                                <textarea 
                                    className="form-control border-2 shadow-none fw-medium" 
                                    style={{ borderRadius: '12px' }}
                                    rows="3"
                                    placeholder="Descreva brevemente o motivo da sua visita..."
                                    value={formData.motivo}
                                    onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                                ></textarea>
                            </div>

                            {/* Botões */}
                            <div className="d-grid gap-3">
                                <button type="submit" className="btn btn-info btn-lg text-white fw-black uppercase py-3 shadow-sm border-0 hvr-grow"
                                        style={{ borderRadius: '14px', letterSpacing: '1px' }}>
                                    Finalizar Agendamento
                                </button>
                                <button type="button" onClick={() => navigate(-1)} className="btn btn-light btn-lg fw-black uppercase py-3 border-0 text-muted"
                                        style={{ borderRadius: '14px' }}>
                                    Voltar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .form-select, .form-control { border-color: #f1f3f5; background-color: #f8f9fa; }
                .form-select:focus, .form-control:focus { border-color: #0dcaf0; background-color: #fff; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .hvr-grow { transition: transform 0.2s; }
                .hvr-grow:hover { transform: scale(1.02); }
            `}</style>
        </div>
    );
}

export default PacienteAgendamento;