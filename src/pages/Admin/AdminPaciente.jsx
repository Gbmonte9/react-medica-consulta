import React, { useState, useEffect } from 'react';

// Importa todas as funções do Service
import { 
    listarPacientes, 
    removerPaciente,
    criarPaciente,     // 🚨 Usaremos esta
    atualizarPaciente  // 🚨 Usaremos esta
} from '../../api/pacienteService'; 

// 🚨 NOVO: Importamos o componente de Modal/Formulário que criaremos a seguir
import PacienteFormModal from '../../pages/Paciente/PacienteFormModal'; 


function AdminPaciente() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🚨 ESTADO DO MODAL/FORMULÁRIO
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Armazena os dados do paciente se estivermos editando (ou null para criação)
    const [pacienteEditando, setPacienteEditando] = useState(null); 


    // --------------------------------------------------------------------
    // Lógica de Carregamento de Dados
    // --------------------------------------------------------------------
    const fetchPacientes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listarPacientes();
            setPacientes(data);
        } catch (err) {
            console.error("Erro ao buscar pacientes:", err);
            setError(err.message || 'Erro desconhecido ao carregar pacientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);


    // --------------------------------------------------------------------
    // Lógica para Abrir o Modal (Criação e Edição)
    // --------------------------------------------------------------------
    const handleNovo = () => {
        setPacienteEditando(null); // Limpa o formulário para criação
        setIsModalOpen(true);
    };

    const handleEditar = (paciente) => {
        setPacienteEditando(paciente); // Preenche o formulário com dados existentes
        setIsModalOpen(true);
    };


    // --------------------------------------------------------------------
    // Lógica de SALVAR (Chamará criarPaciente ou atualizarPaciente)
    // --------------------------------------------------------------------
    const handleSalvar = async (pacienteData) => {
        try {
            if (pacienteEditando) {
                // Se pacienteEditando existe, é uma ATUALIZAÇÃO (PUT)
                await atualizarPaciente(pacienteEditando.id, pacienteData);
                alert('Paciente atualizado com sucesso!');
            } else {
                // Se pacienteEditando é null, é uma CRIAÇÃO (POST)
                await criarPaciente(pacienteData);
                alert('Paciente cadastrado com sucesso!');
            }
            
            setIsModalOpen(false); // Fecha o modal
            fetchPacientes();      // Recarrega a lista para mostrar a alteração

        } catch (err) {
            console.error("Erro ao salvar paciente:", err);
            alert(`Falha ao salvar paciente: ${err.message}`);
        }
    };


    // --------------------------------------------------------------------
    // Lógica de Remoção (Já existia)
    // --------------------------------------------------------------------
    const handleRemover = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja remover o paciente ${nome}?`)) {
            return;
        }
        try {
            await removerPaciente(id);
            fetchPacientes(); 
            alert(`Paciente ${nome} removido com sucesso.`);
        } catch (err) {
            console.error("Erro ao remover paciente:", err);
            alert(`Falha ao remover paciente: ${err.message}`);
        }
    };


    if (loading) return <div className="p-4 text-center text-blue-600">Carregando lista de pacientes...</div>;
    if (error) return <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>;

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-2xl font-semibold">Gestão de Pacientes</h2>
                <button 
                    onClick={handleNovo} // 🚨 Ação de Novo Paciente
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                    + Novo Paciente
                </button>
            </header>

            {/* Tabela de Pacientes (Conteúdo Omitido para Brevidade) */}
            {pacientes.length === 0 ? (
                // ... (Div de lista vazia)
                <div className="text-center p-10 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-500">Nenhum paciente cadastrado.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* ... thead e tr ... */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pacientes.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paciente.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paciente.cpf}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paciente.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paciente.telefone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
                                        <button 
                                            onClick={() => handleEditar(paciente)} // 🚨 Ação de Edição
                                            className="text-blue-600 hover:text-blue-900" 
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleRemover(paciente.id, paciente.nome)}
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

            {/* 🚨 RENDERIZAÇÃO DO MODAL/FORMULÁRIO */}
            {isModalOpen && (
                <PacienteFormModal
                    isOpen={isModalOpen}
                    paciente={pacienteEditando} // Dados (para edição) ou null (para criação)
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSalvar}
                />
            )}
        </div>
    );
}

export default AdminPaciente;