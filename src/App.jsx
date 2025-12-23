// src/App.js

import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext'; 
import ProtectedRoute from "./components/layout/ProtectedRoute";

import ErrorBoundary from './components/layout/ErrorBoundary'; 
import AdminLayout from './components/layout/AdminLayout';  
import PatientLayout from './components/layout/PacienteLayout'; // <-- Importe o novo Layout

// PÁGINAS ADMIN
import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import AdminMedico from './pages/Admin/AdminMedicos'; 
import AdminPaciente from './pages/Admin/AdminPaciente'; 
import AdminHistorico from './pages/Admin/AdminHistorico';
import AdminRelatorio from './pages/Admin/AdminRelatorio'; 
import AdminConsultas from "./pages/Admin/AdminConsultas";

// PÁGINAS PACIENTE (Importações para os arquivos que vamos criar)
import PatientDashboard from './pages/Paciente/PacienteDashboard';
import PatientAgendamento from './pages/Paciente/PacienteAgendamento';
import PatientMinhasConsultas from './pages/Paciente/PacienteConsultas';
import PatientPerfil from './pages/Paciente/PacientePerfil';

function App() {
    return (
        <AuthProvider>
            <LoadingProvider> 
                <Router>
                    <ErrorBoundary>
                        <div className="App">
                            <Routes>
                                {/* Rotas Públicas */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                <Route path="/" element={<Navigate to="/login" replace />} /> 

                                {/* --- ROTAS ADMINISTRATIVAS PROTEGIDAS --- */}
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

                                {/* --- ROTAS DO PACIENTE PROTEGIDAS --- */}
                                <Route 
                                    path="/paciente" 
                                    element={
                                        <ProtectedRoute requiredRole="PACIENTE">
                                            <PatientLayout /> 
                                        </ProtectedRoute>
                                    } 
                                >
                                    <Route index element={<PatientDashboard />} /> 
                                    <Route path="agendar" element={<PatientAgendamento />} />
                                    <Route path="consultas" element={<PatientMinhasConsultas />} />
                                    <Route path="perfil" element={<PatientPerfil />} />
                                </Route>
                                
                                {/* Rota 404 */}
                                <Route path="*" element={
                                    <div className="vh-100 d-flex align-items-center justify-content-center bg-light text-center">
                                        <div>
                                            <h1 className="display-1 fw-black text-primary">404</h1>
                                            <p className="fw-bold text-muted uppercase">Página não localizada</p>
                                            <button onClick={() => window.history.back()} className="btn btn-dark rounded-pill px-4 mt-3">Voltar</button>
                                        </div>
                                    </div>
                                } />
                            </Routes>
                        </div>
                    </ErrorBoundary>
                </Router>
            </LoadingProvider>
        </AuthProvider>
    );
}

export default App;