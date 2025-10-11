import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptors to handle token refresh
api.interceptors.response.use(
    (response) => response ,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status == 400 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');

                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                        refresh: refreshToken, 
                    });

                    const {access} = response.data;
                    localStorage.setItem('access_token', access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // refresh token failed , logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth api
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    logout: () => api.post('/auth/logout/'),
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (userData) => api.patch('/auth/profile/'), 
};

export const chatApi = {
    getRooms: () => api.get('/chat/rooms/'),
    createRoom: (roomData) => api.post('/chat/rooms', roomData),
    getRoom: (roomId) => api.post(`/chat/rooms/${roomId}/`),
    getMessages: (roomId) => api.post(`/chat/rooms/${roomId}/messages/`),
    sendMessage: (roomId, content) => api.post(`/chat/rooms/${roomId}/messages/`, {content}),
    markMessageRead: (messageId) => api.post(`/chat/messages/${messageId}/read/`),
    likeMessage: (messageId) => api.post(`/chat/messages/${messageId}/like/`),

};


export default api