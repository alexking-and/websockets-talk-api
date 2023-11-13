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
  ws.id = idCounter++;
  clients.push(ws);

  ws.on('message', (message) => {
    switch (message.type) {
      case 'SET_NAME':
        // Set name on the socket
        ws.name = message.value;

        // Notify other clients
        clients.forEach((client) =>
          client.send({
            type: 'USER_JOIN',
            value: message.value
          })
        );
        break;

      case 'MESSAGE_SEND':
        // Send out to all clients
        clients.forEach((client) =>
          client.send({
            type: 'MESSAGE_RECEIVE',
            value: message.value
          })
        );
        break;
    }
  });

  ws.on('close', () => {
    // Remove from client list
    clients.splice(
      clients.findIndex((client) => client.id === ws.id),
      1
    );

    // Notify other clients
    if (ws.name) {
      clients.forEach((client) =>
        client.send({
          type: 'USER_LEAVE',
          value: ws.name
        })
      );
    }
  });
});

if (httpsServer) {
  httpsServer.listen(port);
}

console.debug(`Server started on port ${port}`);
