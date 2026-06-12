import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Paperclip, Send, MoreVertical, X,
  Check, CheckCheck, Smile, Info, Clock, Circle, MessageSquare,
  User, MapPin, Mail, Shield, BookOpen, Briefcase, Download, FileText,
  Plus, ArrowLeft
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import './candidate/Dashboard.css';
import './Messages.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

const STICKERS = {
  sticker_rocket: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 13 6 16 9C19 12 22 12 22 12C22 12 18 13 15 16C12 19 12 22 12 22C12 22 11 18 8 15C5 12 2 12 2 12C2 12 6 11 9 8C12 5 12 2 12 2Z" fill="url(#rocketGrad)" />
      <circle cx="12" cy="12" r="3" fill="#ffffff" opacity="0.8" />
      <defs>
        <linearGradient id="rocketGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sticker_coffee: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 19C2 20.1 2.9 21 4 21H16C17.1 21 18 20.1 18 19V8H2V19ZM4 10H16V19H4V10Z" fill="url(#coffeeGrad)" />
      <path d="M6 3V6M10 3V6M14 3V6" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 8H20C21.1 8 22 8.9 22 10V14C22 15.1 21.1 16 20 16H18V8ZM18 10V14H20V10H18Z" fill="url(#coffeeGrad)" />
      <defs>
        <linearGradient id="coffeeGrad" x1="2" y1="8" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sticker_coder: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="13" rx="2" fill="url(#coderGrad)" />
      <path d="M6 16L4 21H20L18 16" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8L10 10L8 12M13 12H16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="coderGrad" x1="2" y1="3" x2="22" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sticker_party: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 21C4.5 21 3 17.5 7 13.5C11 9.5 15.5 8 15.5 8C15.5 8 14 12.5 10 16.5C6 20.5 4.5 21 4.5 21Z" fill="url(#partyGrad1)" />
      <circle cx="17.5" cy="6.5" r="2.5" fill="#facc15" />
      <path d="M12 5L13.5 3.5M19 11L21 12M18 4L20 2M20 7L22 7.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="partyGrad1" x1="4.5" y1="8" x2="15.5" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sticker_bug: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4C9 4 7 6 7 9V14C7 17 9 19 12 19C15 19 17 17 17 14V9C17 6 15 4 12 4Z" fill="url(#bugGrad)" />
      <circle cx="12" cy="7" r="1.5" fill="#ffffff" />
      <path d="M4 8C4 8 6 9 7 9M20 8C20 8 18 9 17 9M3 13H7M21 13H17M4 18C4 18 6 17 7 16M20 18C20 18 18 17 17 16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 2L12 4L14 2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="bugGrad" x1="7" y1="4" x2="17" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sticker_brain: (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C11.3 21 10.7 20.8 10.1 20.4C8 19 7 17.5 7 15.5C7 14.8 7.3 14.2 7.7 13.7C6.7 13.2 6 12.2 6 11C6 9.8 6.7 8.8 7.7 8.3C7.3 7.8 7 7.2 7 6.5C7 4.5 8 3 10.1 1.6C10.7 1.2 11.3 1 12 1M12 21C12.7 21 13.3 20.8 13.9 20.4C16 19 17 17.5 17 15.5C17 14.8 16.7 14.2 16.3 13.7C17.3 13.2 18 12.2 18 11C18 9.8 17.3 8.8 16.3 8.3C16.7 7.8 17 7.2 17 6.5C17 4.5 16 3 13.9 1.6C13.3 1.2 12.7 1 12 1" stroke="url(#brainGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 1V21" stroke="url(#brainGrad)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="brainGrad" x1="6" y1="1" x2="18" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  )
};

const POPULAR_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '💀',
  '👍', '👎', '👌', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟',
  '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✋', '🤚',
  '👋', '👏', '✍️', '🙏', '🤝', '💅', '🤳', '💪', '🧠', '❤️'
];

const Messages = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState('');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState('emoji'); // 'emoji' or 'sticker'
  
  // Three-dot menu, details panel, and new chat states
  const [showMenu, setShowMenu] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  
  // New Chat Sidebar flow
  const [showNewChatSidebar, setShowNewChatSidebar] = useState(false);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isLoadingEligibleUsers, setIsLoadingEligibleUsers] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const pickerRef = useRef(null);

  // 1. Fetch Conversations on Mount
  const loadConversations = async () => {
    if (!currentUserId) return;
    try {
      const data = await api.get('/chat/conversations');
      setConversations(data);
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  // 2. Fetch Messages when Active Chat Changes
  const loadMessages = async (chatId) => {
    try {
      const data = await api.get(`/chat/conversations/${chatId}/messages`);
      setConversations(prev => prev.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: data, unread: 0 };
        }
        return c;
      }));
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
      setShowDetailsPanel(false); // Close details panel on chat switch
      setShowMessageSearch(false);
      setMessageSearchQuery('');
    }
  }, [activeChatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Click outside handlers for popup UI elements
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        // Only close if not clicking Smile button itself
        if (!e.target.closest('.emoji-toggle-btn')) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. STOMP WebSocket Connection
  const conversationsKeyStr = conversations.map(c => c.id).join(',');
  useEffect(() => {
    if (!conversationsKeyStr || !currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('[STOMP] ' + str),
    });

    client.onConnect = () => {
      console.log('Connected to STOMP WebSocket Server');
      
      conversations.forEach(chat => {
        client.subscribe(`/topic/messages/${chat.id}`, (msg) => {
          const payload = JSON.parse(msg.body);
          if (payload.type === 'TYPING') {
            if (payload.chatId === activeChatId && payload.senderId !== currentUserId) {
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 3000);
            }
          } else {
            handleIncomingMessage(payload);
          }
        });
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [conversationsKeyStr, activeChatId, currentUserId]);

  const handleIncomingMessage = (payload) => {
    const isMe = payload.senderId === currentUserId;
    
    setConversations(prev => prev.map(chat => {
      if (chat.id === payload.chatId) {
        const exists = chat.messages ? chat.messages.some(m => m.id === payload.id) : false;
        let updatedMessages = chat.messages ? [...chat.messages] : [];
        
        if (exists) {
          updatedMessages = updatedMessages.map(m => m.id === payload.id ? { ...m, status: payload.status } : m);
        } else if (isMe) {
          // Prevent double message rendering: Check if there's a temp message matching text & type
          const tempIdx = updatedMessages.findIndex(m => 
            m.id.toString().startsWith('temp_') && m.text === payload.text && m.type === payload.type
          );
          if (tempIdx !== -1) {
            // Replace local optimistic message with database-persisted message
            updatedMessages[tempIdx] = {
              id: payload.id,
              sender: 'me',
              senderId: payload.senderId,
              text: payload.text,
              time: payload.time,
              status: payload.status,
              type: payload.type,
              attachments: payload.attachments || []
            };
          } else {
            // Append if it was sent from another tab or context
            updatedMessages.push({
              id: payload.id,
              sender: 'me',
              senderId: payload.senderId,
              text: payload.text,
              time: payload.time,
              status: payload.status,
              type: payload.type,
              attachments: payload.attachments || []
            });
          }
        } else {
          // Received message from chat partner
          updatedMessages.push({
            id: payload.id,
            sender: 'them',
            senderId: payload.senderId,
            text: payload.text,
            time: payload.time,
            status: payload.status,
            type: payload.type,
            attachments: payload.attachments || []
          });
        }

        const unreadCount = (activeChatId === chat.id || isMe) ? 0 : chat.unread + 1;
        return { ...chat, messages: updatedMessages, unread: unreadCount };
      }
      return chat;
    }));
  };

  const sendTypingEvent = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          chatId: activeChatId,
          senderId: currentUserId,
          text: '',
          type: 'TYPING'
        })
      });
    }
  };

  // 4. Send Message Payload (Generic helper for all message types)
  const sendMessagePayload = async (text, type = 'CHAT', attachments = null) => {
    const tempId = `temp_${Date.now()}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Local optimistic update
    const optimisticMessage = {
      id: tempId,
      sender: 'me',
      senderId: currentUserId,
      text: text,
      time: timeNow,
      status: 'sent',
      type: type,
      attachments: attachments || []
    };

    setConversations(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...(chat.messages || []), optimisticMessage], unread: 0 };
      }
      return chat;
    }));

    const payload = {
      chatId: activeChatId,
      senderId: currentUserId,
      text: text,
      type: type,
      status: 'sent',
      attachments: attachments || []
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(payload)
      });
    } else {
      // HTTP Fallback
      try {
        const savedMsg = await api.post(`/chat/conversations/${activeChatId}/messages`, payload);
        
        // Refresh conversations list to ensure this new chat has saved details in sidebar
        loadConversations();
        
        setConversations(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            const updated = chat.messages.map(m => m.id === tempId ? savedMsg : m);
            return { ...chat, messages: updated };
          }
          return chat;
        }));
      } catch (err) {
        console.error("Failed to send message over API", err);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessagePayload(inputText.trim(), 'CHAT');
    setInputText('');
  };

  // 5. Send Sticker
  const handleSendSticker = (stickerId) => {
    setShowEmojiPicker(false);
    sendMessagePayload(stickerId, 'STICKER');
  };

  // 6. File Attachment Upload & Secure Download
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const attachmentData = await api.upload('/chat/upload', formData);
      sendMessagePayload(file.name, 'ATTACHMENT', [attachmentData]);
    } catch (err) {
      console.error("Failed to upload file", err);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleDownloadFile = async (attachmentId, fileName) => {
    try {
      const token = localStorage.getItem('qh_token');
      const response = await fetch(`http://localhost:8080/api/v1/chat/attachments/download/${attachmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Could not fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download attachment", err);
      alert("Failed to download attachment. You may not have permission.");
    }
  };

  // 7. Chat Actions (Archive, Mute, Clear, Delete, Block)
  const handleChatAction = async (action, value = true) => {
    setShowMenu(false);
    
    // Save current states for rollback in case of error
    const previousConversations = conversations;
    const previousActiveChatId = activeChatId;

    // Apply optimistic updates instantly
    if (action === 'clear') {
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [] } : c));
    } else if (action === 'delete' || action === 'archive') {
      const remaining = conversations.filter(c => c.id !== activeChatId);
      setConversations(remaining);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        setActiveChatId('');
      }
    } else if (action === 'mute') {
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, isMuted: value } : c));
    } else if (action === 'block') {
      setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, isBlocked: value } : c));
      alert(value ? "User blocked successfully" : "User unblocked successfully");
    }

    try {
      await api.put(`/chat/conversations/${activeChatId}/action`, { action, value });
    } catch (err) {
      console.error(`Failed to execute action ${action}`, err);
      // Rollback to previous state
      setConversations(previousConversations);
      setActiveChatId(previousActiveChatId);
      alert(`Error performing action. Please try again.`);
    }
  };

  // 8. Fetch Partner Info Panel Details
  const fetchPartnerDetails = async (partnerId) => {
    setIsLoadingDetails(true);
    try {
      const data = await api.get(`/chat/users/${partnerId}`);
      setPartnerDetails(data);
    } catch (err) {
      console.error("Failed to load details", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (showDetailsPanel && activeChat?.partnerId) {
      fetchPartnerDetails(activeChat.partnerId);
    }
  }, [showDetailsPanel, activeChat?.partnerId]);

  // 9. New Chat Search Flow
  const handleNewChatOpen = async () => {
    setShowNewChatSidebar(true);
    setNewChatSearchQuery('');
    fetchEligibleUsers('');
  };

  const fetchEligibleUsers = async (queryVal) => {
    setIsLoadingEligibleUsers(true);
    try {
      const data = await api.get('/chat/users/search', { query: queryVal });
      setEligibleUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoadingEligibleUsers(false);
    }
  };

  const handleNewChatQueryChange = (e) => {
    const val = e.target.value;
    setNewChatSearchQuery(val);
    fetchEligibleUsers(val);
  };

  const handleStartNewConversation = (partner) => {
    const computedChatId = currentUserId < partner.id ? `${currentUserId}_${partner.id}` : `${partner.id}_${currentUserId}`;
    
    // Check if conversation already exists in sidebar
    const exists = conversations.some(c => c.id === computedChatId);
    if (exists) {
      setActiveChatId(computedChatId);
    } else {
      // Create a temporary conversation object in state
      const tempConv = {
        id: computedChatId,
        partnerId: partner.id,
        name: partner.name + (partner.role !== 'Candidate' ? ` (${partner.role})` : ''),
        company: partner.role === 'Candidate' ? 'Job Seeker' : partner.role === 'Recruiter' ? 'TechCorp Inc.' : 'Technical Mentor',
        avatar: partner.avatar || partner.name.substring(0, 1).toUpperCase(),
        isOnline: true,
        unread: 0,
        roleContext: partner.role === 'Candidate' ? 'Software Engineer' : 'Consulting Partner',
        messages: []
      };
      setConversations(prev => [tempConv, ...prev]);
      setActiveChatId(computedChatId);
    }
    setShowNewChatSidebar(false);
  };

  // Insert Emoji at current cursor position
  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setConversations(prev => prev.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  };

  // Filtering lists
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMessages = activeChat && activeChat.messages ? activeChat.messages.filter(msg => 
    !messageSearchQuery || (msg.text && msg.text.toLowerCase().includes(messageSearchQuery.toLowerCase()))
  ) : [];

  return (
    <div className="messages-container-page">
      <div className="messages-layout-wrapper">
        
        {/* ---- LEFT SIDEBAR: Conversation List / New Chat Sidebar ---- */}
        <div className="messages-left-sidebar">
          
          {!showNewChatSidebar ? (
            // Regular Conversations Sidebar View
            <>
              {/* Header & Search */}
              <div className="messages-left-sidebar-header">
                <div className="messages-sidebar-top-row">
                  <h2 className="messages-sidebar-title">Messages</h2>
                  <button 
                    onClick={handleNewChatOpen}
                    title="New Chat"
                    className="messages-new-chat-btn"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="messages-sidebar-search-box">
                  <Search size={16} className="messages-sidebar-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="messages-sidebar-search-input"
                  />
                </div>
              </div>

              {/* List of Chats */}
              <div className="messages-conversation-list">
                {filteredConversations.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    No active conversations
                  </div>
                ) : (
                  filteredConversations.map(chat => {
                    const lastMessage = chat.messages?.[chat.messages.length - 1];
                    const isActive = chat.id === activeChatId;

                    return (
                      <div 
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`messages-chat-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="messages-chat-item-avatar-box">
                          <div className="messages-chat-item-avatar">
                            {chat.avatar}
                          </div>
                          <div className={`messages-status-dot ${chat.isOnline ? 'online' : 'offline'}`} />
                        </div>

                        <div className="messages-chat-item-text-area">
                          <div className="messages-chat-item-first-row">
                            <h3 className="messages-chat-item-name" style={{ fontWeight: chat.unread > 0 ? 700 : 600 }}>
                              {chat.name}
                            </h3>
                            {lastMessage && (
                              <span className="messages-chat-item-time" style={{ fontWeight: chat.unread > 0 ? 600 : 400, color: chat.unread > 0 ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}>
                                {lastMessage.time}
                              </span>
                            )}
                          </div>
                          <div className="messages-chat-item-second-row">
                            <p className="messages-chat-item-preview-text" style={{ fontWeight: chat.unread > 0 ? 500 : 400, color: chat.unread > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                              {lastMessage?.sender === 'me' && (
                                <span style={{ color: 'var(--color-text-tertiary)' }}>You: </span>
                              )}
                              {lastMessage?.type === 'STICKER' ? 'Sent a sticker' : lastMessage?.type === 'ATTACHMENT' ? 'Sent a file' : (lastMessage?.text || 'Start conversation')}
                            </p>
                            {chat.unread > 0 && (
                              <div className="messages-chat-item-unread-bubble">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            // New Chat Sidebar View (Select User)
            <div className="messages-new-chat-drawer" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Header with Back Arrow */}
              <div className="messages-left-sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <button 
                    onClick={() => setShowNewChatSidebar(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="messages-sidebar-title" style={{ fontSize: '18px' }}>New Chat</h2>
                </div>
                
                {/* User query search bar */}
                <div className="messages-sidebar-search-box">
                  <Search size={16} className="messages-sidebar-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search people by name or email..." 
                    value={newChatSearchQuery}
                    onChange={handleNewChatQueryChange}
                    className="messages-sidebar-search-input"
                  />
                </div>
              </div>

              {/* Users search results list */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {isLoadingEligibleUsers ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Searching users...
                  </div>
                ) : eligibleUsers.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    No users found
                  </div>
                ) : (
                  eligibleUsers.map(partner => (
                    <div 
                      key={partner.id}
                      onClick={() => handleStartNewConversation(partner)}
                      style={{
                        padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                        display: 'flex', gap: '12px', alignItems: 'center', transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="messages-chat-item-avatar" style={{ marginRight: '12px' }}>
                        {partner.avatar}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {partner.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                          {partner.role} • {partner.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* ---- RIGHT PANE: Active Chat ---- */}
        {activeChat ? (
          <div className="messages-chat-area-container">
            
            {/* Header */}
            <div className="messages-chat-header">
              <div className="messages-chat-header-info">
                <div className="messages-chat-header-avatar">
                  {activeChat.avatar}
                </div>
                <div>
                  <h2 className="messages-chat-header-title">
                    {activeChat.name}
                  </h2>
                  <p className="messages-chat-header-status">
                    <span className={`messages-chat-header-status-dot ${activeChat.isOnline ? 'online' : 'offline'}`} />
                    {activeChat.isOnline ? 'Active Now' : 'Offline'} • {activeChat.roleContext}
                  </p>
                </div>
              </div>
              
              {/* Header Right Buttons */}
              <div className="messages-chat-header-actions">
                <Info 
                  size={20} 
                  className="messages-action-icon"
                  style={{ color: showDetailsPanel ? 'var(--color-primary)' : 'inherit' }} 
                  title="Details" 
                  onClick={() => setShowDetailsPanel(prev => !prev)}
                />
                
                {/* Three-Dot Menu Container */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                  <MoreVertical 
                    size={20} 
                    className="messages-action-icon"
                    onClick={() => setShowMenu(prev => !prev)}
                  />
                  {showMenu && (
                    <div className="chat-menu-dropdown">
                      <button onClick={() => { setShowMenu(false); setShowDetailsPanel(true); }} className="chat-menu-btn">View Profile</button>
                      <button onClick={() => { setShowMenu(false); setShowMessageSearch(prev => !prev); }} className="chat-menu-btn">Search Messages</button>
                      <button onClick={() => handleChatAction('mute', !activeChat.isMuted)} className="chat-menu-btn">
                        {activeChat.isMuted ? 'Unmute' : 'Mute Conversation'}
                      </button>
                      <button onClick={() => handleChatAction('archive')} className="chat-menu-btn">Archive Chat</button>
                      <button onClick={() => handleChatAction('clear')} className="chat-menu-btn">Clear Chat</button>
                      <button onClick={() => handleChatAction('delete')} className="chat-menu-btn">Delete Chat</button>
                      <button onClick={() => handleChatAction('block', true)} className="chat-menu-btn danger">Block User</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keyword Message Search Bar */}
            {showMessageSearch && (
              <div className="messages-keyword-search-bar">
                <Search size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Filter messages in this conversation..."
                  value={messageSearchQuery}
                  onChange={(e) => setMessageSearchQuery(e.target.value)}
                  className="messages-keyword-search-input"
                />
                <button onClick={() => { setShowMessageSearch(false); setMessageSearchQuery(''); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Message Thread */}
            <div className="messages-chat-thread">
              {displayedMessages.length === 0 && !isTyping ? (
                <div className="messages-thread-empty-state">
                  <MessageSquare size={32} className="messages-chat-item-empty-icon" />
                  <span>No messages yet. Send a message to start the conversation!</span>
                </div>
              ) : (
                <>
                  <div className="messages-date-divider">
                    <div className="messages-date-line" />
                    <span className="messages-date-text">Today</span>
                    <div className="messages-date-line" />
                  </div>

                  {displayedMessages.map((msg, idx) => {
                    const isMe = msg.sender === 'me';
                    const showAvatar = !isMe && (idx === 0 || activeChat.messages[idx - 1]?.sender !== 'them');

                    return (
                      <div key={msg.id} className={`messages-bubble-row ${isMe ? 'me' : 'them'}`}>
                        {!isMe && (
                          <div className="messages-bubble-avatar-placeholder">
                            {showAvatar && (
                              <div className="messages-bubble-avatar">
                                {activeChat.avatar}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="messages-bubble-content-box">
                          {msg.type === 'STICKER' ? (
                            <div className="messages-sticker-img-wrapper">
                              {STICKERS[msg.text] || <span style={{ fontStyle: 'italic' }}>[Sticker: {msg.text}]</span>}
                            </div>
                          ) : msg.type === 'ATTACHMENT' ? (
                            msg.attachments?.map(a => {
                              const isImage = a.fileType?.startsWith('image/');
                              if (isImage) {
                                return (
                                  <div key={a.id} className="messages-sticker-img-wrapper" style={{
                                    border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px',
                                    cursor: 'pointer', position: 'relative', background: 'var(--color-surface)'
                                  }} onClick={() => handleDownloadFile(a.id, a.fileName)}>
                                    <img src={`http://localhost:8080/api/v1/chat/attachments/download/${a.id}`} 
                                         alt={a.fileName} 
                                         style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', display: 'block' }}
                                         onError={(e) => {
                                           e.target.style.display = 'none';
                                         }}
                                    />
                                    <div style={{ 
                                      position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)',
                                      borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                                    }}>
                                      <Download size={14} />
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div 
                                  key={a.id} 
                                  onClick={() => handleDownloadFile(a.id, a.fileName)}
                                  className="messages-attachment-card"
                                >
                                  <div className="messages-attachment-icon-holder">
                                    <FileText size={20} />
                                  </div>
                                  <div className="messages-attachment-details">
                                    <p className="messages-attachment-name">
                                      {a.fileName}
                                    </p>
                                    <p className="messages-attachment-size">
                                      {(a.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <Download size={16} />
                                </div>
                              );
                            })
                          ) : (
                            <div className="messages-bubble-body">
                              {msg.text}
                            </div>
                          )}
                          
                          <div className="messages-bubble-meta">
                            <span>{msg.time}</span>
                            {isMe && (
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                {msg.status === 'sent' && <Check size={12} />}
                                {msg.status === 'delivered' && <CheckCheck size={12} />}
                                {msg.status === 'read' && <CheckCheck size={12} color="var(--color-primary)" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              
              {isTyping && (
                <div className="messages-bubble-row them">
                  <div className="messages-bubble-avatar-placeholder">
                    <div className="messages-bubble-avatar">
                      {activeChat.avatar}
                    </div>
                  </div>
                  <div className="messages-typing-box">
                    <span className="messages-typing-dot" />
                    <span className="messages-typing-dot" />
                    <span className="messages-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="messages-chat-input-bar">
              
              {/* EMOJI & STICKER PICKER POPUP */}
              {showEmojiPicker && (
                <div ref={pickerRef} className="messages-popup-emoji-picker">
                  <div className="messages-emoji-tab-bar">
                    <button 
                      onClick={() => setPickerTab('emoji')}
                      className={`messages-emoji-tab-btn ${pickerTab === 'emoji' ? 'active' : ''}`}
                    >
                      Emojis
                    </button>
                    <button 
                      onClick={() => setPickerTab('sticker')}
                      className={`messages-emoji-tab-btn ${pickerTab === 'sticker' ? 'active' : ''}`}
                    >
                      Stickers
                    </button>
                  </div>

                  <div className="messages-emoji-scroll-content">
                    {pickerTab === 'emoji' ? (
                      <div className="messages-emoji-grid">
                        {POPULAR_EMOJIS.map(emoji => (
                          <span 
                            key={emoji} 
                            onClick={() => handleEmojiSelect(emoji)}
                            className="messages-emoji-item-btn"
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="messages-sticker-grid">
                        {Object.keys(STICKERS).map(stickerId => (
                          <button 
                            key={stickerId}
                            onClick={() => handleSendSticker(stickerId)}
                            className="messages-sticker-item-btn"
                            type="button"
                          >
                            {STICKERS[stickerId]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Input Container */}
              <form onSubmit={handleSendMessage} className="messages-chat-form">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />

                <button 
                  type="button" 
                  onClick={handleAttachmentClick}
                  className="messages-chat-input-action-btn"
                  title="Attach File"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    sendTypingEvent();
                  }}
                  className="messages-chat-text-input"
                />
                <button 
                  type="button" 
                  className="messages-chat-input-action-btn emoji-toggle-btn"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  style={{ color: showEmojiPicker ? 'var(--color-primary)' : 'inherit' }}
                >
                  <Smile size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="messages-chat-send-btn"
                  style={{ 
                    opacity: inputText.trim() ? 1 : 0.6,
                    cursor: inputText.trim() ? 'pointer' : 'default',
                  }}
                >
                  <Send size={18} style={{ marginLeft: '2px' }} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
            <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto' }} />
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Select a conversation or start a new one to begin messaging</p>
            </div>
          </div>
        )}

        {/* ---- RIGHT SIDE PANEL: Partner Details Drawer ---- */}
        {showDetailsPanel && activeChat && (
          <div className="messages-details-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>User Details</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--color-text-secondary)' }} onClick={() => setShowDetailsPanel(false)} />
            </div>

            {isLoadingDetails ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Loading details...
              </div>
            ) : partnerDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
                <div style={{ 
                  width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '36px', fontWeight: 'bold',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {partnerDetails.avatar}
                </div>
                
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                    {partnerDetails.name}
                  </h4>
                  <span style={{ 
                    fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
                    color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '12px'
                  }}>
                    {partnerDetails.role}
                  </span>
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid var(--color-border)', width: '100%', margin: '10px 0' }} />

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    <Mail size={16} />
                    <span style={{ wordBreak: 'break-all' }}>{partnerDetails.email}</span>
                  </div>
                  {partnerDetails.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                      <MapPin size={16} />
                      <span>{partnerDetails.location}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    <Clock size={16} />
                    <span>{partnerDetails.lastActive}</span>
                  </div>

                  {partnerDetails.bio && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>About</span>
                      <p style={{ color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {partnerDetails.bio}
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleChatAction('block', true)}
                  style={{
                    marginTop: '20px', width: '100%', padding: '12px', border: '1px solid var(--color-danger)',
                    borderRadius: '8px', background: 'transparent', color: 'var(--color-danger)', fontSize: '14px',
                    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                >
                  Block User
                </button>
              </div>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                Could not load details
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Messages;
