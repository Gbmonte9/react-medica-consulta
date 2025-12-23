import React, { useState, useEffect } from 'react'; 
import { registrarHistorico, buscarHistoricoPorConsultaId, atualizarHistorico } from '../../api/historicosService'; 

function HistoricoRegistroModal({ isOpen, onClose, consulta, onHistoricoSuccess }) {
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');
    const [historicoId, setHistoricoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- MAPEAMENTO SEGURO DE DADOS ---
    const nomePaciente = 
        consulta?.paciente?.nome || 
        consulta?.paciente?.nomeUsuario || 
        (consulta?.paciente?.usuario ? consulta.paciente.usuario.nome : "Paciente não identificado");

    const nomeMedico = 
        consulta?.medico?.nome || 
        consulta?.medico?.nomeUsuario || 
        (consulta?.medico?.usuario ? consulta.medico.usuario.nome : "Médico não identificado");

    const motivoConsulta = consulta?.motivo || "Não informado pelo paciente";
    const consultaId = consulta?.id;

    useEffect(() => {
        const carregarHistorico = async () => {
            if (isOpen && consultaId) {
                try {
                    setLoading(true);
                    setError(null);
                    const dado = await buscarHistoricoPorConsultaId(consultaId);
                    if (dado) {
                        setObservacoes(dado.observacoes || '');
                        setReceita(dado.receita || '');
                        setHistoricoId(dado.id);
                    } else { 
                        resetForm(); 
                    }
                } catch (err) { 
                    // Se não encontrar histórico, apenas reseta para criação
                    resetForm(); 
                } finally { 
                    setLoading(false); 
                }
            }
        };

        carregarHistorico();

        if (!isOpen) {
            resetForm();
            setError(null);
        }
    }, [isOpen, consultaId]);

    const resetForm = () => { 
        setObservacoes(''); 
        setReceita(''); 
        setHistoricoId(null); 
    };

    const handleSalvar = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        const historicoData = { 
            consultaId, 
            observacoes, 
            receita 
        };

        try {
            if (historicoId) { 
                await atualizarHistorico(historicoId, historicoData); 
            } else { 
                await registrarHistorico(historicoData); 
            }
            onHistoricoSuccess();
            onClose();
        } catch (err) { 
            setError(err.message || 'Falha ao salvar o registro clínico.'); 
        } finally { 
            setLoading(false); 
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    
                    <div className="modal-header bg-dark text-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="modal-title fw-black text-uppercase small tracking-widest mb-0">
                            {historicoId ? '📄 Prontuário Clínico' : '✍️ Registrar Evolução'}
                        </h5>
                        <button onClick={onClose} className="btn-close btn-close-white shadow-none"></button>
                    </div>
                    
                    <div className="modal-body p-0">
                        {/* Box de Informação do Atendimento */}
                        <div className="bg-light p-4 border-bottom">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Paciente</span>
                                    <div className="fw-black text-dark text-uppercase">{nomePaciente}</div>
                                </div>
                                <div className="col-md-4">
                                    <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Profissional Responsável</span>
                                    <div className="fw-bold text-primary">{nomeMedico}</div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                    <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>ID Consulta</span>
                                    <div className="font-monospace small text-secondary">#{consultaId?.toString().substring(0,8)}...</div>
                                </div>
                                
                                {/* EXIBIÇÃO DO MOTIVO DA CONSULTA - CONTEXTO PARA O MÉDICO */}
                                <div className="col-12 mt-3">
                                    <div className="bg-white p-2 px-3 rounded-3 border-start border-4 border-warning shadow-sm">
                                        <span className="text-muted fw-bold uppercase" style={{fontSize: '9px'}}>Motivo do Agendamento (Queixa Principal)</span>
                                        <div className="text-dark small fw-medium">{motivoConsulta}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSalvar} className="p-4">
                            {error && <div className="alert alert-danger border-0 small fw-bold mb-4">{error}</div>}

                            <div className="mb-4">
                                <label className="form-label fw-black text-muted uppercase" style={{fontSize: '11px'}}>Observações e Diagnóstico</label>
                                <textarea rows="5" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} 
                                    className="form-control border-0 bg-light p-3 rounded-3 shadow-none fw-medium" 
                                    placeholder="Descreva detalhadamente o atendimento, sintomas e diagnóstico..." required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-black text-muted uppercase" style={{fontSize: '11px'}}>Receituário / Prescrição</label>
                                <textarea rows="3" value={receita} onChange={(e) => setReceita(e.target.value)} 
                                    className="form-control border-0 bg-light p-3 rounded-3 shadow-none fw-medium" 
                                    placeholder="Medicamentos, dosagens ou orientações de conduta..." />
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer bg-light border-0 px-4 py-3">
                        <button type="button" onClick={onClose} className="btn btn-link text-muted fw-bold text-decoration-none uppercase small">Fechar</button>
                        <button onClick={handleSalvar} disabled={loading} className="btn btn-dark px-5 py-2 rounded-3 fw-black uppercase shadow-sm">
                            {loading ? 'Sincronizando...' : 'Salvar Registro'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoricoRegistroModal;