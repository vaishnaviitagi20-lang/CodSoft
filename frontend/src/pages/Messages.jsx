import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { getInitials, timeAgo } from "../utils/constants";

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get("/messages/conversations");
      setConversations(data);
      
      // Auto-select conversation if passed via state or query
      const stateConv = location.state?.conversationId;
      if (stateConv) {
        const found = data.find(c => c._id === stateConv);
        if (found) setSelectedConversation(found);
      } else if (data.length > 0 && !selectedConversation) {
        // Optionally don't auto-select first one to show inbox placeholder
        // setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error("Fetch Conversations Error:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const { data } = await api.get(`/messages/${id}`);
      setMessages(data);
    } catch (error) {
      console.error("Fetch Messages Error:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const recipient = getRecipient(selectedConversation);
    if (!recipient || recipient._id === "unknown") {
      toast.error("Cannot determine recipient");
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post("/messages", {
        recipientId: recipient._id,
        content: newMessage,
        conversationId: selectedConversation._id,
      });

      setMessages([...messages, data]);
      setNewMessage("");
      
      // Update last message in conversations list
      setConversations(prev => prev.map(c => 
        c._id === selectedConversation._id 
          ? { ...c, lastMessage: newMessage, updatedAt: new Date().toISOString() } 
          : c
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error("Send Message Error:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getRecipient = (conv) => {
    if (!conv || !conv.participants || !user) return { _id: "unknown", name: "User", role: "Unknown" };
    
    // Find the participant that is NOT the current user
    const other = conv.participants.find(
      (p) => p && p._id && p._id.toString() !== user._id.toString()
    );
    
    return other || { _id: "unknown", name: "System", role: "Support" };
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-500">
      <Navbar />

      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900/50 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-ink-100 dark:border-ink-800">
            <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Messages</h1>
            <p className="text-sm text-ink-400 mt-1">Connect with talent & recruiters</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-ink-50 dark:bg-ink-800 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 opacity-50">💬</div>
                <p className="text-ink-500 font-medium">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const recipient = getRecipient(conv);
                const isSelected = selectedConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-center gap-4 text-left transition-all border-b border-ink-50 dark:border-ink-800/50 ${isSelected ? 'bg-gold-500/5 border-l-4 border-l-gold-500' : 'hover:bg-ink-50 dark:hover:bg-ink-800/30'}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center font-bold text-ink-600 dark:text-ink-300 shadow-sm flex-shrink-0">
                      {getInitials(recipient.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-ink-900 dark:text-white truncate text-sm">{recipient.name}</h3>
                        <span className="text-[10px] text-ink-400">{timeAgo(conv.updatedAt)}</span>
                      </div>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate font-medium">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      <p className="text-[10px] text-gold-600 dark:text-gold-400 font-bold uppercase tracking-widest mt-1 opacity-60">
                        {recipient.role}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col bg-white/30 dark:bg-ink-950/30 backdrop-blur-sm ${!selectedConversation ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {!selectedConversation ? (
            <div className="text-center p-12">
              <div className="w-24 h-24 bg-ink-900 dark:bg-ink-800 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow transition-transform hover:scale-110 duration-500">
                🚀
              </div>
              <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-3">Your Inbox</h2>
              <p className="text-ink-500 dark:text-ink-400 max-w-sm mx-auto text-lg">
                Select a conversation to start collaborating and moving applications forward.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-4 bg-white/50 dark:bg-ink-900/50 backdrop-blur-xl">
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="w-10 h-10 rounded-xl bg-ink-900 dark:bg-white flex items-center justify-center text-gold-400 dark:text-ink-900 font-bold shadow-md">
                  {getInitials(getRecipient(selectedConversation).name)}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 dark:text-white">{getRecipient(selectedConversation).name}</h3>
                  <p className="text-[10px] text-jade-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-jade-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <p className="text-4xl mb-2">💬</p>
                    <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation below</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.sender && (msg.sender._id === user._id || msg.sender === user._id);
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe ? 'bg-ink-900 text-white rounded-tr-none' : 'bg-white dark:bg-ink-800 text-ink-900 dark:text-white rounded-tl-none border border-ink-100 dark:border-ink-700'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-2 font-medium opacity-50 ${isMe ? 'text-blue-100' : 'text-ink-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white/50 dark:bg-ink-900/50 backdrop-blur-xl border-t border-ink-100 dark:border-ink-800">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 input bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 focus:border-gold-500 focus:ring-gold-500/10 rounded-2xl"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-gold w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow shadow-gold-500/20"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

