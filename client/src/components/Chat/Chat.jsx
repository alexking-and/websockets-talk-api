const { useState } = require('react');
const { Form, Button } = require('react-bootstrap');

const Chat = ({ messages, sendMessage }) => {
  const [messageToSend, setMessageToSend] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(messageToSend);
    setMessageToSend("")
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map(message => (
          <div>
            {message.sender && <h6>{message.sender}</h6>}
            <p>{message.value}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <Form onSubmit={handleSubmit}>
          <Form.Control value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} placeholder="Type a message..." />
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
