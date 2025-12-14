// src/components/HistoricoRegistroModal.jsx

import React, { useState, useEffect } from 'react'; 
import { registrarHistorico } from '../../api/historicosService'; 

function HistoricoRegistroModal({ isOpen, onClose, consultaId, onHistoricoSuccess }) {
    
    // Estados para os dados do histórico
    const [observacoes, setObservacoes] = useState('');
    const [receita, setReceita] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --------------------------------------------------------------------
    // Lógica de Registro de Histórico
    // --------------------------------------------------------------------
    const handleRegistrar = async (e) => {
        e.preventDefault();
        
        // ** GARANTIR QUE O ID ESTEJA PRESENTE ANTES DE ENVIAR **
        if (!consultaId) {
            setError('Erro interno: O ID da consulta está faltando.');
            return;
        }

        if (!observacoes && !receita) {
            setError('Pelo menos Observações ou Receita devem ser preenchidos.');
            return;
        }

        const historicoData = {
            consultaId: consultaId, 
            observacoes: observacoes,
            receita: receita,
        };
        
        try {
            setLoading(true);
            setError(null);
            
            await registrarHistorico(historicoData); 
            
            alert('Histórico da consulta registrado com sucesso!');
            
            setObservacoes('');
            setReceita('');
            onClose(); 
            onHistoricoSuccess(); 
            
        } catch (err) {
            console.error('Erro ao registrar histórico:', err);
            const apiError = err.message;
            setError(apiError || 'Falha ao registrar histórico. Verifique a conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };
    
    // Limpa o estado quando o modal fecha/abre para uma nova consulta
    useEffect(() => {
        if (isOpen) {
            setObservacoes('');
            setReceita('');
            setError(null);
        }
    }, [isOpen]);

    // 🎯 MUDANÇA CRÍTICA AQUI: O modal só precisa checar se está aberto.
    // Ele não precisa checar o consultaId aqui, pois a UI do formulário lida com a falta dele.
    if (!isOpen) return null; 

    // --------------------------------------------------------------------
    // Renderização do Modal
    // --------------------------------------------------------------------
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                    Registrar Histórico para Consulta ID: {consultaId ? consultaId.substring(0, 8) + '...' : 'ERRO: ID FALTANDO'}
                </h3>
                
                {/* Exibe o erro de ID faltando ou erro de API/validação */}
                {error && <div className="p-2 mb-3 text-red-700 bg-red-100 rounded">{error}</div>}
                {
                    !consultaId ? (
                        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                            Não foi possível carregar o ID da consulta. Tente novamente ou feche o modal.
                        </div>
                    ) : (
                         <form onSubmit={handleRegistrar}>
                            
                            {/* 1. Observações */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="observacoes">
                                    Observações Médicas
                                </label>
                                <textarea
                                    id="observacoes"
                                    rows="4"
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    placeholder="Diagnóstico, procedimentos realizados, etc."
                                />
                            </div>

                            {/* 2. Receita */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="receita">
                                    Receita e Plano de Tratamento
                                </label>
                                <textarea
                                    id="receita"
                                    rows="4"
                                    value={receita}
                                    onChange={(e) => setReceita(e.target.value)}
                                    className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    placeholder="Medicamentos, dosagens, recomendações."
                                />
                            </div>
                            
                            {/* Botões */}
                            <div className="flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Fechar
                                </button>
                                <button 
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                                        loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Registrar Histórico'}
                                </button>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    );
}

export default HistoricoRegistroModal;