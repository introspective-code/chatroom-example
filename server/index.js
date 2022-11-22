const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors')

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(cors());

app.get('/api', (req, res) => {
  res.json({ message: 'success' })
});

io.on('connection', (socket) => {
  console.log(`[ server.js ] ${socket.id} connected`);

  socket.on('ping', () => {
    console.log(`[ server.js ] Ping received from ${socket.id}`)

    socket.emit('pong');
  })

  socket.on('disconnect', () => {
    console.log(`[ server.js ] ${socket.id} disconnected`);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`[ server.js ] Websocket server running on port ${server.address().port}`);
});
