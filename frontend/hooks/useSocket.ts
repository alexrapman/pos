// frontend/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<ReturnType<typeof io> | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001');

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current!;
};