import React, { useState, useEffect } from 'react';

// Lista simplificada de especialidades para o Select
const ESPECIALIDADES = [
    'Cardiologia', 'Pediatria', 'Geral', 'Dermatologia', 'Ortopedia', 'Oftalmologia'
];

function MedicoFormModal({ isOpen, medico, onClose, onSave }) {
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        crm: '', // Campo específico do Médico
        especialidade: ESPECIALIDADES[0] || '', // Campo específico do Médico
    });

    useEffect(() => {
        if (medico) {
            // Edição
            setFormData({
                nome: medico.nome || '',
                email: medico.email || '',
                senha: '', // Não preenche a senha
                crm: medico.crm || '',
                especialidade: medico.especialidade || ESPECIALIDADES[0],
            });
        } else {
            // Criação
            setFormData({ nome: '', email: '', senha: '', crm: '', especialidade: ESPECIALIDADES[0] || '' });
        }
    }, [medico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nome || !formData.crm) {
            alert("Nome e CRM são obrigatórios.");
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    const titulo = medico ? "Editar Médico" : "Novo Médico";
    const isEditing = !!medico;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">{titulo}</h3>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Linha 1: Nome e CRM */}
                    <div className="flex space-x-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="crm">CRM</label>
                            <input type="text" name="crm" value={formData.crm} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    </div>
                    
                    {/* Linha 2: Especialidade e Email */}
                    <div className="flex space-x-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="especialidade">Especialidade</label>
                            <select name="especialidade" value={formData.especialidade} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700">
                                {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    </div>

                    {/* Linha 3: Senha (Apenas na Criação) */}
                    {!isEditing && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="senha">Senha</label>
                            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    )}
                    
                    {/* Botões */}
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            {medico ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MedicoFormModal;