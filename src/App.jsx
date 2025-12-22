// src/App.js

import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext'; 
import ProtectedRoute from "./components/layout/ProtectedRoute";

import ErrorBoundary from './components/layout/ErrorBoundary'; 
import AdminLayout from './components/layout/AdminLayout';  

import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import AdminMedico from './pages/Admin/AdminMedicos'; 
import AdminPaciente from './pages/Admin/AdminPaciente'; 
import AdminHistorico from './pages/Admin/AdminHistorico';
import AdminRelatorio from './pages/Admin/AdminRelatorio'; 
import AdminConsultas from "./pages/Admin/AdminConsultas";

function App() {
    return (
        <AuthProvider>
            {/* 2. Envolva o Router com o LoadingProvider para o spinner funcionar em qualquer tela */}
            <LoadingProvider> 
                <Router>
                    <ErrorBoundary>
                        <div className="App">
                            <Routes>
                                {/* Rotas Públicas */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* 3. Melhoria: Redireciona a raiz sempre para o login de forma limpa */}
                                <Route path="/" element={<Navigate to="/login" replace />} /> 

                                {/* Rotas Administrativas Protegidas */}
                                <Route 
                                    path="/admin" 
                                    element={
                                        <ProtectedRoute requiredRole="ADMIN">
                                            <AdminLayout /> 
                                        </ProtectedRoute>
                                    } 
                                >
                                    <Route index element={<AdminDashboard />} /> 
                                    <Route path="medicos" element={<AdminMedico />} />
                                    <Route path="pacientes" element={<AdminPaciente />} />
                                    <Route path="historico" element={<AdminHistorico />} />
                                    <Route path="relatorios" element={<AdminRelatorio />} />
                                    <Route path="consultas" element={<AdminConsultas />} />
                                </Route>
                                
                                {/* Rota 404 */}
                                <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
                            </Routes>
                        </div>
                    </ErrorBoundary>
                </Router>
            </LoadingProvider>
        </AuthProvider>
    );
}

export default App;