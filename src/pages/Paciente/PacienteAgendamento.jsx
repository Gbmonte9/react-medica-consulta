// src/pages/Paciente/PacienteAgendamento.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { agendarConsulta, getMedicos } from '../../api/consultasService';
import { useNavigate } from 'react-router-dom';

function PacienteAgendamento() {
    // 1. Estado de Formulário
    const [medicoId, setMedicoId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [motivo, setMotivo] = useState('');
    
    // 2. Estado de Carregamento/Resposta
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Hooks
    const { user } = useAuth(); // Assume que user.id é o ID do Paciente
    const navigate = useNavigate();

    // ----------------------------------------------------
    // Efeito: Carregar a Lista de Médicos
    // ----------------------------------------------------
    useEffect(() => {
        const fetchMedicos = async () => {
            try {
                const data = await getMedicos();
                setMedicos(data);
            } catch (err) {
                setError('Não foi possível carregar a lista de médicos.');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicos();
    }, []);

    // ----------------------------------------------------
    // Função: Submissão do Agendamento
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        // Prepara os dados (incluindo o ID do paciente logado)
        const dadosAgendamento = {
            pacienteId: user.id, 
            medicoId: parseInt(medicoId), 
            dataHora: dataHora, 
            motivo: motivo,
        };

        try {
            await agendarConsulta(dadosAgendamento);
            setSuccess('Consulta agendada com sucesso! Você será redirecionado.');
            
            // Redireciona para o Painel do Paciente após 3 segundos
            setTimeout(() => {
                navigate('/paciente');
            }, 3000);

        } catch (err) {
            console.error("Erro no agendamento:", err);
            setError(err.message || 'Ocorreu um erro desconhecido ao agendar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ----------------------------------------------------
    // 4. Renderização
    // ----------------------------------------------------
    if (loading) {
        return <div className="container mt-5 text-center text-white">Carregando formulário...</div>;
    }

    return (
        <div className="container mt-4 text-white">
            <h2 className="mb-4">Agendar Nova Consulta</h2>
            
            <div className="card bg-dark text-white border-secondary p-4">
                
                {/* Mensagens de Sucesso/Erro */}
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo Médico */}
                    <div className="mb-3">
                        <label htmlFor="medico" className="form-label">Selecione o Médico</label>
                        <select
                            id="medico"
                            className="form-select"
                            value={medicoId}
                            onChange={(e) => setMedicoId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Escolha um médico...</option>
                            {medicos.map(medico => (
                                <option key={medico.id} value={medico.id}>
                                    {medico.nome} ({medico.especialidade})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo Data e Hora */}
                    <div className="mb-3">
                        <label htmlFor="dataHora" className="form-label">Data e Hora</label>
                        <input
                            type="datetime-local" // HTML5 facilita a seleção de data/hora
                            className="form-control"
                            id="dataHora"
                            value={dataHora}
                            onChange={(e) => setDataHora(e.target.value)}
                            required
                            min={new Date().toISOString().slice(0, 16)} // Bloqueia datas passadas
                        />
                    </div>

                    {/* Campo Motivo */}
                    <div className="mb-3">
                        <label htmlFor="motivo" className="form-label">Motivo da Consulta</label>
                        <textarea
                            id="motivo"
                            className="form-control"
                            rows="3"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Botão de Agendamento */}
                    <button
                        type="submit"
                        className="btn btn-success w-100"
                        disabled={isSubmitting || !medicoId || !dataHora}
                    >
                        {isSubmitting ? 'Verificando Disponibilidade...' : 'Confirmar Agendamento'}
                    </button>
                    
                </form>
            </div>
        </div>
    );
}

export default PacienteAgendamento;