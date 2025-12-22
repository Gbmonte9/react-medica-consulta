import React, { useState, useEffect } from 'react';
import { 
    listarMedicos, 
    removerMedico,
    criarMedico,     
    atualizarMedico  
} from '../../api/medicoService'; 
import MedicoFormModal from '../../components/modals/MedicoFormModal'; 

function AdminMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicoEditando, setMedicoEditando] = useState(null); 

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

    const handleNovo = () => {
        setMedicoEditando(null); 
        setIsModalOpen(true);
    };

    const handleEditar = (medico) => {
        // Padronizamos os dados para o Modal, convertendo os campos do Java
        const dadosParaModal = {
            id: medico.id,
            nome: medico.nomeUsuario || medico.nome, // Dependendo de como seu DTO retorna
            email: medico.emailUsuario || medico.email,
            crm: medico.crm,
            especialidade: medico.especialidade,
            telefone: medico.telefone,
            senha: "" // Senha sempre vazia na edição
        };
        setMedicoEditando(dadosParaModal); 
        setIsModalOpen(true);
    };

    const handleSalvar = async (medicoData) => {
        try {
            // Adicionamos o tipo MEDICO automaticamente
            const payload = { 
                ...medicoData, 
                tipo: 'MEDICO' 
            };

            if (medicoEditando && medicoEditando.id) {
                // Se for edição e a senha estiver vazia, removemos para manter a antiga
                if (!payload.senha || payload.senha.trim() === "") {
                    delete payload.senha;
                }
                
                await atualizarMedico(medicoEditando.id, payload);
                alert('Médico atualizado com sucesso!');
            } else {
                // Para novo médico, validamos a senha
                if (!payload.senha) {
                    alert("A senha é obrigatória para novos cadastros!");
                    return;
                }
                await criarMedico(payload);
                alert('Médico cadastrado com sucesso!');
            }
            
            setIsModalOpen(false);
            fetchMedicos();      
        } catch (err) {
            console.error("Erro ao salvar médico:", err);
            alert(`Falha ao salvar médico: ${err.message}`);
        }
    };

    const handleRemover = async (id, nome) => {
        const nomeMedico = nome || "este médico";
        if (!window.confirm(`Tem certeza que deseja remover o médico ${nomeMedico}?`)) {
            return;
        }
        try {
            await removerMedico(id);
            fetchMedicos(); 
            alert(`Médico removido com sucesso.`);
        } catch (err) {
            console.error("Erro ao remover médico:", err);
            alert(`Falha ao remover médico: ${err.message}`);
        }
    };

    if (loading) return <div className="p-4 text-center text-blue-600 font-medium">Carregando médicos...</div>;
    if (error) return <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md m-4">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800">Gestão de Médicos</h2>
                <button 
                    onClick={handleNovo} 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                >
                    + Novo Médico
                </button>
            </header>

            {medicos.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow">
                    <p className="text-xl text-gray-400">Nenhum médico cadastrado no sistema.</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Nome</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">CRM</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Especialidade</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {medicos.map((medico) => (
                                <tr key={medico.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {medico.nomeUsuario || medico.nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {medico.crm}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {medico.especialidade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center space-x-6">
                                        <button 
                                            onClick={() => handleEditar(medico)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                                            title="Editar Médico"
                                        >
                                            <span className="mr-1">✏️</span> Editar
                                        </button>
                                        <button 
                                            onClick={() => handleRemover(medico.id, medico.nomeUsuario || medico.nome)}
                                            className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                                            title="Remover Médico"
                                        >
                                            <span className="mr-1">🗑️</span> Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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