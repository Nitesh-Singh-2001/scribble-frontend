import { io } from "socket.io-client";

// Ensure this is 5001 to match your server
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  transports: ['websocket', 'polling'] // Adding this helps bypass some proxy issues
});