import React, { useState, useEffect } from 'react';

// Requerimento: Este formulário é simplificado.
// Na realidade, você precisaria adicionar validações e mais campos.

function PacienteFormModal({ isOpen, paciente, onClose, onSave }) {
    
    // Estado do formulário, inicializado com os dados do paciente (se houver) ou vazio
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '', // Senha é necessária para criação, mas pode ser opcional na edição
        cpf: '',
        telefone: ''
        // Adicione outros campos necessários aqui (ex: dataNascimento, endereco, etc.)
    });

    // 🚨 ATENÇÃO: Se o paciente mudar (passamos de null para dados, ou vice-versa),
    // atualizamos o estado do formulário.
    useEffect(() => {
        if (paciente) {
            // Edição: Preenche os dados existentes
            setFormData({
                nome: paciente.nome || '',
                email: paciente.email || '',
                senha: '', // Não preenche a senha na edição
                cpf: paciente.cpf || '',
                telefone: paciente.telefone || ''
            });
        } else {
            // Criação: Limpa o formulário
            setFormData({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
        }
    }, [paciente]);

    // Lida com a mudança nos inputs do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lida com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação básica (ex: verifica se o nome está preenchido)
        if (!formData.nome || !formData.cpf) {
            alert("Nome e CPF são obrigatórios.");
            return;
        }

        // Chama a função onSave passada pelo componente pai (AdminPaciente)
        // O componente pai decide se é criação ou atualização.
        onSave(formData);
    };

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    // Título dinâmico
    const titulo = paciente ? "Editar Paciente" : "Novo Paciente";
    const isEditing = !!paciente;

    return (
        // Overlay do Modal (usando Tailwind para o visual de Pop-up)
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">{titulo}</h3>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo Nome */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome</label>
                        <input 
                            type="text" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {/* Campo CPF */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpf">CPF</label>
                        <input 
                            type="text" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            maxLength="11"
                        />
                    </div>
                    
                    {/* Campo Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {/* Campo Senha (Apenas na Criação) */}
                    {!isEditing && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="senha">Senha</label>
                            <input 
                                type="password" 
                                name="senha" 
                                value={formData.senha} 
                                onChange={handleChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required={!isEditing}
                            />
                        </div>
                    )}
                    
                    {/* Campo Telefone */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefone">Telefone</label>
                        <input 
                            type="text" 
                            name="telefone" 
                            value={formData.telefone} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            {paciente ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PacienteFormModal;