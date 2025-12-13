import React, { useState, useEffect } from 'react';
import { agendarConsulta } from '../../api/consultasService';
import { listarMedicos, buscarMedicosPorEspecialidade } from '../../api/medicoService'; 
// Importe a função que pega o ID do usuário logado (assumindo que existe)
import { getUserId } from '../../api/authService'; 


function PacienteAgendamento() {
    const [medicos, setMedicos] = useState([]);
    const [selectedMedicoId, setSelectedMedicoId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [especialidadeFiltro, setEspecialidadeFiltro] = useState('TODAS');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --------------------------------------------------------------------
    // Carrega a lista inicial de médicos
    // --------------------------------------------------------------------
    const fetchMedicos = async (especialidade = 'TODAS') => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (especialidade === 'TODAS') {
                data = await listarMedicos();
            } else {
                data = await buscarMedicosPorEspecialidade(especialidade);
            }
            setMedicos(data);
        } catch (err) {
            setError(err.message || 'Erro ao carregar médicos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicos();
    }, []);

    const ESPECIALIDADES = useMemo(() => {
        // Gera a lista única de especialidades a partir dos médicos carregados
        const unique = [...new Set(medicos.map(m => m.especialidade))];
        return ['TODAS', ...unique].filter(e => e); // Garante que não há nulos
    }, [medicos]);

    // Lida com a mudança de filtro de especialidade
    const handleEspecialidadeChange = (e) => {
        const especialidade = e.target.value;
        setEspecialidadeFiltro(especialidade);
        setSelectedMedicoId(''); // Limpa a seleção de médico ao mudar o filtro
        fetchMedicos(especialidade);
    };


    // --------------------------------------------------------------------
    // Lógica de Agendamento
    // --------------------------------------------------------------------
    const handleAgendar = async (e) => {
        e.preventDefault();
        
        const pacienteId = getUserId(); // Supondo que você tem uma função para pegar o ID logado
        
        if (!pacienteId || !selectedMedicoId || !dataHora) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const agendamentoData = {
            pacienteId: pacienteId,
            medicoId: selectedMedicoId,
            dataConsulta: dataHora, // Deve estar no formato ISO8601 esperado pelo Backend (ex: YYYY-MM-DDTHH:MM:SS)
        };
        
        try {
            await agendarConsulta(agendamentoData);
            alert('Consulta agendada com sucesso!');
            // Limpa o formulário após sucesso
            setSelectedMedicoId('');
            setDataHora('');
        } catch (err) {
            alert(`Falha no agendamento: ${err.message}`);
        }
    };

    if (loading) return <div className="p-4 text-center text-blue-600">Carregando opções de agendamento...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Agendamento de Consulta</h2>
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <form onSubmit={handleAgendar}>
                    
                    {/* Filtro de Especialidade */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Filtrar por Especialidade</label>
                        <select
                            value={especialidadeFiltro}
                            onChange={handleEspecialidadeChange}
                            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            {ESPECIALIDADES.map(e => (
                                <option key={e} value={e}>{e === 'TODAS' ? 'Todas as Especialidades' : e}</option>
                            ))}
                        </select>
                    </div>

                    {/* Seleção do Médico */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Selecionar Médico</label>
                        <select
                            value={selectedMedicoId}
                            onChange={(e) => setSelectedMedicoId(e.target.value)}
                            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>-- Selecione um Médico --</option>
                            {medicos.map(medico => (
                                <option key={medico.id} value={medico.id}>
                                    {medico.nome} ({medico.especialidade})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data e Hora */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="dataHora">Data e Hora</label>
                        <input
                            type="datetime-local"
                            id="dataHora"
                            value={dataHora}
                            onChange={(e) => setDataHora(e.target.value)}
                            className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                    >
                        Confirmar Agendamento
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PacienteAgendamento;