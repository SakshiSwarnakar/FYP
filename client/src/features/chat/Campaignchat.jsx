import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_BE_URL ?? "http://localhost:6190/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:6190";
const PAGE_LIMIT = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yest.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const AVATAR_COLOURS = [
  "bg-emerald-100 text-emerald-800",
  "bg-violet-100 text-violet-800",
  "bg-orange-100 text-orange-800",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
];
const avatarCls = (id = "") =>
  AVATAR_COLOURS[
  [...(id ?? "")].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLOURS.length
  ];

import { MessageCircleMore } from "lucide-react";
import { api } from "../../axios/axios";

const apiFetch = async (path, opts = {}) => {
  const { method = "GET", body, ...rest } = opts;

  const response = await api.request({
    url: path,
    method,
    data: body ? JSON.parse(body) : undefined,
    ...rest,
  });

  return response.data ?? response;
};

// ─── Shared components ────────────────────────────────────────────────────────
const Avatar = ({ name = "", userId = "", size = "w-10 h-10", text = "text-sm", online = false }) => (
  <div className="relative flex-shrink-0">
    <div className={`${size} ${text} ${avatarCls(userId)} rounded-full flex items-center justify-center font-medium select-none`}>
      {getInitials(name)}
    </div>
    {online && (
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
    )}
  </div>
);

const TypingDots = () => (
  <div className="flex gap-1 px-3 py-2">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </div>
);

const AttachmentBubble = ({ att, mine }) => (
  <a href={att.url} target="_blank" rel="noreferrer"
    className={`flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg text-xs border
      hover:opacity-80 transition-opacity
      ${mine ? "border-white/20 bg-white/10 text-white" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
    <span className="text-lg">{att.type === "image" ? "🖼" : "📄"}</span>
    <span className="truncate max-w-[160px]">{att.originalName}</span>
  </a>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="px-3 py-2.5 border-b border-gray-100">
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0" />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
      )}
    </div>
  </div>
);

const Spinner = ({ size = "w-5 h-5" }) => (
  <div className={`${size} border-2 border-sky-400 border-t-transparent rounded-full animate-spin`} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// CHATS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const ChatsTab = ({ conversations, loadingConvos, activeConvoId, currentUser, onlineUsers, onOpenConvo, onSwitchToPeople }) => {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const other = c.participants?.find(
      (p) => p && typeof p === "object" && p._id !== currentUser._id
    );
    return `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.toLowerCase()
      .includes(search.toLowerCase());
  });

  if (loadingConvos) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
        <Spinner size="w-6 h-6" />
        <span className="text-sm">Loading conversations…</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">No conversations yet</p>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Go to{" "}
            <button onClick={onSwitchToPeople} className="text-sky-500 font-semibold hover:underline">
              People
            </button>{" "}
            and select someone to start chatting
          </p>
        </div>
        <button onClick={onSwitchToPeople}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white
                     text-sm font-semibold hover:bg-sky-600 transition-colors shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Browse people
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SearchBar value={search} onChange={setSearch} placeholder="Search conversations…" />
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No results for "{search}"</p>
          </div>
        )}
        {filtered.map((c) => {
          const other = c.participants?.find((p) => p && typeof p === "object" && p._id !== currentUser._id);
          const name = `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.trim();
          const isActive = c._id === activeConvoId;
          const isOnline = !!(other?._id && onlineUsers.has(other._id));
          const lastTxt = c.lastMessage?.text || (c.lastMessage?.attachment ? "Sent an attachment" : "Say hello 👋");
          const lastTime = c.lastMessage?.createdAt ? fmtTime(c.lastMessage.createdAt) : "";

          return (
            <button key={c._id} onClick={() => onOpenConvo(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50
                          transition-colors text-left border-l-[3px]
                          ${isActive ? "bg-sky-50 border-l-sky-500" : "hover:bg-gray-50 border-l-transparent"}`}>
              <Avatar name={name} userId={other?._id} size="w-11 h-11" online={isOnline} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <p className={`text-[13.5px] font-medium truncate ${isActive ? "text-sky-700" : "text-gray-900"}`}>
                    {name || "Unknown"}
                  </p>
                  <span className={`text-[11px] flex-shrink-0 ${(c.unreadCount ?? 0) > 0 ? "text-sky-500 font-semibold" : "text-gray-300"}`}>
                    {lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className="text-xs text-gray-400 truncate">{lastTxt}</p>
                  {(c.unreadCount ?? 0) > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500
                                     text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PEOPLE TAB
// ═══════════════════════════════════════════════════════════════════════════════
const PeopleTab = ({ currentUser, conversations, onlineUsers, onSelectPerson }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = currentUser.role === "ADMIN"
      ? "/campaign"
      : "/campaign?myVolunteerStatus=accepted";

    apiFetch(url)
      .then((res) => setCampaigns(res.campaigns ?? res ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser.role]);

  const allEntries = [];
  campaigns.forEach((camp) => {
    const campId = camp.id ?? camp._id;
    const adminId = typeof camp.createdBy === "object"
      ? camp.createdBy?._id
      : camp.createdBy;

    const iAmAdmin = adminId === currentUser._id;

    if (iAmAdmin) {
      (camp.volunteers ?? [])
        .filter((v) => v.status === "accepted" && v.volunteer)
        .forEach((v) => {
          const vol = v.volunteer;
          const name = `${vol.firstName ?? ""} ${vol.lastName ?? ""}`.trim();
          allEntries.push({
            key: `${campId}-${vol._id}`,
            campaignId: campId,
            campaignTitle: camp.title,
            personId: vol._id,
            personName: name,
            personObj: vol,
            volunteerId: vol._id,
            roleLabel: "Volunteer",
          });
        });
    } else {
      const iAmAccepted = (camp.volunteers ?? []).some(
        (v) =>
          v.status === "accepted" &&
          v.volunteer &&
          (typeof v.volunteer === "object" ? v.volunteer._id : v.volunteer) === currentUser._id
      );
      if (!iAmAccepted) return;

      const admin = typeof camp.createdBy === "object" ? camp.createdBy : null;
      if (!admin) return;

      const name = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
      allEntries.push({
        key: `${campId}-${admin._id}`,
        campaignId: campId,
        campaignTitle: camp.title,
        personId: admin._id,
        personName: name,
        personObj: admin,
        volunteerId: currentUser._id,
        roleLabel: "Campaign Admin",
      });
    }
  });

  const filtered = search.trim()
    ? allEntries.filter(
      (e) =>
        e.personName.toLowerCase().includes(search.toLowerCase()) ||
        e.campaignTitle.toLowerCase().includes(search.toLowerCase()),
    )
    : allEntries;

  const grouped = filtered.reduce((acc, e) => {
    if (!acc[e.campaignId]) acc[e.campaignId] = { title: e.campaignTitle, items: [] };
    acc[e.campaignId].items.push(e);
    return acc;
  }, {});

  const findConvo = (personId) =>
    conversations.find((c) =>
      c.participants?.some((p) => p && typeof p === "object" && p._id === personId)
    );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
        <Spinner size="w-6 h-6" />
        <span className="text-sm">Loading people…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SearchBar value={search} onChange={setSearch} placeholder="Search name or campaign…" />
      <div className="flex-1 overflow-y-auto">
        {allEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-2">
            <span className="text-4xl">👥</span>
            <p className="text-sm font-semibold text-gray-500 mt-1">Nobody to chat with yet</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Volunteers must be accepted into a campaign before they appear here.
            </p>
          </div>
        )}
        {allEntries.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-gray-500 mt-2">No results for "{search}"</p>
          </div>
        )}

        {Object.entries(grouped).map(([campId, group]) => (
          <div key={campId}>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 sticky top-0 z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                {group.title}
              </p>
            </div>

            {group.items.map((entry) => {
              const isOnline = !!(entry.personId && onlineUsers.has(entry.personId));
              const existingConvo = findConvo(entry.personId);

              return (
                <button
                  key={entry.key}
                  onClick={() => onSelectPerson(entry, existingConvo ?? null)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50
                             hover:bg-sky-50/70 active:bg-sky-100/60 transition-colors text-left group"
                >
                  <Avatar name={entry.personName} userId={entry.personId}
                    size="w-11 h-11" text="text-sm" online={isOnline} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-gray-900 truncate">
                      {entry.personName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.roleLabel}
                      {isOnline && <span className="ml-2 text-emerald-500 font-medium">● Online</span>}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-10 flex items-center justify-center">
                    {existingConvo ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                       bg-sky-50 text-sky-500 border border-sky-100 whitespace-nowrap">
                        Open
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-all
                                      scale-90 group-hover:scale-100 shadow-sm">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CampaignChat({ currentUser }) {
  const [openChat, setOpenChat] = useState()
  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [pendingChat, setPendingChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [sidebarTab, setSidebarTab] = useState("chats");

  const onClose = () => setOpenChat(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);
  // Keep a ref to activeConvoId so socket callbacks always see the latest value
  // without needing to be re-registered when it changes.
  const activeConvoIdRef = useRef(activeConvoId);
  useEffect(() => { activeConvoIdRef.current = activeConvoId; }, [activeConvoId]);

  const activeConvo = conversations.find((c) => c._id === activeConvoId) ?? null;
  const totalUnread = conversations.reduce((a, c) => a + (c.unreadCount ?? 0), 0);
  const hasChatOpen = activeConvoId !== null || pendingChat !== null;

  // ── FIX 1: Socket connects ONCE on mount — no activeConvoId in deps ──────────
  useEffect(() => {
    const token = sessionStorage.getItem("at");
    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("register", currentUser._id));

    socket.on("online_users", (ids) => setOnlineUsers(new Set(ids)));
    socket.on("user_online", ({ userId }) =>
      setOnlineUsers((prev) => new Set([...prev, userId]))
    );
    socket.on("user_offline", ({ userId }) => {
      setOnlineUsers((prev) => { const n = new Set(prev); n.delete(userId); return n; });
    });

    // ── FIX 3: Replace optimistic temp message instead of deduping by real ID ──
    socket.on("message_received", ({ message }) => {
      setMessages((prev) => {
        // If there's a pending optimistic message for this conversation, replace it.
        const tempIndex = prev.findIndex(
          (m) => m.pending && m.conversationId === message.conversationId
        );
        if (tempIndex !== -1) {
          const next = [...prev];
          next[tempIndex] = message;
          return next;
        }
        // Otherwise guard against any true duplicate (e.g. fast double-emit).
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversationId
            ? {
                ...c,
                lastMessage: message,
                unreadCount:
                  (c.unreadCount ?? 0) +
                  (message.sender?._id !== currentUser._id ? 1 : 0),
              }
            : c
        )
      );
    });

    socket.on("new_message_notification", ({ conversationId }) =>
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId && c._id !== activeConvoIdRef.current
            ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 }
            : c
        )
      )
    );

    socket.on("user_typing", ({ userId }) =>
      setTypingUsers((p) => ({ ...p, [userId]: true }))
    );
    socket.on("user_stop_typing", ({ userId }) =>
      setTypingUsers((p) => { const n = { ...p }; delete n[userId]; return n; })
    );

    socket.on("messages_seen", ({ conversationId, readBy }) => {
      if (conversationId === activeConvoIdRef.current) {
        setMessages((p) =>
          p.map((m) =>
            m.sender?._id === currentUser._id
              ? { ...m, readBy: [...(m.readBy ?? []), readBy] }
              : m
          )
        );
      }
    });

    socket.on("message_error", ({ error }) => console.error("Socket error:", error));

    return () => socket.disconnect();
     
  }, [currentUser._id]); // ← only currentUser._id, NOT activeConvoId

  // ── FIX 1 (continued): Join/leave room in its own effect keyed to activeConvoId
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConvoId) return;

    socket.emit("join_conversation", { conversationId: activeConvoId });

    return () => {
      socket.emit("leave_conversation", { conversationId: activeConvoId });
    };
  }, [activeConvoId]);

  // ── Load conversations on mount ─────────────────────────────────────────────
  useEffect(() => {
    setLoadingConvos(true);
    apiFetch("/message/conversations")
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoadingConvos(false));
  }, []);

  // Auto-switch to People tab if no conversations
  useEffect(() => {
    if (!loadingConvos && conversations.length === 0) setSidebarTab("people");
  }, [loadingConvos, conversations.length]);

  // ── Open an existing conversation ───────────────────────────────────────────
  const openConvo = useCallback(async (convo) => {
    const convoId = typeof convo === "object" ? convo._id : convo;
    if (!convoId) return;

    setPendingChat(null);
    setActiveConvoId(convoId);
    setSidebarTab("chats");
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setLoadingMsgs(true);

    try {
      const data = await apiFetch(
        `/message/conversation/${convoId}/messages?page=1&limit=${PAGE_LIMIT}`
      );
      const msgs = data.messages ?? [];
      setMessages([...msgs].reverse());
      setHasMore(msgs.length === PAGE_LIMIT);
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMsgs(false);
    }

    const socket = socketRef.current;
    if (socket) {
      socket.emit("messages_read", { conversationId: convoId, userId: currentUser._id });
    }
    setConversations((p) =>
      p.map((c) => (c._id === convoId ? { ...c, unreadCount: 0 } : c))
    );
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [currentUser._id]);

  // ── Select a person from PeopleTab ──────────────────────────────────────────
  const handleSelectPerson = useCallback((entry, existingConvo) => {
    if (existingConvo) {
      openConvo(existingConvo);
      return;
    }
    setActiveConvoId(null);
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setPendingChat(entry);
    setSidebarTab("chats");
  }, [openConvo]);

  // ── Load older messages ─────────────────────────────────────────────────────
  const loadMore = async () => {
    if (!hasMore || loadingMsgs || !activeConvoId) return;
    const next = page + 1;
    setLoadingMsgs(true);
    try {
      // FIX 5: correct URL — /message/ not /messages/
      const data = await apiFetch(
        `/message/conversation/${activeConvoId}/messages?page=${next}&limit=${PAGE_LIMIT}`
      );
      const msgs = data.messages ?? [];
      setMessages((p) => [...[...msgs].reverse(), ...p]);
      setHasMore(msgs.length === PAGE_LIMIT);
      setPage(next);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Typing ──────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!activeConvoId) return;
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("typing", { conversationId: activeConvoId, userId: currentUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId: activeConvoId, userId: currentUser._id });
    }, 2000);
  };

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = async (attachmentPayload = null) => {
    const trimmed = text.trim();
    if (!trimmed && !attachmentPayload) return;

    const socket = socketRef.current;
    setText("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    let convoId = activeConvoId;

    if (pendingChat) {
      try {
        const convo = await apiFetch("/message/conversation", {
          method: "POST",
          body: JSON.stringify({
            campaignId: pendingChat.campaignId,
            volunteerId: pendingChat.volunteerId,
          }),
        });
        convoId = convo._id;
        setConversations((prev) => [convo, ...prev]);
        setActiveConvoId(convoId);
        setPendingChat(null);
        socket?.emit("join_conversation", { conversationId: convoId });
      } catch (e) {
        console.error("Failed to create conversation:", e);
        if (trimmed) setText(trimmed);
        return;
      }
    }

    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      conversationId: convoId,
      sender: { ...currentUser },
      text: trimmed || null,
      attachment: attachmentPayload || null,
      createdAt: new Date().toISOString(),
      readBy: [currentUser._id],
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c._id === convoId ? { ...c, lastMessage: optimisticMsg } : c
      )
    );

    socket?.emit("send_message", {
      conversationId: convoId,
      senderId: currentUser._id,
      text: trimmed || null,
      attachment: attachmentPayload || undefined,
    });
    socket?.emit("stop_typing", { conversationId: convoId, userId: currentUser._id });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Upload attachment ─────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      let convoId = activeConvoId;

      if (!convoId && pendingChat) {
        const convo = await apiFetch("/message/conversation", {
          method: "POST",
          body: JSON.stringify({
            campaignId: pendingChat.campaignId,
            volunteerId: pendingChat.volunteerId,
          }),
        });
        convoId = convo._id;
        setConversations((prev) => [convo, ...prev]);
        setActiveConvoId(convoId);
        setPendingChat(null);
        socketRef.current?.emit("join_conversation", { conversationId: convoId });
      }

      // FIX 4: Use field names that match AttachmentBubble (originalName, url)
      // url is null for now — it gets replaced when message_received fires with the real message
      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        conversationId: convoId,
        sender: { ...currentUser },
        text: null,
        attachment: { originalName: file.name, type: file.type, url: null },
        createdAt: new Date().toISOString(),
        readBy: [currentUser._id],
        pending: true,
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === convoId ? { ...c, lastMessage: optimisticMsg } : c
        )
      );

      // Upload to backend
      const response = await api.post(
        `/message/conversation/${convoId}/attachment`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const att = response.data ?? response;

      // Emit with the real attachment object (has url, originalName, type, public_id)
      socketRef.current?.emit("send_message", {
        conversationId: convoId,
        senderId: currentUser._id,
        text: null,
        attachment: att,
      });

    } catch (err) {
      console.error("Attachment error:", err);
      // Remove the optimistic message on failure
      setMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ── Derive chat header info ───────────────────────────────────────────────────
  const chatOther = (() => {
    if (pendingChat) {
      return {
        _id: pendingChat.personId,
        firstName: pendingChat.personObj?.firstName ?? pendingChat.personName?.split(" ")[0] ?? "",
        lastName: pendingChat.personObj?.lastName ?? pendingChat.personName?.split(" ")[1] ?? "",
      };
    }
    if (activeConvo) {
      return activeConvo.participants?.find(
        (p) => p && typeof p === "object" && p._id && p._id !== currentUser._id
      ) ?? null;
    }
    return null;
  })();

  const chatOtherName = chatOther
    ? `${chatOther.firstName ?? ""} ${chatOther.lastName ?? ""}`.trim()
    : "";
  const chatOtherOnline = !!(chatOther?._id && onlineUsers.has(chatOther._id));
  const chatSomebodyTyping = !!(chatOther?._id && typingUsers[chatOther._id]);

  const groupedMessages = messages.reduce((acc, m) => {
    const key = m.createdAt ? fmtDate(m.createdAt) : "Today";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      <button onClick={() => setOpenChat(!openChat)}>
        <MessageCircleMore className="text-primary" />
      </button>
      {openChat && (
        <div className="flex absolute top-10 right-4 h-[80vh] bg-gray-50 font-sans overflow-hidden rounded-2xl shadow-lg border border-gray-100">

          {/* ───────────── SIDEBAR ───────────── */}
          <aside className="w-[300px] bg-white border-r border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/30">
              <Avatar
                name={`${currentUser.firstName} ${currentUser.lastName}`}
                userId={currentUser._id}
                size="w-9 h-9"
                text="text-xs"
                online
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-gray-900 truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-[11px] text-emerald-500 font-medium">● Active</p>
              </div>
            </div>

            <div className="flex border-b border-gray-100 bg-white">
              {[
                { id: "chats", label: "Chats", badge: totalUnread > 0 ? totalUnread : null },
                { id: "people", label: "People" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`relative flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors
                        ${sidebarTab === tab.id
                      ? "text-sky-600"
                      : "text-gray-400 hover:text-gray-600"}`}
                >
                  {tab.label}
                  {tab.badge && (
                    <span className="min-w-[16px] h-4 px-1 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                  {sidebarTab === tab.id && (
                    <span className="absolute bottom-0 left-6 right-6 h-[2px] bg-sky-500 rounded-full transition-all" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              {sidebarTab === "chats" ? (
                <ChatsTab
                  conversations={conversations}
                  loadingConvos={loadingConvos}
                  activeConvoId={activeConvoId}
                  currentUser={currentUser}
                  onlineUsers={onlineUsers}
                  onOpenConvo={openConvo}
                  onSwitchToPeople={() => setSidebarTab("people")}
                />
              ) : (
                <PeopleTab
                  currentUser={currentUser}
                  conversations={conversations}
                  onlineUsers={onlineUsers}
                  onSelectPerson={handleSelectPerson}
                />
              )}
            </div>
          </aside>

          {/* ───────────── CHAT AREA ───────────── */}
          {!hasChatOpen ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center bg-gradient-to-b from-gray-50 to-gray-100 px-10">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <svg className="w-9 h-9 text-gray-300" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-600">Your messages live here</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  {conversations.length === 0
                    ? "Go to People and select someone to start your first conversation."
                    : "Select a chat from the left to continue."}
                </p>
              </div>
              {conversations.length === 0 && (
                <button
                  onClick={() => setSidebarTab("people")}
                  className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold shadow-sm hover:bg-sky-600 transition-colors"
                >
                  Browse people
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Header */}
              <div className="h-[60px] bg-white border-b border-gray-100 flex items-center px-5 gap-3 shadow-sm">
                {chatOther ? (
                  <>
                    <Avatar
                      name={chatOtherName}
                      userId={chatOther._id}
                      size="w-9 h-9"
                      text="text-xs"
                      online={chatOtherOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {chatOtherName || "Unknown"}
                      </p>
                      <p className={`text-xs ${chatOtherOnline ? "text-emerald-500" : "text-gray-400"}`}>
                        {chatOtherOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <Spinner size="w-4 h-4" />
                    <span className="text-sm text-gray-400">Loading…</span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
                {hasMore && (
                  <div className="text-center mb-3">
                    <button
                      onClick={loadMore}
                      disabled={loadingMsgs}
                      className="text-xs text-sky-600 border border-sky-100 bg-sky-50 rounded-full px-4 py-1.5 hover:bg-sky-100 disabled:opacity-50"
                    >
                      {loadingMsgs ? "Loading…" : "Load older messages"}
                    </button>
                  </div>
                )}

                {loadingMsgs && messages.length === 0 && (
                  <div className="flex justify-center py-12"><Spinner size="w-5 h-5" /></div>
                )}

                {!loadingMsgs && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-14 text-center text-gray-500">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      {chatOther && (
                        <Avatar name={chatOtherName} userId={chatOther._id} size="w-14 h-14" text="text-base" />
                      )}
                    </div>
                    <p className="text-sm font-semibold">{chatOtherName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {pendingChat ? "Send a message to start chatting" : "No messages yet — say hi!"}
                    </p>
                  </div>
                )}

                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[11px] text-gray-400 border border-gray-100 rounded-full py-0.5 px-2.5 bg-white">
                        {date}
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {msgs.map((m, i) => {
                      const isMine = m.sender?._id === currentUser._id || m.sender === currentUser._id;
                      const isLast = i === msgs.length - 1;
                      const seen = isMine && (m.readBy ?? []).some((id) => id !== currentUser._id);

                      return (
                        <div key={m._id} className={`flex flex-col mb-1 ${isMine ? "items-end" : "items-start"}`}>
                          <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                            {!isMine && chatOther && (
                              <Avatar name={chatOtherName} userId={chatOther._id} size="w-7 h-7" text="text-[10px]" />
                            )}
                            <div
                              className={`max-w-[65%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm
                                ${isMine
                                  ? "bg-sky-500 text-white rounded-br-sm"
                                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"}
                                ${m.pending ? "opacity-70" : ""}`}
                            >
                              {m.text && <p>{m.text}</p>}
                              {m.attachment?.url && <AttachmentBubble att={m.attachment} mine={isMine} />}
                              {m.attachment && !m.attachment.url && (
                                <p className="text-xs mt-1 opacity-60">
                                  📎 {m.attachment.originalName} — uploading…
                                </p>
                              )}
                              <p className={`text-[11px] mt-1 ${isMine ? "text-white/70 text-right" : "text-gray-400"}`}>
                                {m.createdAt ? fmtTime(m.createdAt) : ""}
                              </p>
                            </div>
                          </div>
                          {isMine && isLast && (
                            <p className={`text-[11px] mt-0.5 mr-1 ${seen ? "text-emerald-500" : "text-gray-400"}`}>
                              {m.pending ? "Sending…" : seen ? "Seen" : "Delivered"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {chatSomebodyTyping && chatOther && (
                  <div className="flex items-end gap-2 mt-2">
                    <Avatar name={chatOtherName} userId={chatOther._id} size="w-7 h-7" text="text-[10px]" />
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-3 py-2">
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2.5">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Attach file"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  📎
                </button>

                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={uploading}
                  placeholder={
                    uploading
                      ? "Uploading…"
                      : pendingChat
                      ? `Message ${chatOtherName || ""}…`
                      : "Type a message…"
                  }
                  rows={1}
                  className="flex-1 px-4 py-2.5 text-[13.5px] bg-gray-50 border border-gray-200 rounded-2xl placeholder-gray-400 resize-none leading-snug max-h-20 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition disabled:opacity-50"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                  }}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!text.trim() || uploading}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                        ${text.trim()
                      ? "bg-sky-500 hover:bg-sky-600 shadow-sm"
                      : "bg-gray-200 cursor-not-allowed"}`}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
