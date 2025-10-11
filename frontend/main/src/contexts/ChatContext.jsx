import React, {createContext, useContext, useReducer, useEffect} from 'react';
import { chatApi } from '../utils/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.state) {
    case 'SET_ROOMS':
      return {...state, rooms: action.payload, loading: false}; 
    case 'SET_ACTIVE_ROOM':
      return {...state, activeRoom: action.payload};
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_MESSAGES':
      return {...state, messages: action.payload};
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: action.payload ?
          [...state.typingUsers.filter(u => u.id !== action.payload), action.payload] :
          [],
        
      };
    case 'REMOVE_TYPING':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(user => user.id !== action.payload),
      };
    case 'MESSAGE_SENT':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.tempId === action.payload.tempId 
          ? { ...action.payload, tempId: null}
          : msg
        ),
      };
    case 'MESSAGE_LIKED':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.messageId 
          ? {
            ...msg,
            likes_count: action.payload.likes_count,
            is_liked: action.payload.liked,
          }
          : msg
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return {...state, error: action.payload};
    default:
      return state;
  }
};

const initialState = {
  rooms: [],
  activeRoom: null,
  messages: [],
  typingUsers: [],
  loading:true,
  error: null,
};

export const ChatProvider = ({children}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await chatApi.getRooms();
      dispatch({type: 'SET_ROOMS', payload: response.data});
    } catch (error) {
      dispatch({type:'SET_ERROR', payload: 'Failed to load rooms'});
    }
  };

  const selectRoom = async (room) => {
    dispatch({type: 'SET_ACTIVE_ROOM', payload: room});
    dispatch({type: 'SET_LOADING', payload: true});

    try {
      const response = await chatApi.getMessages(room.id);
      dispatch({type: 'SET_MESSAGES', payload: response.data});

    } catch (error) {
      dispatch({type: 'SET_ERR0R', payload: 'Failed to load messages'});
    }
  };

  const sendMessage = async (content, roomId = state.activeRoom?.id) => {
    if (!content || !roomId) return;

    const tempMessage = {
      tempId: Date.now().toString(),
      content,
      sender: user,
      created_at: new Date().toISOString(),
      message_type: Text,
    };

    dispatch({type: 'ADD_MESSAGE', payload: tempMessage});

    try {
      const response = await chatApi.sendMessage(roomId, content);
      dispatch({type: 'MESSAGE_SENT', payload: response.data});
    } catch (error) {
      dispatch({type: 'SET_ERR0R', payload: "Failed to send message"});
      // remove tempMessage on error
      dispatch({type: 'SET_MESSAGEs', 
        payload: state.messages.filter(msg => msg.tempId !== tempMessage.tempId),
      });
    }
  };

  const likeMessage = async (messageId) => {
    try {
      const response = await chatApi.likeMessage(messageId);
      dispatch({
        type: 'MESSAGE_LIKED',
        payload: {
          messageId,
          ...response.data,
        },
      });
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload:  'Failed to like message'});
    }
  };

  const markMessageRead = async (messageId) => {
    try {
      await chatApi.markMessageRead(messageId);
    } catch (error) {
      console.error("Failed  to mark message as read", error);
    }
  };

  const setTyping = (user, isTyping) => {
    if (!isTyping) {
      dispatch({type: 'SET_TYPING', payload: user });
      // auto-remove typing indicator after 3 seconds
      setTimeout(() => {
        dispatch({type: 'REMOVE_TYPING', payload: user.id})
      }, 3000);
    } else {
      dispatch({type: 'REMOVE_TYPING', payload: user.id});
    }
  };

  const clearError = () => {
    dispatch({type: 'CLEAR_ERROR', payload: null});
  };

  const value = {
    ...state,
    selectRoom,
    sendMessage,
    likeMessage,
    markMessageRead,
    setTyping,
    clearError,
    loadRooms,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context  = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};