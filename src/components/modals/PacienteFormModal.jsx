import React, { useState, useEffect } from 'react';

function PacienteFormModal({ isOpen, paciente, onClose, onSave }) {
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '', 
        cpf: '',
        telefone: ''
    });

    useEffect(() => {
        if (paciente) {
            setFormData({
                nome: paciente.nome || '',
                email: paciente.email || '',
                senha: '', 
                cpf: paciente.cpf || '',
                telefone: paciente.telefone || ''
            });
        } else {
            setFormData({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
        }
    }, [paciente, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nome) {
            alert("O nome é obrigatório.");
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    const titulo = paciente ? "Editar Paciente" : "Novo Paciente";
    const isEditing = !!paciente;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">{titulo}</h3>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo Nome */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">CPF</label>
                        <input 
                            type="text" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder={isEditing ? "Manter atual" : "000.000.000-00"}
                            required={!isEditing} // CPF só é obrigatório no cadastro novo
                        />
                    </div>
                    
                    {/* Campo Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {/* Campo Senha - AGORA APARECE NA EDIÇÃO TAMBÉM */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Senha {isEditing && <span className="text-xs font-normal text-blue-600">(Preencha apenas para mudar)</span>}
                        </label>
                        <input 
                            type="password" 
                            name="senha" 
                            value={formData.senha} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required={!isEditing} // Obrigatório apenas se for novo paciente
                            placeholder={isEditing ? "••••••••" : "Mínimo 6 caracteres"}
                        />
                    </div>
                    
                    {/* Campo Telefone */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Telefone</label>
                        <input 
                            type="text" 
                            name="telefone" 
                            value={formData.telefone} 
                            onChange={handleChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

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
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PacienteFormModal;