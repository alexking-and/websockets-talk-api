const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

/* Config */

const port = process.env.PORT || 8080;
const wssConfig = {};
let httpsServer;
if (process.env.USE_HTTPS_SERVER === 'true') {
  httpsServer = https.createServer({
    cert: fs.readFileSync('server.crt'),
    key: fs.readFileSync('server.key')
  });
  wssConfig.server = httpsServer;
} else {
  wssConfig.port = port;
}

const wss = new WebSocket.Server(wssConfig);

/* Global vars */

const clients = [];
let idCounter = 0;

/* WebSockets */

wss.on('connection', (ws) => {
  // Add to list of connected clients
  console.debug('New client connected');
  ws.id = idCounter++;
  clients.push(ws);

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
        clients.forEach((client) =>
          client.send(
            JSON.stringify({
              type: 'USER_JOIN',
              value: message.value
            })
          )
        );
        break;

      case 'MESSAGE_SEND':
        // Send out to all clients with sender's name
        clients.forEach((client) =>
          client.send(
            JSON.stringify({
              type: 'MESSAGE_RECEIVE',
              value: message.value,
              sender: ws.name
            })
          )
        );
        break;

      default:
        console.debug('Unknown message type', message.type);
    }
  });

  ws.on('close', () => {
    console.debug('Client closed connection', ws.id, ws.name);

    // Remove from client list
    clients.splice(
      clients.findIndex((client) => client.id === ws.id),
      1
    );

    // Notify other clients
    if (ws.name) {
      clients.forEach((client) =>
        client.send(
          JSON.stringify({
            type: 'USER_LEAVE',
            value: ws.name
          })
        )
      );
    }
  });
});

if (httpsServer) {
  httpsServer.listen(port);
}

console.debug(`Server started on port ${port}`);
