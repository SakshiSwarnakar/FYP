import { Server } from "socket.io";
import {
  markAsReadService,
  sendMessageService,
} from "../services/message.service.js";

let io;

const onlineUsers = new Map(); // userId → socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.APP_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("register", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);

      // ── NEW: tell everyone this user is now online ──────────────────────────
      socket.broadcast.emit("user_online", { userId: userId.toString() });

      // ── NEW: send the current online user list back to the registering client
      socket.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });

    socket.on("leave_conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(conversationId);
    });

    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, text, attachment } = data;

        if (!conversationId || !senderId) return;
        if (!text && !attachment?.url) return;

        const { message, recipientId } = await sendMessageService({
          conversationId,
          senderId,
          text,
          attachment,
        });

        io.to(conversationId).emit("message_received", { message });

        if (recipientId) {
          const recipientSocketId = onlineUsers.get(recipientId.toString());
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("new_message_notification", {
              conversationId,
              message,
            });
          }
        }
      } catch (err) {
        console.error("send_message error:", err.message);
        socket.emit("message_error", { error: err.message });
      }
    });

    socket.on("typing", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return;
      socket.to(conversationId).emit("user_typing", { userId });
    });

    socket.on("stop_typing", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return;
      socket.to(conversationId).emit("user_stop_typing", { userId });
    });

    socket.on("messages_read", async ({ conversationId, userId }) => {
      try {
        if (!conversationId || !userId) return;
        await markAsReadService(conversationId, userId);

        socket.to(conversationId).emit("messages_seen", {
          conversationId,
          readBy: userId,
        });
      } catch (err) {
        console.error("messages_read error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);

          // ── NEW: tell everyone this user is now offline ───────────────────
          socket.broadcast.emit("user_offline", { userId });
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

export const getOnlineUsers = () => onlineUsers;
