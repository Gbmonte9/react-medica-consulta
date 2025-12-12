# ⚛️ Arquitetura do Frontend (React)

Este documento descreve a arquitetura e os padrões de desenvolvimento utilizados no projeto Frontend, construído em React, que consome a API REST desenvolvida em Spring Boot.

## 1. Arquitetura Geral

O projeto é uma **SPA (Single Page Application)** com uma arquitetura **Componente-Baseada** (Component-Based Architecture), onde o estado da aplicação é gerenciado centralmente e os dados são obtidos exclusivamente via requisições HTTP para a API de Backend. 

## 2. Estrutura de Pastas

A organização de `src/` segue uma separação clara por módulos e responsabilidades:

src/ ├── api/ # ⬅️ Camada de Comunicação com a API ├── assets/ # Estilos globais e imagens ├── components/ # Componentes de UI reutilizáveis (Botões, Cards, etc.) ├── contexts/ # Gerenciamento de estado global (AuthContext) ├── hooks/ # Lógica reutilizável (useFetch, useAuth) ├── pages/ # Mapeamento de rotas (Login, Dashboard, Agendamento) └── utils/ # Funções utilitárias (formatação, validação)


## 3. Padrões de Comunicação com o Backend

A comunicação é centralizada na pasta `src/api/` para garantir que o resto do código (componentes e páginas) não tenha que se preocupar com URLs ou tokens de autenticação.

### 3.1. Gerenciamento de Autenticação
* O token JWT recebido da API (Endpoint `/api/auth/login`) será armazenado de forma segura (ex: `localStorage` ou *cookies*).
* Todas as requisições subsequentes incluirão este token no cabeçalho `Authorization: Bearer <token>`.

### 3.2. Estrutura da Camada API (Exemplo: Agendamento)

Criaremos um serviço específico para Agendamento.

* `src/api/consultasService.js`:
    * `getMedicos()`: Lista de médicos para o dropdown.
    * `checkDisponibilidade(medicoId, dataHora)`: Pré-verificação de conflito.
    * `agendarConsulta(dados)`: Envio final da requisição `POST`.

## 4. O Nosso Primeiro Foco: O Componente de Agendamento

Para iniciar o Frontend, focaremos no componente de agendamento, pois ele envolve todas as camadas:

1.  **Chamar a API** (`consultasService.js`) para obter a lista de médicos.
2.  **Gerenciar o Estado** (usando `useState`) para acompanhar o médico e a data selecionada.
3.  **Tratar Erros (409 Conflict):** Exibir uma mensagem de erro clara ao usuário quando o agendamento falhar por conflito de horário.

---

### 💬 Resumo do Nosso Plano

Agora que temos essa documentação, nossa conversa será muito mais estruturada.

Podemos começar a discutir a **camada de comunicação (API Service)**, pois é o primeiro passo para conectar o React ao seu Spring Boot.

Você prefere começar discutindo como configurar o arquivo `src/api/baseService.js` (para gerenciar o token e URLs base) ou já quer ir direto para a lógica do agendamento em `src/api/consultasService.js`?