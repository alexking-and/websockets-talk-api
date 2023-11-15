import { useState } from 'react';
import './App.css';
import NameForm from './components/NameForm/NameForm';

const PROTOCOL = process.env.REACT_APP_USE_WSS === 'true' ? 'wss' : 'ws';
const HOST = process.env.REACT_APP_API_HOST;

const App = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const connectToServer = (name) => {
    const ws = new WebSocket(`${PROTOCOL}://${HOST}`);

    ws.onopen = () => {
      console.log('Connection opened');
      ws.send(
        JSON.stringify({
          type: 'SET_NAME',
          value: name
        })
      );
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log('Message received', message);
      setMessages((messages) => [...messages, message]);
    };

    ws.onclose = () => {
      console.log('Connection closed');
    };

    setWs(ws);
  };

  const sendMessage = (message) => {
    ws.send(
      JSON.stringify({
        type: 'MESSAGE_SEND',
        value: message
      })
    );
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <NameForm onSubmit={connectToServer} />
      </div>
    </div>
  );
};

export default App;
