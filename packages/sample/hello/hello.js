function main(args) {
  /*
    let name = args.name || 'stranger'
    let greeting = 'Hello ' + name + '!'
    console.log(greeting)
    return {"body": greeting}
    */


/* * /
const express = require('express');
const app = express();

// get our port
const port = process.env.PORT || 3000;

// applicaton code goes here

// have node listen on our port
app.listen(port, () => console.log(`App listening on port ${port}!`));



/* */
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('cert/playtest.ph.crt'),
  key: fs.readFileSync('cert/playtest.ph.key')
});


const port = 3002;
// Create a new WebSocket server instance
const wss = new WebSocket.Server({ port: port });

// Create a map to store client connections with their IDs
const clients = new Map();
const peerids = new Map();
const agents = new Map();
const logbook = new Map();
wss.on("connection", (ws) => {
  const clientId = generateClientId();
  clients.set(clientId, ws);

  console.log(`Client ${clientId} connected`);

  ws.on("message", (message) => {
    console.log(`Received message from client ${clientId}: ${message}`);

    let m = JSON.parse(message);

    if (m.action === "register") {
      if (m.account_type == "agent") { 
          agents.set( clientId, ws); 
      }

      if (m.account_type == "client") {
        let client = clients.get(clientId);
        //console.log( client )
        if (client) {
          
          peerids.set(clientId, m.peerjsid);
          broadcast();
        }
      }
    }

    if (m.action == "get_list") {
      let agent = clients.get(clientId);
      if (agent) {
        const clientArray = Array.from(peerids.values());
        //console.log( clientArray );
        ws.send(JSON.stringify({ action: "response", content: clientArray }));
      }
    }
  });

  ws.on("close", () => {
    console.log(`Client ${clientId} disconnected`);
    // Remove the client from the map when they disconnect
    clients.delete(clientId);
    peerids.delete(clientId);
    agents.delete(clientId);
    broadcast();
  });
});

// Custom "broadcast" function to send messages to all connected clients
function broadcast() {
  const clientArray = Array.from(peerids.values());
  //console.log( clientArray );
  let message = JSON.stringify({ action: "response", content: clientArray });
  agents.forEach((agent) => { 
    agent.send(message);
  });
}

// Function to generate a unique client ID
function generateClientId() {
  return Math.random().toString(36).substr(2, 9);
}

console.log("WebSocket server is running on port ", port);
/* */

  }

exports.main = main
