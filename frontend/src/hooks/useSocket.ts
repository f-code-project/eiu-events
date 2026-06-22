import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

import { disconnectSocket, getSocket } from '~/utils/socket';

type UseSocketOptions = {
  events?: Record<string, (...args: any[]) => void>;
  joinRoom?: { event: string; data?: any };
};

const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();

    if (options.joinRoom) {
      socket.emit(options.joinRoom.event, options.joinRoom.data);
    }

    if (options.events) {
      Object.entries(options.events).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    }

    return () => {
      if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
          socket.off(event, handler);
        });
      }
      disconnectSocket();
    };
  }, []);

  return socketRef;
};

export default useSocket;
