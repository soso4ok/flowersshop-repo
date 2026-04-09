import axios from "axios";

const apiURL = import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1';
console.log('API Client Initialized with URL:', apiURL);

const api = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the bearer token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (auto-logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');

            // Only redirect if not already on login/register pages
            if (window.location.pathname !== '/login' && window.location.pathname !== '/reg') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
