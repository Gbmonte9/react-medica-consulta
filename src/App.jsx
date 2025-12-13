// src/App.js

import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Contextos (provedor de estado)
import { AuthProvider } from './contexts/AuthContext';

// 2. Componentes de Layout e Proteção
// import ProtectedRoute from './components/layout/ProtectedRoute'; // MANTIDO COMENTADO
import Header from './components/layout/Header'; // Opcional, mas comum

// 3. Componentes de Página (Suas views)
import Login from './pages/Login'; 
import Register from './pages/Register'; 
// import AdminDashboard from './pages/Admin/AdminDashboard'; // MANTIDO COMENTADO
// import MedicoDashboard from './pages/Medico/MedicoDashboard'; // MANTIDO COMENTADO
// import PacienteDashboard from './pages/Paciente/PacienteDashboard'; // MANTIDO COMENTADO
// import PacienteAgendamento from './pages/Paciente/PacienteAgendamento'; // MANTIDO COMENTADO

// 4. Error do Servidor 
import ErrorBoundary from './components/layout/ErrorBoundary'; // NOVO IMPORT

// ----------------------------------------------------
// Componente Principal
// ----------------------------------------------------

function App() {
    return (
        // 1. Provedor de Contexto (Disponibiliza o login/logout para a app)
        <AuthProvider>
            
            <Router> {/* <-- ÚNICO BrowserRouter/Router */}
                
                {/* 🚨 Correção: O ErrorBoundary deve envolver a área que pode falhar */}
                <ErrorBoundary> 
                
                    <div className="App">
                        
                        {/* O Header fica AQUI, fora do Routes, pois é um elemento comum */}
                        <Header /> 
                        
                        {/* 2. Definição das Rotas */}
                        <Routes>
                            {/* 2.1. Rotas Públicas */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Login />} /> 

                            {/* 2.2. Rotas Protegidas (MANTIDAS COMENTADAS PARA EVITAR ERROS DE COMPONENTE) */}
                            
                            {/* ADMIN (Requer: Logado E Papel 'ADMIN') */}
                            {/*
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute requiredRole="ADMIN">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            */}

                            {/* MÉDICO (Requer: Logado E Papel 'MEDICO') */}
                            {/* <Route 
                                path="/medico" 
                                element={
                                    <ProtectedRoute requiredRole="MEDICO">
                                        <MedicoDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            */}
                            {/* PACIENTE (Requer: Logado E Papel 'PACIENTE') */}
                            {/* <Route 
                                path="/paciente" 
                                element={
                                    <ProtectedRoute requiredRole="PACIENTE">
                                        PacienteDashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            */}
                            {/* PACIENTE - Agendamento */}
                            {/*<Route 
                                path="/agendar" 
                                element={
                                    <ProtectedRoute requiredRole="PACIENTE">
                                        <PacienteAgendamento />
                                    </ProtectedRoute>
                                } 
                            />
                            */}
                            
                            {/* 2.3. Rota de Erro (404 Not Found) */}
                            <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
                            
                        </Routes>
                        
                    </div>

                </ErrorBoundary>

            </Router>
        </AuthProvider>
    );
}

export default App;