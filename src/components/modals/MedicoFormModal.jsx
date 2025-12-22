import React, { useState, useEffect } from 'react';

// Lista de especialidades focada em Saúde Mental
const ESPECIALIDADES = [
    'Psicólogo(a) Clínico', 
    'Psicólogo(a) Infantil', 
    'Psiquiatra', 
    'Neuropsicólogo(a)', 
    'Psicanalista',
    'Terapeuta Ocupacional'
];

function MedicoFormModal({ isOpen, medico, onClose, onSave }) {
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        crm: '',
        especialidade: ESPECIALIDADES[0],
    });

    // Sincroniza o formulário com o médico selecionado ou limpa para novo cadastro
    useEffect(() => {
        if (isOpen) {
            if (medico) {
                // Modo Edição: Preenche com os dados existentes
                setFormData({
                    nome: medico.nome || '',
                    email: medico.email || '',
                    senha: '', // Senha sempre vazia por segurança na edição
                    crm: medico.crm || '',
                    especialidade: medico.especialidade || ESPECIALIDADES[0],
                });
            } else {
                // Modo Criação: Reseta para o estado inicial
                setFormData({ 
                    nome: '', 
                    email: '', 
                    senha: '', 
                    crm: '', 
                    especialidade: ESPECIALIDADES[0] 
                });
            }
        }
    }, [medico, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validação mínima
        if (!formData.nome || !formData.crm || !formData.email) {
            alert("Nome, CRM/CRP e Email são obrigatórios.");
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    const isEditing = !!medico;
    const titulo = isEditing ? "Editar Profissional" : "Novo Profissional";

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">{titulo}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Nome e Registro Profissional */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nome Completo</label>
                            <input 
                                type="text" 
                                name="nome" 
                                value={formData.nome} 
                                onChange={handleChange} 
                                required 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="sm:w-1/3">
                            <label className="block text-gray-700 text-sm font-bold mb-2">CRM / CRP</label>
                            <input 
                                type="text" 
                                name="crm" 
                                value={formData.crm} 
                                onChange={handleChange} 
                                required 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>
                    
                    {/* Especialidade e Email */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Especialidade</label>
                            <select 
                                name="especialidade" 
                                value={formData.especialidade} 
                                onChange={handleChange} 
                                required 
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>

                    {/* Campo Senha - Visível em ambos os modos */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Senha {isEditing && <span className="text-xs font-normal text-blue-600 ml-1">(Preencha apenas para alterar)</span>}
                        </label>
                        <input 
                            type="password" 
                            name="senha" 
                            value={formData.senha} 
                            onChange={handleChange} 
                            required={!isEditing} 
                            placeholder={isEditing ? "••••••••" : "Digite uma senha"}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    
                    {/* Botões de Ação */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
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

export default MedicoFormModal;