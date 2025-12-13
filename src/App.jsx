// src/App.js

import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Contextos (provedor de estado)
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from "./components/layout/ProtectedRoute";

// 2. Componentes de Layout e Proteção
import Header from './components/layout/Header'; // Opcional, mas comum
import ErrorBoundary from './components/layout/ErrorBoundary'; 
import AdminLayout from './pages/Admin/AdminLayout';  // Layout com Sidebar e Header Admin

// 3. Componentes de Página (Suas views)
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import AdminMedico from './pages/Admin/AdminMedicos';
import AdminPaciente from './pages/Admin/AdminPaciente'; 
import AdminHistorico from './pages/Admin/AdminHistorico';
import AdminRelato from './pages/Admin/AdminRelatorio';


// ----------------------------------------------------
// Componente Principal
// ----------------------------------------------------

function App() {
    return (
        <AuthProvider>
            <Router>
                
                <ErrorBoundary> {/* Protege a renderização do app */}
                
                    <div className="App">
                        
                        {/* O Header geral (se houver um) */}
                        {/* <Header /> */} 
                        
                        <Routes>
                            {/* 2.1. Rotas Públicas */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Login />} /> 

                            
                            {/* ------------------------------------------------------------------ */}
                            {/* 2.2. ROTAS ADMINISTRATIVAS (ANINHADAS) */}
                            {/* ------------------------------------------------------------------ */}
                            <Route 
                                path="/admin" 
                                element={
                                    // 1. Protege todo o bloco administrativo
                                    <ProtectedRoute requiredRole="ADMIN">
                                        {/* 2. O Layout que contém a Sidebar e o <Outlet /> */}
                                        <AdminLayout /> 
                                    </ProtectedRoute>
                                } 
                            >
                                {/* ROTA INDEX: /admin */}
                                <Route index element={<AdminDashboard />} /> 
                                
                                {/* ROTAS FILHAS */}
                                <Route path="medicos" element={<AdminMedico />} />
                                <Route path="pacientes" element={<AdminPaciente />} />
                                <Route path="historico" element={<AdminHistorico />} />
                                <Route path="relatorios" element={<AdminRelato />} />

                            </Route>
                            
                            {/* MÉDICO (Exemplo de Rotas fora do layout Admin) */}
                            {/* <Route 
                                path="/medico" 
                                element={
                                    <ProtectedRoute requiredRole="MEDICO">
                                        <MedicoDashboard />
                                    </ProtectedRoute>
                                } 
                            /> */}
                            
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