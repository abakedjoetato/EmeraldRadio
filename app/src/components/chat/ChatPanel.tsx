import { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { chatAPI } from '@/services/api';
import { socketService } from '@/services/socket';
import { toast } from 'sonner';
import ProfileModal from './ProfileModal';

interface ChatMessage {
  _id: string;
  senderDisplayName: string;
  senderUsername?: string;
  message: string;
  createdAt: string;
  user?: {
    username: string;
    role: string;
  };
}

interface ChatPanelProps {
  stationSlug: string;
}

const ChatPanel = ({ stationSlug }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages(stationSlug, 50);
        setMessages(response.data.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();

    // Get username from localStorage or prompt
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, [stationSlug]);

  // Socket event handlers
  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleMessageDeleted = (data: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
    };

    const handleUserTyping = () => {
      setOtherTyping(true);
      setTimeout(() => setOtherTyping(false), 3000);
    };

    const handleUserStoppedTyping = () => {
      setOtherTyping(false);
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onMessageDeleted(handleMessageDeleted);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      socketService.offNewMessage();
      socketService.offMessageDeleted();
      socketService.offUserTyping();
      socketService.offUserStoppedTyping();
    };
  }, [stationSlug]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const displayName = username.trim() || 'Anonymous';

    // Save username
    if (username.trim()) {
      localStorage.setItem('chat_username', username.trim());
    }

    try {
      // Send via API
      await chatAPI.sendMessage(stationSlug, displayName, newMessage.trim());

      // Also emit via socket for real-time
      socketService.sendMessage(stationSlug, displayName, newMessage.trim());

      setNewMessage('');
      setIsTyping(false);
      socketService.emitStopTyping(stationSlug);
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error('Please wait before sending another message');
      } else {
        toast.error('Failed to send message');
      }
    }
  }, [newMessage, username, stationSlug]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.emitTyping(stationSlug, username || 'Anonymous');
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.emitStopTyping(stationSlug);
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-[#0F1623] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold">Live Chat</h3>
        <span className="text-xs text-[#9AA3B2]">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-[#9AA3B2] py-8">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="flex gap-3">
              <button
                onClick={() => {
                  if (msg.senderUsername) {
                    setSelectedUser(msg.senderUsername);
                    setIsProfileModalOpen(true);
                  }
                }}
                className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#00D084] to-[#2EE9FF] flex items-center justify-center flex-shrink-0 transition-all ${msg.senderUsername ? 'hover:ring-2 hover:ring-[#00D084]' : 'cursor-default'}`}
              >
                <span className="text-xs font-bold text-[#070B14]">
                  {(msg.senderDisplayName || 'A').charAt(0).toUpperCase()}
                </span>
              </button>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (msg.senderUsername) {
                        setSelectedUser(msg.senderUsername);
                        setIsProfileModalOpen(true);
                      }
                    }}
                    className={`font-medium text-sm truncate transition-colors ${msg.senderUsername ? 'hover:text-[#00D084]' : 'cursor-default'}`}
                  >
                    {msg.senderDisplayName}
                  </button>
                  {msg.user?.role === 'admin' && (
                    <span className="px-1.5 py-0.5 bg-[#00D084]/20 text-[#00D084] text-[10px] rounded uppercase">
                      Admin
                    </span>
                  )}
                  <span className="text-xs text-[#9AA3B2]">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-[#F2F5FA] break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}

        {otherTyping && (
          <div className="flex items-center gap-2 text-[#9AA3B2] text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#9AA3B2] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#9AA3B2] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 bg-[#9AA3B2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            Someone is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ProfileModal
        username={selectedUser}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Input */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {!username && (
          <input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084] transition-colors"
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Say something..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={300}
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2.5 bg-[#00D084] text-[#070B14] rounded-lg font-medium hover:bg-[#00E090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
