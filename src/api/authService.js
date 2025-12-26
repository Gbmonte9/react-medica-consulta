const API_BASE_URL = 'http://localhost:8080/api/auth';

export const setAuthData = (token, role, userId, nome, email, telefone, cpf, crm, especialidade) => {
    localStorage.clear();

    if (token) localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role.toUpperCase());
    if (userId) localStorage.setItem('userId', userId);
    
    const nomeParaSalvar = nome || 'Usuário';
    localStorage.setItem('userName', nomeParaSalvar);
    
    localStorage.setItem('userEmail', email?.trim() || '');
    localStorage.setItem('userTelefone', telefone || '');
    localStorage.setItem('userCpf', cpf || '');           
    localStorage.setItem('userCrm', crm || '');           
    localStorage.setItem('userEspecialidade', especialidade || ''); 
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const getUserId = () => localStorage.getItem('userId');
export const getUserName = () => localStorage.getItem('userName'); 

export const logout = () => {
    localStorage.clear(); 
};


export const login = async (email, senha) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email.trim(), 
                senha: senha 
            })
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error('E-mail ou senha incorretos.');
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha na autenticação.');
        }

        const data = await response.json(); 
        
        if (!data.token) throw new Error('Token não recebido do servidor.');

        const nomeFinal = data.nome || data.userName || data.name || 'Usuário';
        const idFinal = data.id || data.userId;

        setAuthData(
            data.token, 
            data.role, 
            idFinal, 
            nomeFinal, 
            data.email, 
            data.telefone, 
            data.cpf, 
            data.crm, 
            data.especialidade
        ); 
        
        return {
            ...data,
            id: idFinal,
            nome: nomeFinal
        }; 

    } catch (error) {
        if (error.message && error.message.includes('Failed to fetch')) {
            throw new Error('Servidor offline (Porta 8080).');
        }
        throw error;
    }
};