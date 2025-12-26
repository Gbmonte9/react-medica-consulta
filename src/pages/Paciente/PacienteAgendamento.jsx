import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agendarConsulta } from '../../api/consultasService'; 
import { listarTodosMedicos } from '../../api/medicoService';  
import { getUserId } from '../../api/authService'; 
import { useLoading } from '../../contexts/LoadingContext';
import Swal from 'sweetalert2';

function PacienteAgendamento() {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    
    const [medicos, setMedicos] = useState([]);
    const [medicoSelecionadoNome, setMedicoSelecionadoNome] = useState('');
    const [formData, setFormData] = useState({
        medicoId: '',
        dataHora: '',
        motivo: ''
    });

    useEffect(() => {
        const carregarMedicos = async () => {
            try {
                setIsLoading(true);
                const dados = await listarTodosMedicos();
                setMedicos(Array.isArray(dados) ? dados : []);
            } catch (error) {
                Swal.fire('Erro', 'Não foi possível carregar a lista de médicos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        carregarMedicos();
    }, [setIsLoading]);

    const extrairNomeMedico = (m) => {
        if (!m) return '';
        return m.usuario?.nome || m.nome || m.nomeUsuario || 'Profissional'; 
    };

    const handleMedicoChange = (e) => {
        const id = e.target.value;
        const medicoObj = medicos.find(m => String(m.id) === String(id));
        setFormData({ ...formData, medicoId: id });
        setMedicoSelecionadoNome(medicoObj ? extrairNomeMedico(medicoObj) : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.medicoId) {
            return Swal.fire('Atenção', 'Selecione um médico.', 'warning');
        }

        const dataSelecionada = new Date(formData.dataHora);
        if (dataSelecionada < new Date()) {
            return Swal.fire('Atenção', 'Não é possível agendar em datas passadas.', 'warning');
        }

        try {
            setIsLoading(true);
            const pacienteId = getUserId();

            const dataFormatada = formData.dataHora.includes(':') && formData.dataHora.length === 16 
                ? `${formData.dataHora}:00` 
                : formData.dataHora;

            const agendamentoParaEnviar = {
                pacienteId: pacienteId,
                medicoId: formData.medicoId,
                dataHora: dataFormatada,
                motivo: formData.motivo
            };

            await agendarConsulta(agendamentoParaEnviar);

            await Swal.fire({
                icon: 'success',
                title: 'Agendado com Sucesso!',
                text: `Sua consulta com Dr(a). ${medicoSelecionadoNome} foi registrada.`,
                confirmButtonColor: '#0dcaf0'
            });

            navigate('/paciente/consultas');
        } catch (error) {
            const msgServidor = error.response?.data?.message || 
                               error.response?.data?.[0]?.message || 
                               "Verifique o horário ou a disponibilidade.";
            
            Swal.fire({
                icon: 'error',
                title: 'Erro no Agendamento',
                text: msgServidor,
                confirmButtonColor: '#343a40'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn py-3 py-md-5 px-3">
        
            <div className="mb-4 mb-md-5 text-center px-2">
                <span className="badge bg-info-subtle text-info fw-black uppercase px-3 py-2 mb-2" style={{ fontSize: '10px' }}>
                    Novo Agendamento
                </span>
                <h2 className="fw-black text-dark uppercase tracking-tighter mb-1 fs-3 fs-md-2">
                    Agendar Consulta
                </h2>
                <p className="text-muted small fw-bold uppercase d-none d-sm-block">
                    Preencha os dados para confirmar seu atendimento
                </p>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="bg-info" style={{ height: '6px' }}></div>
                        
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                
                                <div className="mb-4">
                                    <label className="form-label fw-black uppercase small text-muted mb-2">Profissional</label>
                                    <select 
                                        className="form-select form-select-lg border-2 shadow-none fw-bold fs-6" 
                                        style={{ borderRadius: '12px' }}
                                        required
                                        value={formData.medicoId}
                                        onChange={handleMedicoChange}
                                    >
                                        <option value="">Selecione o médico...</option>
                                        {medicos.map(m => (
                                            <option key={m.id} value={m.id}>
                                                Dr(a). {extrairNomeMedico(m)} — {m.especialidade}
                                            </option>
                                        ))}
                                    </select>
                                    {medicoSelecionadoNome && (
                                        <div className="mt-2 text-info small fw-black uppercase animate__animated animate__fadeIn" style={{ fontSize: '11px' }}>
                                            ✓ Selecionado: {medicoSelecionadoNome}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-black uppercase small text-muted mb-2">Data e Horário</label>
                                    <input 
                                        type="datetime-local" 
                                        className="form-control form-control-lg border-2 shadow-none fw-bold fs-6"
                                        style={{ borderRadius: '12px' }}
                                        required
                                        value={formData.dataHora}
                                        onChange={(e) => setFormData({...formData, dataHora: e.target.value})}
                                    />
                                </div>

                                <div className="mb-4 mb-md-5">
                                    <label className="form-label fw-black uppercase small text-muted mb-2">Motivo da Consulta</label>
                                    <textarea 
                                        className="form-control border-2 shadow-none fw-medium" 
                                        style={{ borderRadius: '12px', fontSize: '14px', minHeight: '100px' }}
                                        rows="3"
                                        required
                                        placeholder="Ex: Dores nas costas, check-up anual..."
                                        value={formData.motivo}
                                        onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-3">
                                    <button type="submit" className="btn text-white fw-black uppercase py-3 shadow-sm border-0 hvr-grow"
                                            style={{ borderRadius: '14px', letterSpacing: '1px', backgroundColor: '#0dcaf0' }}>
                                        Finalizar Agendamento
                                    </button>
                                    <button type="button" onClick={() => navigate(-1)} className="btn btn-light btn-lg fw-black uppercase py-3 border-0 text-muted fs-6"
                                            style={{ borderRadius: '14px' }}>
                                        Voltar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .tracking-tighter { letter-spacing: -0.05em; }
                .form-select, .form-control { border-color: #f1f3f5; background-color: #f8f9fa; transition: all 0.2s; }
                .form-select:focus, .form-control:focus { border-color: #0dcaf0; background-color: #fff; box-shadow: none; }
                .text-info { color: #0dcaf0 !important; }
                .bg-info-subtle { background-color: #e0f7fa !important; }
                .hvr-grow { transition: transform 0.2s; }
                .hvr-grow:hover { transform: scale(1.01); }
                
                /* Ajuste para inputs no mobile não darem zoom forçado no iOS */
                @media (max-width: 768px) {
                    input, select, textarea { font-size: 16px !important; }
                    .card-body { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}

export default PacienteAgendamento;