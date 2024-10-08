import React, { useState, useEffect } from 'react';
import webSocketService from '../services/WebsocketService';

interface ChatMessage {
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    webSocketService.setOnMessageReceivedCallback((message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      webSocketService.sendMessage({ content: input });
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {messages.map((msg: ChatMessage, index: number) => (
        <div key={index}>{msg.content}</div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;