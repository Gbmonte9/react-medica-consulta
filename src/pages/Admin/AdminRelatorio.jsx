import React, { useState } from 'react';

// Ajustado para o nome singular conforme o seu arquivo src/api/historicoService.js
import { gerarPdfHistoricoConsultas } from '../../api/historicosService'; 

function AdminRelatorio() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --------------------------------------------------------------------
    // Lógica para Gerar e Baixar o PDF
    // --------------------------------------------------------------------
    const handleGerarPdf = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // 1. Chama o Service para obter o arquivo binário (Blob)
            const pdfBlob = await gerarPdfHistoricoConsultas();
            
            // Validação de segurança: verifica se o que veio é realmente um PDF
            if (pdfBlob.type !== 'application/pdf') {
                throw new Error("O arquivo retornado não é um PDF válido.");
            }

            // 2. Cria um link de download temporário no navegador
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            
            // Define o nome do arquivo a ser baixado com a data atual
            const dataHoje = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
            a.href = url;
            a.download = `relatorio_geral_consultas_${dataHoje}.pdf`;
            
            // 3. Simula o clique para iniciar o download
            document.body.appendChild(a);
            a.click();
            
            // 4. Limpa o objeto URL temporário para evitar vazamento de memória
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Erro ao gerar PDF:", err);
            // Captura a mensagem vinda do extractErrorMessage do service
            setError(err.message || 'Falha ao gerar o relatório. O servidor pode estar fora do ar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-black mb-8 text-black border-b-4 border-black pb-4 uppercase tracking-tighter">
                📊 Relatórios e Exportação
            </h2>

            {error && (
                <div className="p-4 mb-6 text-red-800 bg-red-100 border-2 border-red-300 rounded-xl font-bold flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cartão de Geração de Relatório PDF */}
                <div className="bg-white p-8 shadow-xl rounded-2xl border-2 border-gray-100 hover:border-red-200 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-100 p-3 rounded-lg text-red-600 text-2xl">📄</div>
                        <h3 className="text-xl font-black text-black uppercase">Histórico Geral</h3>
                    </div>
                    <p className="text-gray-600 mb-6 font-medium">
                        Exporta um documento PDF profissional contendo todos os registros de consultas, pacientes, médicos e diagnósticos realizados.
                    </p>
                    
                    <button 
                        onClick={handleGerarPdf}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                        }`}
                    >
                        {loading ? '⏳ Processando Arquivo...' : '⬇️ Baixar PDF Completo'}
                    </button>
                </div>

                {/* Cartão de Outros Relatórios */}
                <div className="bg-white p-8 shadow-xl rounded-2xl border-2 border-gray-100 opacity-60">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-100 p-3 rounded-lg text-gray-600 text-2xl">📈</div>
                        <h3 className="text-xl font-black text-black uppercase tracking-tight">Estatísticas</h3>
                    </div>
                    <p className="text-gray-600 mb-6 font-medium">
                        Relatórios analíticos de produtividade por médico e volume de pacientes atendidos mensalmente.
                    </p>
                    <button className="w-full py-4 rounded-xl bg-gray-200 text-gray-500 font-black uppercase text-xs cursor-not-allowed">
                        Em Desenvolvimento
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminRelatorio;