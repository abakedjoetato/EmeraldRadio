import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinStation(stationSlug: string) {
    if (this.socket) {
      this.socket.emit('joinStation', stationSlug);
    }
  }

  leaveStation() {
    if (this.socket) {
      this.socket.emit('leaveStation');
    }
  }

  sendMessage(stationSlug: string, username: string, message: string) {
    if (this.socket) {
      this.socket.emit('sendMessage', { stationSlug, username, message });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onListenerUpdate(callback: (data: { count: number }) => void) {
    if (this.socket) {
      this.socket.on('listenerUpdate', callback);
    }
  }

  onUserJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userJoined', callback);
    }
  }

  onUserTyping(callback: (data: { username: string }) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserStoppedTyping(callback: () => void) {
    if (this.socket) {
      this.socket.on('userStoppedTyping', callback);
    }
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void) {
    if (this.socket) {
      this.socket.on('messageDeleted', callback);
    }
  }

  offNewMessage() {
    if (this.socket) {
      this.socket.off('newMessage');
    }
  }

  offListenerUpdate() {
    if (this.socket) {
      this.socket.off('listenerUpdate');
    }
  }

  offUserJoined() {
    if (this.socket) {
      this.socket.off('userJoined');
    }
  }

  offUserTyping() {
    if (this.socket) {
      this.socket.off('userTyping');
    }
  }

  offUserStoppedTyping() {
    if (this.socket) {
      this.socket.off('userStoppedTyping');
    }
  }

  offMessageDeleted() {
    if (this.socket) {
      this.socket.off('messageDeleted');
    }
  }

  emitTyping(stationSlug: string, username: string) {
    if (this.socket) {
      this.socket.emit('typing', { stationSlug, username });
    }
  }

  emitStopTyping(stationSlug: string) {
    if (this.socket) {
      this.socket.emit('stopTyping', { stationSlug });
    }
  }
}

export const socketService = new SocketService();
