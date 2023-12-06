const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const activeUsers = {}; // Keep track of active users in each room

// Manage socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  let username;
  let room;

  // Listen for a user joining the chat
  socket.on('joinChat', (userData) => {
    username = userData.username;
    room = userData.room || 'default';
    io.emit('chatMessage', {
        username: 'System',
        message: `${username} has joined the chat.`,
        timestamp: new Date().toLocaleTimeString(),
      });

    // Join the specified room
    socket.join(room);

    // Update the user list for the room and notify all users
    updateAndNotifyUserList(room, username, true);
  });

  // Listen for a user exiting the chat
  socket.on('exitChat', () => {
    io.emit('chatMessage', {
        username: 'System',
        message: `${username} has exited the chat.`,
        timestamp: new Date().toLocaleTimeString(),
      });
    // Update the user list for the room and notify all users
    updateAndNotifyUserList(room, username, false);

    // Leave the room
    socket.leave(room);
  });

  // Listen for a user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected');

    // If the user has joined the chat, update the user list for the room and notify all users
    if (username) {
      updateAndNotifyUserList(room, username, false);
    }
  });

  // Listen for chat messages
    socket.on('chatMessage', (data) => {
        if (data.username === username) {
        // Sender is the current user, send a custom acknowledgment message
        socket.emit('systemMessage', {
            username: 'System',
            message: `Hello, ${username}! Your message "${data.message}" has been received.`,
            timestamp: new Date().toLocaleTimeString(),
        });
        } else {
        // Broadcast the original message to all clients except the sender
        io.to(room).emit('chatMessage', data);
        }
    });

  // Listen for a request to get the user list in a room
  socket.on('getRoomUserList', () => {
    updateAndNotifyUserList(room);
  });

  function updateAndNotifyUserList(room, user, isActive = true) {
    // Update the user list for the room
    if (isActive) {
      activeUsers[room] = activeUsers[room] || [];
      activeUsers[room].push(user);
    } else {
      activeUsers[room] = activeUsers[room].filter((u) => u !== user);
    }

    // Notify all users in the room about the updated user list
    io.to(room).emit('userList', activeUsers[room].map((u) => ({ username: u, isActive })));
  }
  function updateAndNotifyUserList(room, user, isActive = true) {
    const isNewUser = !activeUsers[room] || activeUsers[room].indexOf(user) === -1;
  
    // Update the user list for the room
    if (isActive) {
      activeUsers[room] = activeUsers[room] || [];
      activeUsers[room].push(user);
    } else {
      activeUsers[room] = activeUsers[room].filter((u) => u !== user);
    }
  
    // Notify all users in the room about the updated user list
    io.to(room).emit('userList', activeUsers[room].map((u) => ({ username: u, isActive })));
  
  }
});
