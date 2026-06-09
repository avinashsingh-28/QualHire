import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Paperclip, Send, MoreVertical, Phone, Video, 
  Check, CheckCheck, Smile, Info, Clock, Circle
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import './candidate/Dashboard.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

// ---- Mock Data ----
const CANDIDATE_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Sarah Jenkins (Recruiter)',
    company: 'Tech Corp',
    avatar: 'S',
    isOnline: true,
    unread: 2,
    roleContext: 'Senior Frontend Engineer',
    messages: [
      { id: 'm1', sender: 'them', text: 'Hi Alex! We loved your portfolio.', time: '10:30 AM', status: 'read' },
      { id: 'm2', sender: 'them', text: 'Are you available for a quick chat tomorrow?', time: '10:31 AM', status: 'read' }
    ]
  },
  {
    id: 'c2',
    name: 'Michael Chang (Mentor)',
    company: 'Industry Expert',
    avatar: 'M',
    isOnline: false,
    unread: 0,
    roleContext: 'Career Mentorship',
    messages: [
      { id: 'm1', sender: 'me', text: 'Thanks for the resume review!', time: 'Yesterday', status: 'read' },
      { id: 'm2', sender: 'them', text: 'You are welcome. Your experience section looks much stronger now.', time: 'Yesterday', status: 'read' }
    ]
  }
];

const RECRUITER_CONVERSATIONS = [
  {
    id: 'r1',
    name: 'Alex Johnson',
    company: 'Candidate',
    avatar: 'A',
    isOnline: true,
    unread: 1,
    roleContext: 'Senior Frontend Engineer',
    messages: [
      { id: 'm1', sender: 'me', text: 'Hi Alex! We loved your portfolio. Are you available for a chat tomorrow?', time: '10:30 AM', status: 'read' },
      { id: 'm2', sender: 'them', text: 'Hi Sarah, thank you! Yes, I am free after 2 PM EST tomorrow.', time: '11:15 AM', status: 'delivered' }
    ]
  },
  {
    id: 'r2',
    name: 'Priya Sharma',
    company: 'Candidate',
    avatar: 'P',
    isOnline: false,
    unread: 0,
    roleContext: 'Data Scientist',
    messages: [
      { id: 'm1', sender: 'me', text: 'We have sent over the offer letter via email. Let me know if you have any questions.', time: 'Tuesday', status: 'read' },
      { id: 'm2', sender: 'them', text: 'Received it! I will review and get back to you by tomorrow. Super excited!', time: 'Tuesday', status: 'read' }
    ]
  }
];

const Messages = () => {
  const { user, role } = useAuth();
  
  // Choose the mock data based on role
  const initialConversations = role === 'candidate' ? CANDIDATE_CONVERSATIONS : RECRUITER_CONVERSATIONS;
  
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState(initialConversations[0]?.id);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const currentUserId = user?.id || (role === 'candidate' ? 'user_candidate' : 'user_recruiter');

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Scroll to bottom when active chat changes or new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // ==========================================================================
  // WEBSOCKET INTEGRATION via STOMP & SockJS
  // ==========================================================================
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: function (str) {
        console.log(str);
      },
    });

    client.onConnect = () => {
      console.log('Connected to STOMP Broker');
      
      // Subscribe to all conversation topics
      initialConversations.forEach(chat => {
        client.subscribe(`/topic/messages/${chat.id}`, (message) => {
          const payload = JSON.parse(message.body);
          
          if (payload.type === 'CHAT') {
            handleIncomingMessage(payload);
          } else if (payload.type === 'TYPING') {
            if (payload.chatId === activeChatId && payload.senderId !== currentUserId) {
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 3000); // Hide after 3 seconds
            }
          }
        });
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [activeChatId, initialConversations, currentUserId]);

  const handleIncomingMessage = (payload) => {
    // If the message was sent by us, it will be echoed back. We can use it to update status.
    const isMe = payload.senderId === currentUserId;
    
    setConversations(prev => prev.map(chat => {
      if (chat.id === payload.chatId) {
        // Check if message already exists locally
        const existingMsg = chat.messages.find(m => m.id === payload.id);
        if (existingMsg) {
           // Update status to delivered if echoed back
           const updatedMessages = chat.messages.map(m => m.id === payload.id ? { ...m, status: payload.status } : m);
           return { ...chat, messages: updatedMessages };
        } else {
           // It's a new message from someone else
           const newMsg = {
             id: payload.id,
             sender: 'them',
             text: payload.text,
             time: payload.time,
             status: 'read'
           };
           // Increment unread if not active chat
           const unreadIncrement = activeChatId === chat.id ? 0 : 1;
           return { ...chat, messages: [...chat.messages, newMsg], unread: chat.unread + unreadIncrement };
        }
      }
      return chat;
    }));
  };

  const sendTypingEvent = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          id: `t_${Date.now()}`,
          chatId: activeChatId,
          senderId: currentUserId,
          text: '',
          time: '',
          type: 'TYPING'
        })
      });
    }
  };
  // ==========================================================================

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageId = `m_${Date.now()}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Optimistic UI update
    const optimisticMessage = {
      id: messageId,
      sender: 'me',
      text: inputText.trim(),
      time: timeNow,
      status: 'sent' 
    };

    setConversations(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, optimisticMessage], unread: 0 };
      }
      return chat;
    }));
    
    // 2. Publish to backend via WebSocket
    if (stompClientRef.current && stompClientRef.current.connected) {
       stompClientRef.current.publish({
         destination: '/app/chat.sendMessage',
         body: JSON.stringify({
           id: messageId,
           chatId: activeChatId,
           senderId: currentUserId,
           text: inputText.trim(),
           time: timeNow,
           status: 'sent',
           type: 'CHAT'
         })
       });
    } else {
       // Fallback mock timeout if WS not connected
       setTimeout(() => {
          setConversations(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              const updatedMessages = chat.messages.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m);
              return { ...chat, messages: updatedMessages };
            }
            return chat;
          }));
       }, 1000);
    }
    
    setInputText('');
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    // Mark as read
    setConversations(prev => prev.map(chat => chat.id === chatId ? { ...chat, unread: 0 } : chat));
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page" style={{ height: 'calc(100vh - 80px)', padding: '0', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', height: '100%', background: 'var(--color-surface)' }}>
        
        {/* ---- LEFT SIDEBAR: Conversation List ---- */}
        <div style={{ width: '350px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          
          {/* Sidebar Header & Search */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Messages</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', 
                  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* List of Chats */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map(chat => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const isActive = chat.id === activeChatId;

              return (
                <div 
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  style={{
                    padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                    background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                    display: 'flex', gap: '12px', alignItems: 'center', transition: 'background 0.2s'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold'
                    }}>
                      {chat.avatar}
                    </div>
                    {/* Online Status Indicator */}
                    <div style={{ 
                      position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', 
                      borderRadius: '50%', background: chat.isOnline ? '#10b981' : '#94a3b8', 
                      border: '2px solid var(--color-surface)' 
                    }} title={chat.isOnline ? 'Online' : 'Offline'} />
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: chat.unread > 0 ? 700 : 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.name}
                      </h3>
                      {lastMessage && (
                        <span style={{ fontSize: '11px', color: chat.unread > 0 ? '#3b82f6' : 'var(--color-text-tertiary)', fontWeight: chat.unread > 0 ? 600 : 400, flexShrink: 0, marginLeft: '8px' }}>
                          {lastMessage.time}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ 
                        fontSize: '13px', color: chat.unread > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', 
                        fontWeight: chat.unread > 0 ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        {lastMessage?.sender === 'me' && (
                          <span style={{ color: 'var(--color-text-tertiary)' }}>You: </span>
                        )}
                        {lastMessage?.text || 'Start a conversation'}
                      </p>
                      {chat.unread > 0 && (
                        <div style={{ 
                          background: '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: 'bold', 
                          height: '20px', minWidth: '20px', borderRadius: '10px', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center', padding: '0 6px', marginLeft: '8px'
                        }}>
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- RIGHT PANE: Active Chat ---- */}
        {activeChat ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            
            {/* Chat Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', fontWeight: 'bold'
                  }}>
                    {activeChat.avatar}
                  </div>
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeChat.name}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Circle size={10} fill={activeChat.isOnline ? '#10b981' : '#94a3b8'} color={activeChat.isOnline ? '#10b981' : '#94a3b8'} />
                    {activeChat.isOnline ? 'Active Now' : 'Offline'} • {activeChat.roleContext}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-secondary)' }}>
                <Phone size={20} style={{ cursor: 'pointer' }} title="Voice Call (Coming Soon)" />
                <Video size={20} style={{ cursor: 'pointer' }} title="Video Call (Coming Soon)" />
                <Info size={20} style={{ cursor: 'pointer' }} title="Details" />
                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Chat Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Date Divider Mock */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span style={{ padding: '0 12px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Today</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>

              {activeChat.messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                const showAvatar = !isMe && (idx === 0 || activeChat.messages[idx - 1].sender !== 'them');

                return (
                  <div key={msg.id} style={{ display: 'flex', gap: '12px', alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    {!isMe && (
                      <div style={{ width: '32px' }}>
                        {showAvatar && (
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold'
                          }}>
                            {activeChat.avatar}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        background: isMe ? '#3b82f6' : 'var(--color-surface)', 
                        color: isMe ? '#fff' : 'var(--color-text-primary)',
                        padding: '12px 16px', borderRadius: '16px',
                        borderBottomRightRadius: isMe ? '4px' : '16px',
                        borderBottomLeftRadius: !isMe ? '4px' : '16px',
                        border: isMe ? 'none' : '1px solid var(--color-border)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                        <span>{msg.time}</span>
                        {isMe && (
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            {msg.status === 'sent' && <Check size={14} />}
                            {msg.status === 'delivered' && <CheckCheck size={14} />}
                            {msg.status === 'read' && <CheckCheck size={14} color="#3b82f6" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                    {activeChat.avatar}
                  </div>
                  <div style={{ background: 'var(--color-surface)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-tertiary)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }} />
                    <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-tertiary)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-tertiary)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div style={{ padding: '20px 24px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', background: 'var(--color-bg)', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '8px' }} title="Attach File / Resume">
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
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    padding: '10px 0', fontSize: '15px', color: 'var(--color-text-primary)'
                  }}
                />
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '8px' }}>
                  <Smile size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  style={{ 
                    background: inputText.trim() ? '#3b82f6' : 'var(--color-border)', 
                    color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputText.trim() ? 'pointer' : 'default',
                    transition: 'background 0.2s'
                  }}
                >
                  <Send size={18} style={{ marginLeft: '2px' }} />
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                <strong>Enter</strong> to send. Press Shift + Enter to add a new line.
              </div>
            </div>

            {/* Animation styles for typing indicator */}
            <style>{`
              @keyframes typing {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
            <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto' }} />
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
