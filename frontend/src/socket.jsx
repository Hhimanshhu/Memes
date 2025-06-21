// socket.jsx
import { io } from "socket.io-client";

// Replace this with your backend URL if hosted elsewhere
const socket = io("http://localhost:5000");

export default socket;
