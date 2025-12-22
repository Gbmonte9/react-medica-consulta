import React, { useState, useEffect } from 'react'; 
import { registrarHistorico, buscarHistoricoPorConsultaId, atualizarHistorico } from '../../api/historicosService'; 

function HistoricoRegistroModal({ isOpen, onClose, consulta, onHistoricoSuccess }) {
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');
    const [historicoId, setHistoricoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- TENTATIVA AMPLA DE MAPEAMENTO DE NOMES ---
    // Verifica paciente.nomeUsuario, paciente.nome, pacienteNome, etc.
    const nomePaciente = 
        consulta?.paciente?.nomeUsuario || 
        consulta?.paciente?.nome || 
        consulta?.pacienteNome || 
        "Paciente não identificado";

    const nomeMedico = 
        consulta?.medico?.nomeUsuario || 
        consulta?.medico?.nome || 
        consulta?.medicoNome || 
        "Médico não identificado";

    const consultaId = consulta?.id;

    useEffect(() => {
        const carregarHistorico = async () => {
            if (isOpen && consultaId) {
                try {
                    setLoading(true);
                    setError(null);
                    const dado = await buscarHistoricoPorConsultaId(consultaId);
                    
                    if (dado) {
                        setObservacoes(dado.observacoes || '');
                        setReceita(dado.receita || '');
                        setHistoricoId(dado.id);
                    } else {
                        resetForm();
                    }
                } catch (err) {
                    resetForm();
                } finally {
                    setLoading(false);
                }
            }
        };
        carregarHistorico();
    }, [isOpen, consultaId]);

    const resetForm = () => {
        setObservacoes('');
        setReceita('');
        setHistoricoId(null);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const historicoData = { consultaId, observacoes, receita };
        
        try {
            if (historicoId) {
                await atualizarHistorico(historicoId, historicoData);
            } else {
                await registrarHistorico(historicoData); 
            }
            onHistoricoSuccess();
            onClose(); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-300">
                
                {/* Cabeçalho com Cores de Alto Contraste (Preto e Cinza) */}
                <div className="bg-gray-100 p-6 border-b border-gray-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                            {historicoId ? '👁️ Detalhes' : '📝 Registro'}
                        </h3>
                        <button onClick={onClose} className="text-black hover:text-red-600 text-3xl font-bold transition-colors">
                            &times;
                        </button>
                    </div>
                    
                    {/* INFO BOX - TEXTO PRETO PARA MELHOR LEITURA */}
                    <div className="space-y-2 bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                        <p className="text-black flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Paciente: </span>
                            <span className="text-lg font-extrabold">{nomePaciente}</span>
                        </p>
                        <p className="text-black flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Médico: </span>
                            <span className="text-lg font-extrabold">{nomeMedico}</span>
                        </p>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                            <p className="text-[10px] font-mono text-gray-400 break-all">REF-ID: {consultaId}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-white">
                    {error && (
                        <div className="p-3 mb-4 text-red-800 bg-red-50 rounded-lg text-sm border-2 border-red-200 font-bold">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSalvar} className="space-y-6">
                        <div>
                            <label className="block text-black font-black mb-2 text-xs uppercase tracking-widest">
                                Observações Clínicas / Diagnóstico
                            </label>
                            <textarea
                                rows="4"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none bg-gray-50 text-black font-medium transition-all"
                                placeholder="Descreva o quadro do paciente..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-black font-black mb-2 text-xs uppercase tracking-widest">
                                Prescrição Médica (Receita)
                            </label>
                            <textarea
                                rows="3"
                                value={receita}
                                onChange={(e) => setReceita(e.target.value)}
                                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none bg-gray-50 text-black font-medium transition-all"
                                placeholder="Medicamentos, dosagens..."
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-4">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-6 py-3 text-gray-700 hover:text-black font-bold uppercase text-xs tracking-widest transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className={`px-10 py-3 rounded-xl text-white font-black uppercase text-xs tracking-widest shadow-xl transition-all ${
                                    loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800 active:scale-95'
                                }`}
                            >
                                {loading ? 'Salvando...' : 'Confirmar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HistoricoRegistroModal;