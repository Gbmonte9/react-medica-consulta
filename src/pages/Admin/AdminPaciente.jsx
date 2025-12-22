// src/pages/Admin/AdminPaciente.jsx

import React, { useState, useEffect } from 'react';
import { 
    listarPacientes, 
    removerPaciente,
    criarPaciente,     
    atualizarPaciente  
} from '../../api/pacienteService'; 
import PacienteFormModal from '../../components/modals/PacienteFormModal'; 

function AdminPaciente() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null); 

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

    const handleNovo = () => {
        setPacienteEditando(null);
        setIsModalOpen(true);
    };

    const handleEditar = (paciente) => {
        // Mapeamos os dados que vêm do objeto 'usuario' dentro do paciente
        const dadosParaModal = {
            id: paciente.id,
            nome: paciente.nomeUsuario, 
            email: paciente.emailUsuario,
            telefone: paciente.telefone,
            cpf: "",    // CPF não mostramos por ser Hash
            senha: ""   // Senha nunca vem do banco, deixamos vazio para o admin decidir se troca
        };
        setPacienteEditando(dadosParaModal);
        setIsModalOpen(true);
    };

    const handleSalvar = async (pacienteData) => {
    
        try {

            const payload = { 
                ...pacienteData, 
                tipo: 'PACIENTE' 
            };

            if (pacienteEditando && pacienteEditando.id) {
           
                if (!payload.senha || payload.senha.trim() === "") {
                    delete payload.senha;
                }
                
                if (!payload.cpf || payload.cpf.trim() === "") {
                    delete payload.cpf;
                }

                await atualizarPaciente(pacienteEditando.id, payload);
                alert('Dados atualizados com sucesso!');
            } else {
            
                if (!payload.senha) {
                    alert("A senha é obrigatória para novos cadastros!");
                    return;
                }
                
                await criarPaciente(payload);
                alert('Paciente cadastrado com sucesso!');
            }
            
            setIsModalOpen(false);
            fetchPacientes();
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert(`Erro: ${err.message}`);
        }

    };

    const handleRemover = async (id, nome) => {
        if (!window.confirm(`Deseja remover o paciente ${nome}?`)) return;
        try {
            await removerPaciente(id);
            fetchPacientes(); 
            alert(`Removido com sucesso.`);
        } catch (err) {
            alert(`Falha ao remover: ${err.message}`);
        }
    };

    if (loading) return <div className="p-4 text-center text-blue-600 font-medium">Carregando...</div>;
    if (error) return <div className="p-4 text-red-600 bg-red-50 m-4 rounded border">{error}</div>;

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Pacientes</h2>
                <button 
                    onClick={handleNovo}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-md"
                >
                    + Novo Paciente
                </button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Telefone</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{paciente.nomeUsuario}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{paciente.emailUsuario}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{paciente.telefone || "N/A"}</td>
                                <td className="px-6 py-4 text-center space-x-4">
                                    <button onClick={() => handleEditar(paciente)} className="text-blue-600 hover:underline">Editar</button>
                                    <button onClick={() => handleRemover(paciente.id, paciente.nomeUsuario)} className="text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PacienteFormModal
                    isOpen={isModalOpen}
                    paciente={pacienteEditando}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSalvar}
                />
            )}
        </div>
    );
}

export default AdminPaciente;