import { useState } from 'react';
import './App.css';
import Chat from './components/Chat/Chat';
import NameForm from './components/NameForm/NameForm';

const WS_PROTOCOL = process.env.REACT_APP_USE_WSS === 'false' ? 'ws' : 'wss';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showLandingForm, setShowLandingForm] = useState(true);

  const connectToServer = (e, name) => {
    e.preventDefault();
    console.log('Opening connection');
    const ws = new WebSocket(`${WS_PROTOCOL}://${window.location.host}`);

    ws.onopen = () => {
      console.log('Connection opened');
      ws.send(
        JSON.stringify({
          type: 'SET_NAME',
          value: name
        })
      );
      setShowLandingForm(false);
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('Message received', message);
      setMessages((messages) => [...messages, message]);
    };

    ws.onclose = () => {
      console.log('Connection closed');
    };

    setSocket(ws);
  };

  const sendMessage = (message) => {
    socket.send(
      JSON.stringify({
        type: 'MESSAGE_SEND',
        value: message
      })
    );
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        {showLandingForm ? (
          <NameForm onSubmit={connectToServer} />
        ) : (
          <Chat messages={messages} sendMessage={sendMessage} />
        )}
      </div>
    </div>
  );
};

export default App;
