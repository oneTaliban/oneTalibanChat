// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login/',
        REGISTER: '/auth/register/',
        LOGOUT: '/auth/logout/',
        PROFILE: '/auth/profile/',
        REFRESH_TOKEN: '/auth/token/refresh/',
    },

    CHAT: {
        ROOMS: '/chat/rooms/',
        ROOM_DETAIL: '/chat/rooms/:id/',
        MESSAGES: '/chat/rooms/:id/messages/',
        MESSAGE_READ: '/chat/messages/:id/read/',
        MESSAGE_LIKE: '/chat/messages/:id/like/',
    },

    PAYMENTS: {
        DONATIONS: '/payments/donations/',
        SUBSCRIPTION_PLANS: '/payments/subscription-plans/',
        SUBSCRIPTION: '/payments/subscription/',
        CHECKOUT: '/payments/create-checkout-session/',
    },

    SECURITY: {
        DEMOS: '/ethical-hacking/demos/',
        ACTIVITIES: '/ethical-hacking/activities/',
    }
};

// Websocket events
export const WEBSOCKET_EVENTS = {
    CHAT_MESSAGE: 'chat_message',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    MESSAGE_READ: 'message_read',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    ROOM_UPDATED: 'room_updated',
};

export const    SUBSCRIPTION_PLANS = {
    FREE: 'free',
    PRO: 'pro',
    ENTERPRISE: 'enterprise',
    ULTIMATE: 'ultimate',
};

export const PAYMENT_METHODS = {
    STRIPE: 'stripe',
    MPESA: 'mpesa',
    BITCOIN: 'bitcoin',
};

export const SECURITY_CATEGORIES = {
    SQL_INJECTION: 'sql_injection',
    XSS: 'xss',
    CSRF: 'csrf',
    AUTHENTICATION: 'authentication',
    ENCRYPTION: 'encyption',
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'one-taliban-theme',
    SIDEBAR_STATE: 'sidebar_state',
};

export const ANIMATION_DURATION = {
    FAST: 150,
    SLOW: 500,
    NORMAL: 300,
};

export const BREAKPOINTS = {
    SM: 640,
    MD: 648,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

export const FEATURE_FLAGS = {
    ENABLE_SUBSCRIPTIONS: true,
    ENABLE_DONATIONS: true,
    ENABLE_ETHICAL_HACKING: true,
    ENABLE_WEB_SOCKETS: true,
    ENABLE_ANALYTICS: false,
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later',
    VALIDATION_ERROR: 'Please check your input and try again later.',

};

export const SUCCESS_MESSAGE = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    REGISTER_SUCCESS: 'Account created successfully!',
    MESSAGE_SENT: 'Message sent successfully!',
    DONATION_SUCCESS: 'Thank You for your donation!',
    SUBSCRIPTION_SUCCESS: 'Subscription updated successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
};

export default {
    API_ENDPOINTS,
    WEBSOCKET_EVENTS,
    SUBSCRIPTION_PLANS,
    PAYMENT_METHODS,
    SECURITY_CATEGORIES,
    STORAGE_KEYS,
    ANIMATION_DURATION,
    BREAKPOINTS,
    FEATURE_FLAGS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGE,
};