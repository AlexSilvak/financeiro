import React, { useState } from 'react';
import './global.css'; // <== Novo caminho

function ChatAI() {
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar hoje?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);

    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Resposta automática do assistente.", sender: "bot" }]);
    }, 1000);

    setInput('');
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatAI;
