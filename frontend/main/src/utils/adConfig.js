//Google Admob ad integration

export const AD_CONFIG = {
    APP_ID: '',

    AD_UNITS: {
        BANNER: {
            HOME: '',
            ETHICAL_HACKING: '',
            DONATION: '',
        },
        INTERSTITIAL: {
            NAVIGATION: '',
            TASK_COMPLETION: '',
        },
        REWARDED: {
            PREMIUM_FEATURES: '',
        }
    },

    SETTINGS: {
        BANNER_FREQUENCY: 2, // SHOW BANNER EVERY 3 PAGE VIEWS
        INTERSTITIAL_FREQUENCY: 3, // SHOW INTERSTITIAL EVERY 5 NAVIGATION
        MAX_ADS_PER_SESSION: 20
    }
};

export const AD_TARGETING = {
    contentType: 'application',
    contentTags: ['finance', 'productivity', 'business', 'money', 'budget'],
    customTargeting: {
        app_category: 'finance_tools',
        user_type: 'premium_seeker'
    }
};

