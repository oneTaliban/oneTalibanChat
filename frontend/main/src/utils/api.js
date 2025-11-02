import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS } from './constants';

const API_BASE_URL = 'http://localhost:8000/api';

// create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('api error: ', error)
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
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                        refresh: refreshToken, 
                    });

                    const {access} = response.data;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // refresh token failed , logout user
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
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
    updateProfile: (userData) => api.patch('/auth/profile/', userData), 
};

export const chatApi = {
    getRooms: () => api.get('/chat/rooms/'),
    createRoom: (roomData) => api.post('/chat/rooms/', roomData),
    getRoom: (roomId) => api.get(`/chat/rooms/${roomId}/`),
    getMessages: (roomId) => api.get(`/chat/rooms/${roomId}/messages/`),
    sendMessage: (roomId, content) => api.post(`/chat/rooms/${roomId}/messages/`, {content}),
    markMessageRead: (messageId) => api.post(`/chat/messages/${messageId}/read/`),
    likeMessage: (messageId) => api.post(`/chat/messages/${messageId}/like/`),

};

export const paymentsApi = {
    getDonation: () => api.get(API_ENDPOINTS.PAYMENTS.DONATIONS),
    createDonations: (donationData) => api.post(API_ENDPOINTS.PAYMENTS.DONATIONS, donationData),
    getSubscriptionPlans: () => api.get(API_ENDPOINTS.PAYMENTS.SUBSCRIPTION_PLANS),
    getSubscription: () => api.get(API_ENDPOINTS.PAYMENTS.SUBSCRIPTION),
    createCheckoutSession: (checkoutData) => api.post(API_ENDPOINTS.PAYMENTS.CHECKOUT, checkoutData),
}

export const securityApi = {
    getDemos: () => api.get(API_ENDPOINTS.SECURITY.DEMOS),
    getActivites: () => api.get(API_ENDPOINTS.SECURITY.ACTIVITIES),
    logActivity: (activityData) => api.post(API_ENDPOINTS.SECURITY.ACTIVITIES, activityData),
}

export default api