import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ChatMessage from '../ChatMessage/ChatMessage';
import './Chat.css';

const Chat = ({ messages, sendMessage }) => {
  const [messageToSend, setMessageToSend] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(messageToSend);
    setMessageToSend('');
  };

  useEffect(() => {
    console.log('useEffect hit');
    const node = messagesEndRef.current;

    if (node) {
      console.log('node', node.scrollTop, node.scrollHeight);
    }

    if (node && node.scrollTop !== 0) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messagesEndRef]);

  return (
    <div className="chat-container">
      <div className="messages-container" ref={messagesEndRef}>
        {messages.map((message) => (
          <ChatMessage {...message} />
        ))}
      </div>
      <div className="input-container">
        <Form onSubmit={handleSubmit}>
          <Form.Control
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            placeholder="Type a message..."
            maxLength={140}
          />
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
