import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth} from '../contexts/AuthContext';

export const useWebSocket = (url , onMessage) => {
    const ws = useRef(null);
    const {user} = useAuth();
    const reconnectTimeout = useRef(null);

    const connect = useCallback(() => {
        if (!user) return;

        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            ws.current = new WebSocket(`${url}?token=${token}`);
            ws.current.onopen = () => {
                console.log("websocket connected")
                clearTimeout(reconnectTimeout.current);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                } catch (error) {
                    console.error("Error parsing websocket message: ", error);
                }
            };

            ws.current.onclose = (event) => {
                console.log("Websocket closed: ", event.code, event.reason);

                // Attempting reconnection after some delay
                if (event.code !== 1000) {
                    // Dont reconnect if closed normally
                    reconnectTimeout.current = setTimeout(() => {
                        connect();
                    }, 3000);
                } 
            };

            ws.current.onerror = (error) => {
                console.error("Websocket error: ", error);
            };
        } catch (error) {
            console.error('Websocket connection failed: ' ,error);
        }
    }, [url, user, onMessage]);

    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, []);

    const disconnect = useCallback(() => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        if (ws.current){
            ws.current.close(1000, "Normal closure");
            ws.current = null;
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        }
    }, [connect,disconnect]);

    return {
        sendMessage,
        disconnect,
        reconnect: connect,
        readyState: ws.current?.readyState
    };
};