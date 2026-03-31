import { getToken, getAuthHeaders } from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic fetch with authentication
const authFetch = async (endpoint, options = {}) => {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    
    return response;
};

export const api = {
    // Auth endpoints
    auth: {
        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            return response.json();
        },
        
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            return response.json();
        },
        
        logout: async () => {
            const response = await authFetch('/auth/logout', {
                method: 'POST',
            });
            return response.json();
        },
    },
    
    // Protected endpoints (require authentication)
    user: {
        getProfile: async () => {
            const response = await authFetch('/user/profile');
            return response.json();
        },
        
        updateProfile: async (data) => {
            const response = await authFetch('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response.json();
        },
    },
    
    // Projects endpoints
    projects: {
        getAll: async () => {
            const response = await authFetch('/projects');
            return response.json();
        },
        
        create: async (projectData) => {
            const response = await authFetch('/projects', {
                method: 'POST',
                body: JSON.stringify(projectData),
            });
            return response.json();
        },
    },
};