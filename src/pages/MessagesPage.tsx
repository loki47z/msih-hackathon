import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, Send, ArrowLeft, Phone, MoreVertical, Paperclip, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockMessages } from '@/data/products';
import { getRelativeTime } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

export function MessagesPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hello! I\'m interested in your product.', sender: 'user', timestamp: new Date().toISOString() },
    { id: '2', text: 'Yes, the mangoes are still available!', sender: 'other', timestamp: new Date().toISOString() },
  ]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const selectedConversation = mockMessages.find(m => m.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Messages Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('messages.title') || 'Messages'}</h1>
            <p className="text-muted-foreground">Connect with buyers and sellers</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversation List */}
            <div className={`w-full md:w-96 border-r border-border flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('messages.search') || 'Search conversations...'}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {mockMessages.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                      selectedChat === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      {conversation.senderAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base truncate">{conversation.senderName}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {getRelativeTime(conversation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 font-medium">
                        {conversation.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat View */}
            <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
              {selectedChat && selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {selectedConversation.senderAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{selectedConversation.senderName}</h3>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-sm text-muted-foreground">Online</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Call">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="More options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                    {chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t border-border bg-card">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Attach file"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Send image"
                        >
                          <Image className="w-4 h-4" />
                        </button>
                      </div>
                      <Input
                        placeholder={t('messages.placeholder') || 'Type your message...'}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 h-11"
                      />
                      <Button type="submit" size="icon" className="h-11 w-11">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background/50">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                  <p className="text-center max-w-md">{t('messages.no_messages') || 'Select a conversation to start messaging'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
