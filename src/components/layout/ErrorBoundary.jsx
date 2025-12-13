// src/components/layout/ErrorBoundary.jsx

import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null 
        };
    }

    // Método chamado quando um erro é capturado
    static getDerivedStateFromError(error) {
        // Atualiza o estado para que a próxima renderização mostre a UI de fallback
        return { hasError: true };
    }

    // Método para logar o erro
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // 🚨 Em um ambiente de produção, você logaria isso em um serviço externo (ex: Sentry)
        console.error("Erro capturado pelo Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // UI de fallback quando um erro for capturado
            return (
                <div className="container mt-5 text-center">
                    <div className="alert alert-danger p-4">
                        <h2>🚫 Ops! Ocorreu um erro interno.</h2>
                        <p>Infelizmente, um erro inesperado ocorreu. Por favor, tente recarregar a página.</p>
                        
                        {/* Detalhes do erro para DEBUG (remova em produção) */}
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-3 text-start bg-light text-dark p-2 rounded">
                                <summary>Detalhes Técnicos (Apenas Dev)</summary>
                                <pre className="p-2 small" style={{ whiteSpace: 'pre-wrap' }}>
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                    <button 
                        className="btn btn-primary mt-3" 
                        onClick={() => window.location.reload()}
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;