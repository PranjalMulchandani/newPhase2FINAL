const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { PeerServer } = require('peer');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:4200", 
      methods: ["GET", "POST"]
  }
});
const corsOptions = {
  origin: 'http://localhost:4200', // Here is the angular app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // here are the allowed  necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

app.use(express.json());



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection defined
mongoose.connect('mongodb://localhost/chatapp', {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));




const peerServer = PeerServer({ port: 9000, path: '/peerjs' });


app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/chats', require('./routes/chats'));




io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user intends to join a room (group + channel)
  socket.on('joinRoom', ({ groupId, channelId }) => {
    const roomName = `${groupId}_${channelId}`;  // here you can dynamically create room name
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);

    // by using it you can notify others
    socket.to(roomName).emit('userJoined', {
      message: `User ${socket.id} has joined the channel`,
      userId: socket.id
    });
  });

  // The purpose here is to handle sending messages to a particular room
  socket.on('chatMessage', ({ groupId, channelId, message }) => {
    const roomName = `${groupId}_${channelId}`;
    console.log(`Message sent to room ${roomName}:`, message);

    // Broadcasting the message to everyone who is in the room
    io.to(roomName).emit('message', message);
  });

  //  purpose here is to handle leaving a room (for real-time user updates)
  socket.on('leaveRoom', ({ groupId, channelId }) => {
    const roomName = `${groupId}_${channelId}`;
    socket.leave(roomName);
    console.log(`User left room: ${roomName}`);

    // Notify others in the room
    socket.to(roomName).emit('userLeft', {
      message: `User ${socket.id} has left the channel`,
      userId: socket.id
    });
  });

  // The purpose here is to disconnect event for cleaning up when users leave
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Begin the server from here
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
