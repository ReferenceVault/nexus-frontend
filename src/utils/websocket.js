import { io } from 'socket.io-client';
import { store } from '../store';
import { isTokenExpired } from './apiClient';

/**
 * Reusable WebSocket client for real-time updates
 * Handles authentication, reconnection, and event management
 */
class WebSocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (!accessToken || isTokenExpired(accessToken)) {
      console.warn('Cannot connect WebSocket: No valid access token');
      this.isConnecting = false;
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Convert http:// to ws:// or https:// to wss://
    const wsUrl = API_BASE_URL.replace(/^http/, 'ws').replace(/^https/, 'wss');

    console.log('Connecting to WebSocket:', `${wsUrl}/ws`);

    this.socket = io(`${wsUrl}/ws`, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnecting = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      
      if (error.message.includes('authentication')) {
        console.warn('WebSocket authentication failed, token may be expired');
      }
    });

    this.socket.on('connected', (data) => {
      console.log('WebSocket connection confirmed:', data);
    });

    this.socket.on('pong', (data) => {
      console.debug('WebSocket pong received:', data);
    });

    // Handle analysis progress events
    this.socket.on('analysis:progress', (data) => {
      console.log('Analysis progress:', data);
      this.emit('analysis:progress', data);
    });

    // Forward all events to registered listeners
    this.socket.onAny((event, ...args) => {
      this.emit(event, ...args);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Reconnect to WebSocket server
   */
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Subscribe to an event
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to registered listeners
   */
  emit(event, ...args) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Send ping to server
   */
  ping() {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();

