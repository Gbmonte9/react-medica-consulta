import React, { useState, useEffect } from 'react';

import { 
    listarMedicos, 
    removerMedico,
    criarMedico,     
    atualizarMedico  
} from '../../api/medicoService'; 

import MedicoFormModal from '../../pages/Medico/MedicoFormModal'; 


function AdminMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoEditando, setMedicoEditando] = useState(null); 


    // --------------------------------------------------------------------
    // Lógica de Carregamento de Dados
    // --------------------------------------------------------------------
    const fetchMedicos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listarMedicos();
            setMedicos(data);
        } catch (err) {
            console.error("Erro ao buscar médicos:", err);
            setError(err.message || 'Erro desconhecido ao carregar médicos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicos();
    }, []);

    // --------------------------------------------------------------------
    // Handlers de Modal
    // --------------------------------------------------------------------
    const handleNovo = () => {
        setMedicoEditando(null); 
        setIsModalOpen(true);
    };

    const handleEditar = (medico) => {
        setMedicoEditando(medico); 
        setIsModalOpen(true);
    };

    const handleSalvar = async (medicoData) => {
        try {
            if (medicoEditando) {
                // ATUALIZAÇÃO (PUT)
                await atualizarMedico(medicoEditando.id, medicoData);
                alert('Médico atualizado com sucesso!');
            } else {
                // CRIAÇÃO (POST)
                await criarMedico(medicoData);
                alert('Médico cadastrado com sucesso!');
            }
            
            setIsModalOpen(false);
            fetchMedicos();      

        } catch (err) {
            console.error("Erro ao salvar médico:", err);
            alert(`Falha ao salvar médico: ${err.message}`);
        }
    };

    // --------------------------------------------------------------------
    // Lógica de Remoção
    // --------------------------------------------------------------------
    const handleRemover = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja remover o médico ${nome}?`)) {
            return;
        }
        try {
            await removerMedico(id);
            fetchMedicos(); 
            alert(`Médico ${nome} removido com sucesso.`);
        } catch (err) {
            console.error("Erro ao remover médico:", err);
            alert(`Falha ao remover médico: ${err.message}`);
        }
    };

    // --------------------------------------------------------------------

    if (loading) return <div className="p-4 text-center text-blue-600">Carregando lista de médicos...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-2xl font-semibold">Gestão de Médicos</h2>
                <button 
                    onClick={handleNovo} 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                    + Novo Médico
                </button>
            </header>

            {medicos.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">Nenhum médico cadastrado.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRM</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {medicos.map((medico) => (
                                <tr key={medico.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medico.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.crm}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.especialidade}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medico.email}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
                                        <button 
                                            onClick={() => handleEditar(medico)}
                                            className="text-blue-600 hover:text-blue-900" 
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleRemover(medico.id, medico.nome)}
                                            className="text-red-600 hover:text-red-900" 
                                            title="Remover"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* RENDERIZAÇÃO DO MODAL/FORMULÁRIO */}
            {isModalOpen && (
                <MedicoFormModal
                    isOpen={isModalOpen}
                    medico={medicoEditando} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSalvar}
                />
            )}
        </div>
    );
}

export default AdminMedicos;