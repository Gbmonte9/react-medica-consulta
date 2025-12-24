import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MedicoFooter from '../../components/medico/MedicoFooter'; 

// Itens de navegação principal do Médico
// Altere apenas o array de navegação no seu MedicoLayout.jsx
const medicoNavItems = [
    { name: 'Painel Geral', path: '/medico', icon: '📊' },
    { name: 'Agenda do Dia', path: '/medico/agenda', icon: '🩺' }, 
    // Alteramos o path para 'atendimento' (sem o ID no link do menu)
    { name: 'Atendimento', path: '/medico/atendimento', icon: '📝' }, 
    { name: 'Meus Pacientes', path: '/medico/pacientes', icon: '📋' },
    { name: 'Meu Perfil', path: '/medico/perfil', icon: '👨‍⚕️' },
];

function MedicoLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth(); 

    const handleLogout = () => {
        if (window.confirm("Deseja encerrar seu plantão no sistema?")) {
            logout();
            navigate('/login');
        }
    };

    // Formatação do nome para exibição (Dr. Primeiro Nome)
    const nomeExibicao = user?.nome ? `Dr(a). ${user.nome.split(' ')[0]}` : 'Médico';
    
    // Letra para o Avatar (Primeira letra do nome real)
    const inicialAvatar = user?.nome ? user.nome.split(' ')[0].charAt(0).toUpperCase() : 'M';

    return (
        <div className="d-flex vh-100 overflow-hidden bg-light">
            
            {/* OVERLAY Mobile: Fecha o menu ao clicar fora */}
            {isSidebarOpen && (
                <div 
                    className="position-fixed w-100 h-100 bg-dark opacity-50 d-md-none animate__animated animate__fadeIn"
                    style={{ zIndex: 1040, top: 0, left: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR MÉDICA (Verde Sucesso) */}
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
            >
                {/* Logo da Sidebar */}
                <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-white" style={{ minHeight: '71px' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
                            <span className="text-white fw-bold">M</span>
                        </div>
                        <h5 className="mb-0 fw-black text-dark tracking-tighter uppercase">MED<span className="text-success">MÉDICO</span></h5>
                    </div>
                    <button className="btn d-md-none border-0 p-0 text-muted" onClick={() => setIsSidebarOpen(false)}>
                        <span className="fs-3">&times;</span>
                    </button>
                </div>
                
                {/* Navegação Interna */}
                <div className="flex-grow-1 overflow-auto p-3 mt-2">
                    <ul className="nav nav-pills flex-column gap-2">
                        {medicoNavItems.map((item) => {
                            // Lógica de Ativo: verifica se a rota atual é a do item ou uma sub-rota dele
                            const isActive = location.pathname === item.path || (item.path !== '/medico' && location.pathname.startsWith(item.path));
                            
                            return (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`nav-link d-flex align-items-center p-3 rounded-4 transition-all ${
                                            isActive ? 'active bg-success shadow-success text-white' : 'text-secondary hover-bg-light'
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

                {/* Botão de Sair (Plantão) */}
                <div className="p-3 border-top bg-light">
                    <button onClick={handleLogout} className="btn btn-outline-success w-100 fw-bold text-uppercase small py-2 rounded-3 border-2 transition-all">
                        🚪 Finalizar Plantão
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL (Lado direito) */}
            <main className="flex-grow-1 d-flex flex-column overflow-auto">
                {/* Header Superior */}
                <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between px-4 shadow-sm sticky-top" style={{ minHeight: '71px' }}>
                    {/* Botão Hambúrguer Mobile */}
                    <button className="btn btn-light border d-md-none" onClick={() => setIsSidebarOpen(true)}>
                        <span className="fs-5">☰</span>
                    </button>
                    
                    <div className="ms-auto d-flex align-items-center gap-3">
                        {/* Info do Médico */}
                        <div className="text-end d-none d-sm-block">
                            <p className="mb-0 small fw-black text-uppercase tracking-tighter">{nomeExibicao}</p>
                            <p className="mb-0 text-success fw-bold d-flex align-items-center justify-content-end" style={{ fontSize: '9px' }}>
                                <span className="bg-success d-inline-block rounded-circle me-1 animate-pulse" style={{ width: '6px', height: '6px' }}></span> SISTEMA ATIVO
                            </p>
                        </div>
                        {/* Avatar com inicial do nome */}
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-sm" 
                             style={{ width: '42px', height: '42px', fontSize: '16px' }}>
                            {inicialAvatar}
                        </div>
                    </div>
                </header>

                {/* Área Onde as Páginas aparecem */}
                <div className="p-3 p-md-4 flex-grow-1">
                    <div className="container-fluid bg-white shadow-sm rounded-4 p-4 p-md-5 border animate__animated animate__fadeIn">
                        <Outlet />
                    </div>
                </div>
                
                {/* Rodapé do Médico */}
                <div className="px-4 pb-4">
                    <MedicoFooter />
                </div>
            </main>

            {/* Estilização Customizada */}
            <style>{`
                @media (min-width: 768px) {
                    aside { position: relative !important; left: 0 !important; }
                }

                .fw-black { font-weight: 900; }
                .transition-all { transition: all 0.3s ease; }
                
                .hover-bg-light:hover {
                    background-color: #f0fdf4;
                    color: #198754 !important;
                    transform: translateX(5px);
                }

                .active.bg-success {
                    background: linear-gradient(45deg, #198754, #146c43) !important;
                    border: none;
                }

                .shadow-success {
                    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2) !important;
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                
                .tracking-tighter { letter-spacing: -0.05em; }
            `}</style>
        </div>
    );
}

export default MedicoLayout;