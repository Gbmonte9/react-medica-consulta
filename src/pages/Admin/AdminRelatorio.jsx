import React, { useState } from 'react';

// Importamos a função de PDF do novo Service
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
            
            // 2. Cria um link de download temporário no navegador
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            
            // Define o nome do arquivo a ser baixado
            a.href = url;
            a.download = `relatorio_consultas_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // 3. Simula o clique para iniciar o download
            document.body.appendChild(a);
            a.click();
            
            // 4. Limpa o objeto URL temporário
            a.remove();
            window.URL.revokeObjectURL(url);

            alert('Relatório PDF gerado e baixado com sucesso!');
            
        } catch (err) {
            console.error("Erro ao gerar PDF:", err);
            setError(err.message || 'Falha ao gerar o relatório PDF. Verifique a API.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Relatórios e Exportação</h2>

            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">Erro: {error}</div>}

            {/* Cartão de Geração de Relatório PDF */}
            <div className="bg-white p-6 shadow-md rounded-lg max-w-xl mb-8">
                <h3 className="text-xl font-medium mb-4 text-blue-800">Exportar Histórico Completo</h3>
                <p className="text-gray-600 mb-4">
                    Gere um arquivo PDF contendo o histórico detalhado de todas as consultas registradas no sistema.
                </p>
                
                <button 
                    onClick={handleGerarPdf}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                        loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {loading ? 'Gerando PDF...' : '⬇️ Baixar Relatório PDF'}
                </button>
            </div>

            {/* Espaço para Outros Relatórios/Filtros */}
            <div className="bg-white p-6 shadow-md rounded-lg max-w-xl">
                <h3 className="text-xl font-medium mb-4 text-blue-800">Outras Exportações</h3>
                <p className="text-gray-600">
                    Aqui você pode adicionar relatórios mais específicos (ex: Médicos mais agendados, Pacientes ativos, Exportação para CSV, etc.).
                </p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200 cursor-not-allowed">
                    Em Desenvolvimento
                </button>
            </div>
            
        </div>
    );
}

export default AdminRelatorio;