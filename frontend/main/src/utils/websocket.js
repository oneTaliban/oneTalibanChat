import { WEBSOCKET_EVENTS, STORAGE_KEYS} from './constants';

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.eventListeners = new Map();
        this.isConnected = false;
    }

    connect(roomId) {
        if (this.ws && this.isConnected) {
            console.log("WebSocket Already connected");
            return;
        }

        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
            console.error("No access token available for WebSocket");
            return;
        }
        
        try {
            const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log("Websocket connected successfully");
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.emit(WEBSOCKET_EVENTS.CONNECTION_OPENED);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error("Error parsing websocket message: ", error);
                }
            };

            this.ws.onclose = (event) => {
                console.log("Websocket disconnected: ",event.code, event.reason);
                this.isConnected = false;
                this.emit(WEBSOCKET_EVENTS.CONNECTION_CLOSED, { code: event.code, reason: event.reason});

                //Attempt reconnection if not closed normally
                if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.attemptReconnection(roomId);
                }
            };

            this.ws.onerror = () => {
                console.error("Websocket connection failed: ", error);
                this.emit(WEBSOCKET_EVENTS.CONNECTION_ERROR, error);
            };
        } catch (error) {
            console.error("Websocket connection failed: ", error);
        }
   }

   attemptReconnection(roomId) {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... ${this.reconnectAttempts} / ${this.maxReconnectAttempts}`);

    setTimeout(() => {
        this.connect(roomId);
    }, this.reconnectInterval * this.reconnectAttempts);
   }

   handleMessage(data) {
    const { type, ...messageData } = data;

    switch (type) {
        case WEBSOCKET_EVENTS.CHAT_MESSAGE:
            this.emit(WEBSOCKET_EVENTS.CHAT_MESSAGE, messageData);
            break;
        
        case WEBSOCKET_EVENTS.TYPING_START:
            this.emit(WEBSOCKET_EVENTS.TYPING_START, messageData);
            break;

        case WEBSOCKET_EVENTS.TYPING_STOP:
            this.emit(WEBSOCKET_EVENTS.TYPING_STOP, messageData);
            break;

        case WEBSOCKET_EVENTS.MESSAGE_READ:
            this.emit(WEBSOCKET_EVENTS.MESSAGE_READ, messageData);
            break;

        case WEBSOCKET_EVENTS.USER_ONLINE:
            this.emit(WEBSOCKET_EVENTS.USER_ONLINE, messageData);
            break;

        case WEBSOCKET_EVENTS.USER_OFFLINE:
            this.emit(WEBSOCKET_EVENTS.USER_OFFLINE, messageData);
            break;

        case WEBSOCKET_EVENTS.ROOM_UPDATED:
            this.emit(WEBSOCKET_EVENTS.ROOM_UPDATED, messageData);
            break;

        default: 
        console.log("Unknown websocket message type: ", type);
    }
   }

   sendMessage(type, data) {
    if (!this.isConnected || !this.ws) {
        console.error("Websocket not connected");
        return false;
    }
    try {
        const message = JSON.stringify({type, ...data});
        this.ws.send(message);
        return true;
    } catch (error) {
        console.error('Error sending websocket message: ', error);
        return false;
    }
   }
   
    //    sending chat message
    sendChatMessage(content, roomId) {
        return this.sendMessage(WEBSOCKET_EVENTS.CHAT_MESSAGE, {
            message: content,
            room_id: roomId,
        });
    }

    // sending typing indicator
    sendTypingIndicator(roomId, isTyping) {
        return this.sendMessage(
            isTyping ? WEBSOCKET_EVENTS.TYPING_START : WEBSOCKET_EVENTS.TYPING_STOP,
            {
                room_id: roomId,
            }
        )
    }
    // send message read receipt
    sendMessageRead(messageId, roomId) {
        return this.sendMessage(WEBSOCKET_EVENTS.MESSAGE_READ, {
            message_id: messageId,
            room_id: roomId
        });
    }

    //Event listener management
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    off(event, callback) { 
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).delete(callback);
        }
    }

    emit(event, data) { 
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event Listener for ${event}: `, error);
                }
            });
        }
    }
    
    disconnect () {
        if(this.ws) {
            this.ws.close(1000, "Normal closure");
            this.ws = null; 
            this.isConnected = false;
            this.eventListeners.clear();
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts,
        };
    }
}

const webSocketManager = new WebSocketManager();

export default webSocketManager;