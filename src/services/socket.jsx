import { io } from "socket.io-client";

// Ensure this is 5001 to match your server
const SOCKET_URL = "http://localhost:3001"; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  transports: ['websocket', 'polling'] // Adding this helps bypass some proxy issues
});