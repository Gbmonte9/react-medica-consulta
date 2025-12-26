# 🏥 Sistema de Gestão Médica — Interface Web (React)

Interface moderna desenvolvida em **React + Vite** para consumo da API de Gestão de Consultas Médicas. Este projeto oferece uma experiência Full Stack completa, focada em segurança JWT, performance e usabilidade clínica.



## 🔗 Integração Full Stack
Este repositório contém o **Front-end**. Para o funcionamento completo, o Back-end deve estar ativo:
👉 **[Back-end em Spring Boot - API de Consultas](https://github.com/Gbmonte9/sistema-consultas-medicas)**



## 🚀 Funcionalidades Principais
* **🔐 Autenticação Segura:** Login integrado com JWT (armazenamento e interceptors de rotas).
* **🩺 Painel do Médico:** Dashboard com agenda do dia (`/hoje`) e estatísticas de produtividade.
* **📅 Agendamento Inteligente:** Seleção dinâmica de médicos, especialidades e horários.
* **📝 Prontuário Digital:** Histórico clínico completo e geração de receitas em tempo real.
* **📊 Dashboards Dinâmicos:** Cards informativos com contadores de consultas.
* **🌓 Design Dark Mode:** Interface responsiva com **Bootstrap 5** focada em ambiente clínico.



## ⚙️ Stack Tecnológica
* **Core:** React 18 & Vite
* **Comunicação:** Axios (Interceptors para Token JWT)
* **Navegação:** React Router Dom (Private Routes)
* **Estilização:** Bootstrap 5 & Font Awesome



## 🛠️ Como Executar o Projeto

### 1. Requisitos
* Node.js (v18+) e npm/yarn.

### 2. Instalação e Configuração
git clone https://github.com/Gbmonte9/react-medica-consulta.git
cd react-medica-consulta
npm install

### 3. Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:
VITE_API_URL=http://localhost:8080/api

### 4. Rodar o projeto
npm run dev
Acesse em: http://localhost:5173

## 🧩 Estrutura do Projeto
* **src/api/** - Configuração do Axios e chamadas aos endpoints.
* **src/components/** - Componentes reutilizáveis (Navbar, Sidebar, Modais).
* **src/pages/** - Telas (Login, Dashboard, Consultas, Histórico).
* **src/routes/** - Proteção de rotas por perfis (Admin, Médico, Paciente).
* **src/utils/** - Máscaras de CPF e formatações.


## 👨‍💻 Autor
**Gabriel Monte** — Desenvolvedor Full Stack Java/React

🔗 **LinkedIn:** https://www.linkedin.com/in/gabriel-rodrigues-mt/
💻 **GitHub:** https://github.com/Gbmonte9