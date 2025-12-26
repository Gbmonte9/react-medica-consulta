import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PacienteFooter from '../../components/paciente/PacienteFooter'; 

const pacienteNavItems = [
    { name: 'Início', path: '/paciente', icon: '🏠' },
    { name: 'Novo Agendamento', path: '/paciente/agendar', icon: '➕' }, 
    { name: 'Minhas Consultas', path: '/paciente/consultas', icon: '📅' },
    { name: 'Meu Perfil', path: '/paciente/perfil', icon: '👤' },
];

function PacienteLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth(); 

    const handleLogout = () => {
        if (window.confirm("Deseja sair da sua área de paciente?")) {
            logout();
            navigate('/login');
        }
    };

    const getNomePaciente = () => {
        if (user?.nome && user.nome !== 'sessao_ativa') return user.nome.split(' ')[0]; 
        return 'Paciente';
    };

    const nomeExibicao = getNomePaciente();

    return (
        <div className="d-flex vh-100 overflow-hidden bg-light">
            
            {isSidebarOpen && (
                <div 
                    className="position-fixed w-100 h-100 bg-dark opacity-50 d-md-none animate__animated animate__fadeIn"
                    style={{ zIndex: 1040, top: 0, left: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside 
                className={`bg-white border-end shadow-sm d-flex flex-column h-100 transition-all`}
                style={{ 
                    width: '280px', 
                    minWidth: '280px',
                    zIndex: 1050,
                    position: 'fixed',
                    left: isSidebarOpen ? '0' : '-280px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                id="admin-sidebar" 
            >
                <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
                            <span className="text-white fw-bold">P</span>
                        </div>
                        <h5 className="mb-0 fw-black text-dark tracking-tighter uppercase">MED<span className="text-info">PACIENTE</span></h5>
                    </div>
                    <button className="btn d-md-none border-0 p-0 text-muted" onClick={() => setIsSidebarOpen(false)}>
                        <span className="fs-3">&times;</span>
                    </button>
                </div>
                
                <div className="flex-grow-1 overflow-auto p-3 mt-2">
                    <ul className="nav nav-pills flex-column gap-2">
                        {pacienteNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`nav-link d-flex align-items-center p-3 rounded-4 transition-all ${
                                            isActive ? 'active bg-info shadow text-white' : 'text-secondary hover-bg-light'
                                        }`}
                                    >
                                        <span className="me-3 fs-5">{item.icon}</span>
                                        <span className="fw-bold small text-uppercase tracking-wider">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-3 border-top bg-light">
                    <button onClick={handleLogout} className="btn btn-outline-danger w-100 fw-bold text-uppercase small py-2 rounded-3 border-2">
                        🚪 Sair do Portal
                    </button>
                </div>
            </aside>

            <main className="flex-grow-1 d-flex flex-column overflow-auto">
                <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between px-4 shadow-sm sticky-top">
                    <button className="btn btn-light border d-md-none" onClick={() => setIsSidebarOpen(true)}>
                        <span className="fs-5">☰</span>
                    </button>
                    
                    <div className="ms-auto d-flex align-items-center gap-3">
                        <div className="text-end d-none d-sm-block">
                            <p className="mb-0 small fw-black text-uppercase tracking-tighter">Olá, {nomeExibicao}!</p>
                            <p className="mb-0 text-info fw-bold d-flex align-items-center justify-content-end" style={{ fontSize: '9px' }}>
                                <span className="bg-success d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px' }}></span> ONLINE
                            </p>
                        </div>
                        <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-sm" 
                             style={{ width: '40px', height: '40px', fontSize: '15px' }}>
                            {nomeExibicao.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-3 p-md-4 flex-grow-1">
                    <div className="container-fluid bg-white shadow-sm rounded-4 p-4 p-md-5 border animate__animated animate__fadeInUp animate__faster">
                        <Outlet />
                    </div>
                </div>
                
                <div className="px-4 pb-4">
                    <PacienteFooter />
                </div>
            </main>

            <style>{`
                @media (min-width: 768px) {
                    #admin-sidebar {
                        position: relative !important;
                        left: 0 !important;
                    }
                }

                .hover-bg-light:hover {
                    background-color: #f0fbfc;
                    color: #0dcaf0 !important;
                    transform: translateX(5px);
                }

                .fw-black { font-weight: 900; }
                .transition-all { transition: all 0.3s ease; }
                
                .active.bg-info {
                    background: linear-gradient(45deg, #0dcaf0, #0097b2) !important;
                }
            `}</style>
        </div>
    );
}

export default PacienteLayout;