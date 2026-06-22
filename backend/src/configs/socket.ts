import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { env } from '~/configs/env';

let io: SocketServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
