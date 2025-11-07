import {createContext, useContext, useReducer, useEffect} from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();


const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading:true };
        case 'LOGIN_SUCCESS': 
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state
    }
};

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
}


export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const response = await authAPI.getProfile();
                console.log('response: ', response.data)
                dispatch({type: 'LOGIN_SUCCESS', payload: response.data});
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                dispatch({type: 'LOGIN_FAILURE', payload: 'Session expired'});
            }
        } else {
            dispatch({type: 'LOGIN_FAILURE', payload: null});
        }
    };

    const login = async (credentials) => {
        dispatch({type: 'LOGIN_START'});

        try {
            const response = await authAPI.login(credentials);
            const { user, access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({type: 'LOGIN_SUCCESS', payload: user});
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: message});
            return { success: false, error: message };
        }
    };

    const register = async (userData) =>  {
        dispatch({ type: 'LOGIN_START'});
        try {
            const response = await authAPI.register(userData);
            const { user, access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({ type: 'LOGIN_SUCCESS', payload: user});
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: message});
            return { success: false, error: message};
        }
    };

    const updateProfile = async (userData) => {
        
        console.log('updating user profile:',userData);
        
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Logout error: ", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT'});
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };


    return (
        <AuthContext.Provider
        value={{
            ...state,
            login,
            register,
            logout,
            updateProfile,
            clearError,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");

    }
    return context;
};

