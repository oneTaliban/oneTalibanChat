import React, { createContext, useContext, useReducer, useEffect } from "react";
import { chatApi } from "../utils/api";
import { useAuth } from "./AuthContext";
import webSocketManager from "../utils/websocket";
import { WEBSOCKET_EVENTS } from "../utils/constants";
import { DiamondPercent } from "lucide-react";

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOMS":
      return { ...state, rooms: action.payload, loading: false };
    case "SET_ACTIVE_ROOM":
      return { ...state, activeRoom: action.payload };
    case "ADD_MESSAGE":
      //Avoid duplicates
      const messageExists = state.messages.some(
        (msg) =>
          msg.id === action.payload.id || 
          (msg.tempId && msg.tempId === action.payload.tempId) ||
          (msg.tempId && msg.tempId === action.payload.id)
      );
      if (messageExists) {
        console.log("duplicate message prevented: ", action.payload.id);
        return state;
      }

      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_TYPING":
      // const existingUser = state.typingUsers.find(
      //   (u) => u.id === action.payload.id
      // );
      // if (existingUser) return state;

      return {
        ...state,
        typingUsers: action.payload
          ? [
              ...state.typingUsers.filter((u) => u.id !== action.payload),
              action.payload,
            ]
          : [],
      };

    case 'TYPING_START':
      const userExists = state.typingUsers.find(u => u.id === action.payload.id)

      if (userExists) return state;

      return {
        ...state,
        typingUsers: [...state.typingUsers, action.payload]
      };

    case 'TYPING_STOP':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(u => u.id !== action.payload),
      }

    case 'CLEAR_TYPING':
      return {
        ...state,
        typingUsers: [],
      }
    case "REMOVE_TYPING":
      return {
        ...state,
        typingUsers: state.typingUsers.filter(
          (user) => user.id !== action.payload
        ),
      };
    case "MESSAGE_SENT":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.tempId === action.payload.tempId
            ? { ...action.payload, tempId: undefined }
            : msg
        ),
      };
    case "MESSAGE_LIKED":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.messageId
            ? {
                ...msg,
                likes_count: action.payload.likes_count,
                is_liked: action.payload.liked,
              }
            : msg
        ),
      };

    case 'USER_ONLINE':
      return {
        ...state,
        rooms: state.rooms.map(room => ({
          ...room,
          participants: room.participants.map(p => 
            p.id === action.payload.userId
              ? {...p , is_online: true}
              : p
          )
        }))
      };

    case 'USER_OFFLINE':
      return {
        ...state,
        rooms: state.rooms.map( room => ({
          ...room,
          participants: room.participants.map(p => 
            p.id === action.payload.userId
              ? {...p, is_online: false}
              : p
          )
        }))
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  rooms: [],
  activeRoom: null,
  messages: [],
  typingUsers: [],
  loading: true,
  error: null,
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  //Websocket event handlers
  useEffect(() => {
    if (!user) return;

    //Setting up websocket event listeners
    webSocketManager.on(WEBSOCKET_EVENTS.CHAT_MESSAGE, (data) => {
      dispatch({ type: 'ADD_MESSAGE', payload: data.message});
    });

    webSocketManager.on(WEBSOCKET_EVENTS.TYPING_START, (data) => {
      dispatch({ type: 'TYPING_START', payload: data.user});
    });

    webSocketManager.on(WEBSOCKET_EVENTS.TYPING_STOP, (data) => {
      dispatch({type: 'REMOVE_TYPING', payload: data.user});
    });

    webSocketManager.on(WEBSOCKET_EVENTS.MESSAGE_READ, (data) => {
      //Handle message read
      console.log("Message read: ", data);
    });

    webSocketManager.on(WEBSOCKET_EVENTS.USER_ONLINE, (data) => {
      dispatch({ type: 'USER_ONLINE', payload: data});
    });

    webSocketManager.on(WEBSOCKET_EVENTS.USER_OFFLINE, (data) => {
      dispatch({ type: 'USER_OFFLINE', payload: data});
    });

    return () => {
      console.log("Cleaning up websocket event listeners");
      webSocketManager.off(WEBSOCKET_EVENTS.CHAT_MESSAGE);
      webSocketManager.off(WEBSOCKET_EVENTS.TYPING_START);
      webSocketManager.off(WEBSOCKET_EVENTS.TYPING_STOP);
      webSocketManager.off(WEBSOCKET_EVENTS.MESSAGE_READ);
      webSocketManager.off(WEBSOCKET_EVENTS.USER_ONLINE);
      webSocketManager.off(WEBSOCKET_EVENTS.USER_OFFLINE);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await chatApi.getRooms();
      console.log("rooms data: ", response.data.length);
      dispatch({ type: "SET_ROOMS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load rooms" });
    }
  };

  const selectRoom = async (room) => {
    console.log("selected room", room.id);

    //clearing previous room data
    dispatch({ type: 'CLEAR_TYPING'});
    dispatch({ type: 'SET_MESSAGES', payload: []});

    //Disconnect from previous room
    if (state.activeRoom) {
      webSocketManager.disconnect();
    }


    dispatch({ type: "SET_ACTIVE_ROOM", payload: room });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // connect to new room via websocket
      webSocketManager.connect(room.id);

      //Load message for the room
      const response = await chatApi.getMessages(room.id);
      console.log("messages response: ", response.data.length);
      dispatch({ type: "SET_MESSAGES", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERR0R", payload: "Failed to load messages" });
    } finally {
      dispatch({type: 'SET_LOADING', payload: false})
    }
  };

  const sendMessage = async (content, room_id = state.activeRoom?.id) => {
    if (!content || !room_id) return;

    const tempMessage = {
      tempId: `temp_${Date.now()}`,
      content,
      sender: user,
      created_at: new Date().toISOString(),
      message_type: 'text',
      isSending: true,
    };

    dispatch({ type: "ADD_MESSAGE", payload: tempMessage });

    try {
      //Send via websocket for real-time delivery
      const success = webSocketManager.sendChatMessage(content, room_id);

      if (success) {
        //Also send via api for persistence
        console.log("----Message sent via websocket and now sending via api---")
        const response = await chatApi.sendMessage(room_id, content);

        //Updating the message with the real one
        dispatch({ type: "MESSAGE_SENT", payload: {
          ...response.data,
          tempId: tempMessage.tempId
        } });
      } else {
        throw new Error('Websocket not connnected');
      }
    } catch (error) {
      console.log('Failed to send message', error);
      dispatch({ type: "SET_ERR0R", payload: "Failed to send message" });
      // remove tempMessage on error
      dispatch({
        type: "SET_MESSAGES",
        payload: state.messages.filter(
          (msg) => msg.tempId !== tempMessage.tempId
        ),
      });
    }
  };

  const likeMessage = async (messageId) => {
    try {
      const response = await chatApi.likeMessage(messageId);
      dispatch({
        type: "MESSAGE_LIKED",
        payload: {
          messageId,
          ...response.data,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to like message" });
    }
  };

  const markMessageRead = async (messageId) => {
    try {
      await chatApi.markMessageRead(messageId);
      webSocketManager.sendMessageRead(messageId, state.activeRoom?.id);
    } catch (error) {
      console.error("Failed  to mark message as read", error);
    }
  };

  const setTyping = (typingUser, isTyping) => {
    //Updated typing function
    if (!state.activeRoom) return;

    if (isTyping) {
      webSocketManager.sendTypingIndicator(state.activeRoom.id, true);
      dispatch({ type: 'TYPING_START', payload: typingUser});
    } else {
      //stop typing
      webSocketManager.sendTypingIndicator(state.activeRoom.id, false);
      dispatch({ type: 'TYPING_STOP', payload: typingUser});
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TYPING', payload: typingUser.id})
      }, 1000);
    }

    // if (state.activeRoom) {
    //   webSocketManager.sendTypingIndicator(state.activeRoom.id, isTyping);
    // }

    // if (!isTyping) {
    //   dispatch({ type: "SET_TYPING", payload: user });
    //   // auto-remove typing indicator after 3 seconds
    //   setTimeout(() => {
    //     dispatch({ type: "REMOVE_TYPING", payload: user.id });
    //   }, 3000);
    // } else {
    //   dispatch({ type: "REMOVE_TYPING", payload: user.id });
    // }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR", payload: null });
  };

  const createRoom = async (roomData) => {
    try {
      const response = await chatApi.createRoom(roomData);
      dispatch({ type: 'SET_ROOMS', payload: [...state.rooms, response.data]});
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: "Failed to create room"});
      throw error;
    }
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
    createRoom,
    webSocketManager,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
