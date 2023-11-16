const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');

const app = express();

let server;
if (process.env.USE_HTTPS_SERVER === 'true') {
  server = https.createServer(
    {
      cert: fs.readFileSync('server.crt'),
      key: fs.readFileSync('server.key')
    },
    app
  );
} else {
  server = http.createServer(app);
}

const wss = new WebSocket.Server({ server });

app.use(express.static('./client/build'));

const socketIsActive = (client) => client.readyState === WebSocket.OPEN;

wss.on('connection', (ws) => {
  console.debug('New client connected');

  ws.on('message', (messageBuffer) => {
    // Parse message as JSON
    let message;
    try {
      message = JSON.parse(messageBuffer);
    } catch (e) {
      console.error('Failed to parse message', messageBuffer);
      return;
    }
    console.debug('Message received', message);

    switch (message.type) {
      case 'SET_NAME':
        // Set name on the socket
        ws.name = message.value;

        // Notify other clients
        wss.clients.forEach((client) => {
          if (socketIsActive(client)) {
            client.send(
              JSON.stringify({
                type: 'USER_JOIN',
                value: message.value
              })
            );
          }
        });
        break;

      case 'MESSAGE_SEND':
        // Send out to all clients with sender's name
        wss.clients.forEach((client) => {
          if (socketIsActive(client)) {
            client.send(
              JSON.stringify({
                type: 'MESSAGE_RECEIVE',
                value: message.value,
                sender: ws.name
              })
            );
          }
        });
        break;

      default:
        console.debug('Unknown message type', message.type);
    }
  });

  ws.on('close', () => {
    console.debug('Client closed connection', ws.name);

    // Notify other clients
    if (ws.name) {
      wss.clients.forEach((client) => {
        if (socketIsActive(client)) {
          client.send(
            JSON.stringify({
              type: 'USER_LEAVE',
              value: ws.name
            })
          );
        }
      });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server started on port ${port}`));
