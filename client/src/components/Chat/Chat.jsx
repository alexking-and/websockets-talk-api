import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ChatMessage from '../ChatMessage/ChatMessage';
import './Chat.css';

const Chat = ({ messages, sendMessage }) => {
  const [messageToSend, setMessageToSend] = useState('');
  const [shouldScrollBottom, setShouldScrollBottom] = useState(true);
  const messagesContainerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!messageToSend.length) {
      return;
    }

    sendMessage(messageToSend);
    setMessageToSend('');
  };

  const handleScroll = () => {
    const node = messagesContainerRef.current;
    const isScrolledUp = node.scrollTop + 200 < node.scrollHeight - node.clientHeight;
    setShouldScrollBottom(!isScrolledUp);
  };

  useEffect(() => {
    if (shouldScrollBottom) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [shouldScrollBottom, messages]);

  return (
    <div className="chat-container">
      <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
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
