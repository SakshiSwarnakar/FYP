import { io } from "socket.io-client";

export const socket = io("http://localhost:6190", {
  withCredentials: true,
  autoConnect: false,
});
