import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// automaticly add JWT token to every call, if it is
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;